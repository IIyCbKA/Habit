from django.conf import settings
from django.db import transaction, IntegrityError
from django.contrib.auth import get_user_model

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

from .serializers import (
  UserSerializer,
  LoginSerializer,
  EmailVerificationSerializer,
  PasswordResetSerializer,
  PasswordResetConfirmSerializer,
  ValidatePasswordResetTokenSerializer,
)

from rest_framework.permissions import AllowAny

from typing import Optional

from .constants import *
from .models import EmailVerificationCode
from .tasks import send_verification_email, send_password_reset_email
from .views_helpers import (
  blacklist_all_refresh_tokens_for_user,
  create_response_with_tokens,
  reset_token_from_request,
  delete_refresh_from_cookie,
  generate_reset_link
)

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
      return Response(
        {'detail': EMAIL_ALREADY_VERIFIED_ERROR},
        status=status.HTTP_400_BAD_REQUEST
      )

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
      with transaction.atomic():
        verification, _ = EmailVerificationCode.objects.get_or_create(user=user)
        raw_code = verification.regenerate_code()
        send_verification_email.delay_on_commit(user.email, raw_code)

    response: Response = create_response_with_tokens(request, user, status.HTTP_200_OK)
    return response


class RefreshView(APIView):
  authentication_classes = []
  permission_classes = [AllowAny]

  def post(self, request: Request) -> Response:
    cookie_name: str = settings.SIMPLE_JWT['REFRESH_COOKIE']
    raw_refresh: Optional[str] = request.COOKIES.get(cookie_name)

    if raw_refresh is None:
      return Response({'detail': REFRESH_NOT_PROVIDED_ERROR}, status=status.HTTP_401_UNAUTHORIZED)

    try:
      old_refresh: RefreshToken = RefreshToken(raw_refresh)
    except TokenError:
      return Response({'detail': INVALID_REFRESH_ERROR}, status=status.HTTP_401_UNAUTHORIZED)

    try:
      jti = old_refresh['jti']
    except KeyError:
      return Response({'detail': INVALID_REFRESH_ERROR}, status=status.HTTP_401_UNAUTHORIZED)

    if BlacklistedToken.objects.filter(token__jti=jti).exists():
      return Response({'detail': INVALID_REFRESH_ERROR}, status=status.HTTP_401_UNAUTHORIZED)

    try:
      user_id: int = old_refresh.payload.get('user_id')
      user: User = User.objects.get(pk=user_id)
    except (KeyError, User.DoesNotExist):
      return Response({'detail': INVALID_CREDENTIALS_ERROR}, status=status.HTTP_401_UNAUTHORIZED)

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
    serializer = ValidatePasswordResetTokenSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    return Response(status=status.HTTP_200_OK)