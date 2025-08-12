from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.token_blacklist.models import (
  OutstandingToken,
  BlacklistedToken
)

from rest_framework_simplejwt.tokens import (
  RefreshToken,
  AccessToken,
  TokenError
)

from typing import Optional

from .serializers import UserSerializer

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
    ot = OutstandingToken.objects.filter(jti=jti).first()
    if ot:
      BlacklistedToken.objects.get_or_create(token=ot)
  except TokenError:
    return


def blacklist_all_refresh_tokens_for_user(user: User) -> None:
  outstanding_tokens = OutstandingToken.objects.filter(user=user)
  for ot in outstanding_tokens:
    BlacklistedToken.objects.get_or_create(token=ot)


def create_response_with_tokens(request: Request, user: User, http_status: int) -> Response:
  refresh, access = get_tokens_for_user(user)

  response: Response = Response(
    data={
      'access_token': str(access),
      'user': UserSerializer(user).data,
    },
    status=http_status
  )

  set_refresh_to_cookie(response, refresh)
  reset_token_from_request(request)

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


def generate_reset_link(user: User) -> str:
  uid = urlsafe_base64_encode(force_bytes(user.pk))
  token = default_token_generator.make_token(user)
  reset_link = f'{settings.CLIENT_ENDPOINTS['PASSWORD_RESET']}?uid={uid}&token={token}'

  return reset_link
