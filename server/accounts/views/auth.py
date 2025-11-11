from django.conf import settings
from django.db import transaction, IntegrityError
from django.contrib.auth import get_user_model
from django.utils import timezone

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import TokenError
from rest_framework.permissions import AllowAny

from accounts.exceptions import EmailAlreadyVerifiedError, InvalidRefreshTokenError
from accounts.models import Device, EmailVerificationCode, UserDevice
from accounts.tasks import (
  send_verification_email,
  send_password_reset_email,
  send_new_device_email,
)
from accounts.serializers import (
  UserSerializer,
  LoginSerializer,
  EmailVerificationSerializer,
  PasswordResetSerializer,
  PasswordResetConfirmSerializer,
  ValidatePasswordResetTokenSerializer,
  UpdateUsernameSerializer,
)
from accounts.services.auth import (
  ensure_refresh_allowed,
  decode_refresh_payload,
  blacklist_all_refresh_tokens_for_user,
  create_response_with_tokens,
  create_response_only_user,
  reset_token_from_request,
  delete_refresh_from_cookie,
  generate_reset_link
)
from core.utils import get_client_ip

User = get_user_model()

class PendingRegisterView(generics.CreateAPIView):
  permission_classes = [AllowAny]
  serializer_class = UserSerializer
  throttle_scope = 'register'

  def create(self, request: Request, *args, **kwargs) -> Response:
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    with transaction.atomic():
      user: User = serializer.save()
      verification = EmailVerificationCode.objects.create(user=user)
      raw_code = verification.generate_code()
      send_verification_email.delay_on_commit(user.email, raw_code)

    response: Response = create_response_with_tokens(request, user, status.HTTP_201_CREATED)
    return response


class EmailConfirmView(APIView):
  throttle_scope = 'email_confirm'

  def post(self, request: Request) -> Response:
    with transaction.atomic():
      serializer = EmailVerificationSerializer(
        data=request.data,
        context={'user': request.user}
      )
      serializer.is_valid(raise_exception=True)
      user: User = serializer.save()

    response: Response = create_response_with_tokens(request, user, status.HTTP_200_OK)
    return response


class ResendCodeView(APIView):
  throttle_scope = 'resend_code'

  def post(self, request: Request) -> Response:
    user: User = request.user

    if user.is_email_verified:
      raise EmailAlreadyVerifiedError()

    try:
      with transaction.atomic():
        verification, created = EmailVerificationCode.objects.get_or_create(user=user)
        if not created:
          verification = EmailVerificationCode.objects.select_for_update().get(user=user)

        raw_code = verification.regenerate_code()
        send_verification_email.delay_on_commit(user.email, raw_code)
    except IntegrityError:
      verification = EmailVerificationCode.objects.get(user=user)
      raw_code = verification.regenerate_code()
      send_verification_email.delay(user.email, raw_code)

    return Response(status=status.HTTP_202_ACCEPTED)


class LoginView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'login'

  def post(self, request: Request) -> Response:
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user: User = serializer.save()

    if not user.is_email_verified:
      self._send_verification_email(user)
    else:
      device_payload: dict | None = serializer.validated_data.get('device')
      ip: str | None = get_client_ip(request)
      self._record_device(user, device_payload, ip)

    response: Response = create_response_with_tokens(request, user, status.HTTP_200_OK)
    return response

  def _send_verification_email(self, user: User) -> None:
    with transaction.atomic():
      verification, _ = EmailVerificationCode.objects.get_or_create(user=user)
      raw_code = verification.regenerate_code()
      send_verification_email.delay_on_commit(user.email, raw_code)

  def _record_device(
    self,
    user: User,
    payload: dict | None,
    ip: str | None,
  ) -> None:
    if payload is None:
      return

    if ip is not None:
      payload['last_ip'] = ip

    payload['last_seen'] = timezone.now()
    defaults = self.get_device_defaults(payload)

    try:
      with transaction.atomic():
        device, _ = Device.objects.update_or_create(
          device_id=payload['device_id'],
          defaults=defaults,
        )
    except IntegrityError:
      device = Device.objects.get(device_id=payload['device_id'])
      for key, value in defaults.items():
        setattr(device, key, value)
      device.save(update_fields=list(defaults.keys()))

    try:
      with transaction.atomic():
        _, link_created = UserDevice.objects.get_or_create(user=user, device=device)
    except IntegrityError:
      link_created = False

    if link_created:
      platform: str | None = payload.get('platform')
      send_new_device_email.delay_on_commit(user.email, platform, ip)

  def get_device_defaults(self, payload: dict) -> dict:
    updatable = Device.get_updatable_fields()
    defaults: dict = {}

    for key, value in payload.items():
      if key in updatable and value is not None:
        defaults[key] = value

    return defaults


class RefreshView(APIView):
  authentication_classes = []
  permission_classes = [AllowAny]

  def post(self, request: Request) -> Response:
    cookie_name: str = settings.SIMPLE_JWT['REFRESH_COOKIE']
    raw_refresh: str | None = request.COOKIES.get(cookie_name)

    try:
      payload = decode_refresh_payload(raw_refresh)
      jti = payload['jti']
      ensure_refresh_allowed(jti, token_str=raw_refresh)

      user_id = payload['user_id']
      user = User.objects.get(pk=user_id)
    except (TokenError, KeyError, User.DoesNotExist):
      raise InvalidRefreshTokenError()

    response: Response = create_response_with_tokens(request, user, status.HTTP_200_OK)
    return response


class LogoutView(APIView):
  permission_classes = [AllowAny]

  def post(self, request: Request) -> Response:
    reset_token_from_request(request)
    response: Response = Response(status=status.HTTP_200_OK)
    delete_refresh_from_cookie(response)
    return response


class PasswordResetView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'reset_password'

  def post(self, request: Request) -> Response:
    serializer = PasswordResetSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user: User | None = serializer.validated_data['user']

    if user:
      reset_link = generate_reset_link(user)
      send_password_reset_email.delay(user.email, reset_link)

    return Response(status=status.HTTP_202_ACCEPTED)


class PasswordResetConfirmView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'password_reset_confirm'

  def post(self, request: Request) -> Response:
    with transaction.atomic():
      serializer = PasswordResetConfirmSerializer(data=request.data)
      serializer.is_valid(raise_exception=True)
      user: User = serializer.save()

      blacklist_all_refresh_tokens_for_user(user)

    response: Response = create_response_with_tokens(request, user, status.HTTP_200_OK)
    return response


class ValidatePasswordResetTokenView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'validate_reset_token'

  def post(self, request: Request) -> Response:
    with transaction.atomic():
      serializer = ValidatePasswordResetTokenSerializer(data=request.data)
      serializer.is_valid(raise_exception=True)

    return Response(status=status.HTTP_200_OK)


class UpdateUsernameView(APIView):
  throttle_scope = 'update_username'

  def post(self, request: Request) -> Response:
    serializer = UpdateUsernameSerializer(
      data=request.data,
      context={'user': request.user}
    )
    serializer.is_valid(raise_exception=True)
    user: User = serializer.save()

    response: Response = create_response_only_user(user, status.HTTP_200_OK)
    return response
