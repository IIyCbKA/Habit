from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import (
  RefreshToken,
  AccessToken,
  TokenError
)

from .serializers import UserSerializer, LoginSerializer, \
  EmailVerificationSerializer
from rest_framework.permissions import AllowAny

from .tasks import blacklistRefreshJTI, send_verification_email
from .constants import *
from typing import Optional

User = get_user_model()

def get_tokens_for_user(user: User) -> tuple[Optional[RefreshToken], AccessToken]:
  if not user.is_email_verified:
    refresh: None = None
    access: AccessToken = AccessToken.for_user(user)
  else:
    refresh: RefreshToken = RefreshToken.for_user(user)
    access: AccessToken = refresh.access_token

  return refresh, access


def reset_token_from_request(request: Request) -> None:
  cookie_name: str = settings.SIMPLE_JWT['REFRESH_COOKIE']
  raw_refresh: Optional[str] = request.COOKIES.get(cookie_name)

  if not raw_refresh:
    return

  try:
    refresh: RefreshToken = RefreshToken(raw_refresh)
    jti: str = refresh['jti']
    blacklistRefreshJTI.apply_async(args=(jti,), countdown=30)
  except TokenError:
    return


def create_response_with_tokens(request: Request, user: User, http_status: int) -> Response:
  reset_token_from_request(request)

  refresh, access = get_tokens_for_user(user)

  response: Response = Response(
    data={
      'access_token': str(access),
      'user': UserSerializer(user).data,
    },
    status=http_status
  )

  set_refresh_to_cookie(response, refresh)

  return response


def delete_refresh_from_cookie(response: Response) -> None:
  response.delete_cookie(
    key=settings.SIMPLE_JWT['REFRESH_COOKIE'],
    samesite=settings.SIMPLE_JWT['REFRESH_COOKIE_SAMESITE'],
  )


def set_refresh_to_cookie(response: Response, refresh: Optional[RefreshToken]) -> None:
  if refresh is None:
    return

  response.set_cookie(
    key=settings.SIMPLE_JWT['REFRESH_COOKIE'],
    value=str(refresh),
    max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
    httponly=settings.SIMPLE_JWT['REFRESH_COOKIE_HTTP_ONLY'],
    secure=settings.SIMPLE_JWT['REFRESH_COOKIE_SECURE'],
    samesite=settings.SIMPLE_JWT['REFRESH_COOKIE_SAMESITE'],
  )


class PendingRegisterView(generics.CreateAPIView):
  permission_classes = [AllowAny]
  serializer_class = UserSerializer
  throttle_scope = 'register'

  def create(self, request: Request, *args, **kwargs) -> Response:
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user: User = serializer.save()

    response: Response = create_response_with_tokens(request, user, status.HTTP_201_CREATED)
    return response


class EmailConfirmView(APIView):
  throttle_scope = 'email_confirm'

  def post(self, request: Request) -> Response:
    user: User = request.user
    data = request.data.copy()
    data['email'] = user.email

    serializer = EmailVerificationSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    response: Response = create_response_with_tokens(request, user, status.HTTP_200_OK)
    return response


class ResendCodeView(APIView):
  throttle_scope = 'resend_code'

  def post(self, request: Request) -> Response:
    user: User = request.user

    raw_code = user.regenerate_secret_code()
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
      raw_code = user.regenerate_secret_code()
      send_verification_email.delay(user.email, raw_code)

    response: Response = create_response_with_tokens(request, user, status.HTTP_200_OK)

    return response


class RefreshView(APIView):
  authentication_classes = []
  permission_classes = [AllowAny]

  def post(self, request: Request) -> Response:
    cookie_name: str = settings.SIMPLE_JWT['REFRESH_COOKIE']
    raw_refresh: Optional[str] = request.COOKIES.get(cookie_name)

    if raw_refresh is None:
      return Response(
        {'detail': REFRESH_NOT_PROVIDED_ERROR},
        status=status.HTTP_401_UNAUTHORIZED
      )

    try:
      old_refresh: RefreshToken = RefreshToken(raw_refresh)
    except TokenError:
      return Response(
        {'detail': INVALID_REFRESH_ERROR},
        status=status.HTTP_401_UNAUTHORIZED
      )

    try:
      user_id: int = old_refresh.payload.get('user_id')
      user: User = User.objects.get(pk=user_id)
    except (KeyError, User.DoesNotExist):
      return Response(
        {'detail': USER_NOT_FOUND_ERROR},
        status=status.HTTP_401_UNAUTHORIZED
      )

    response: Response = create_response_with_tokens(request, user, status.HTTP_200_OK)
    return response


class LogoutView(APIView):
  permission_classes = [AllowAny]

  def post(self, request: Request) -> Response:
    reset_token_from_request(request)

    response: Response = Response(status=status.HTTP_200_OK)
    delete_refresh_from_cookie(response)

    return response
