from django.conf import settings
from django.core.cache import cache
from django.db import transaction, IntegrityError
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlencode

from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.token_blacklist.models import (
  OutstandingToken,
  BlacklistedToken
)

from rest_framework_simplejwt.tokens import (
  UntypedToken,
  RefreshToken,
  AccessToken,
  TokenError
)

from typing import Optional

from .models import SocialAccount
from .serializers import UserSerializer
from .token_grace import put_in_grace, in_grace

import secrets
import time

User = get_user_model()

def decode_refresh_payload(raw_refresh: str) -> dict:
  if not raw_refresh:
    raise TokenError

  try:
    payload = UntypedToken(raw_refresh).payload
  except Exception as e:
    raise TokenError from e

  if payload.get('token_type') != 'refresh':
    raise TokenError

  return payload


def ensure_refresh_allowed(jti: str, token_str: str) -> None:
  is_blacklisted = BlacklistedToken.objects.filter(token__jti=jti).exists()
  if is_blacklisted and not in_grace(jti, token_str):
    raise TokenError


def get_tokens_for_user(
  user: User,
  is_oauth: bool = False
) -> tuple[Optional[RefreshToken], AccessToken]:
  if not user.is_email_verified and not is_oauth:
    refresh: Optional[RefreshToken] = None
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
      put_in_grace(jti, raw_refresh)
      BlacklistedToken.objects.get_or_create(token=ot)
  except TokenError:
    return


def blacklist_all_refresh_tokens_for_user(user: User) -> None:
  outstanding_tokens = OutstandingToken.objects.filter(user=user)
  for ot in outstanding_tokens:
    BlacklistedToken.objects.get_or_create(token=ot)


def create_response_with_tokens(
  request: Request,
  user: User,
  http_status: int,
  is_oauth: bool = False,
) -> Response:
  refresh, access = get_tokens_for_user(user, is_oauth)

  response: Response = Response(
    data={
      'access_token': str(access),
      'user': UserSerializer(user).data,
      'is_authenticated': bool(refresh),
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
  reset_link = f'{settings.CLIENT_ENDPOINTS["PASSWORD_RESET"]}?uid={uid}&token={token}'

  return reset_link


def _get_oauth_provider_key(provider: str, state: str) -> str:
  return f'oauth:{provider}:state:{state}'


def _get_oauth_callback_redirect_uri(provider: str, request: Request) -> str:
  return request.build_absolute_uri(f'/auth/oauth/{provider}/callback/')


def _set_oauth_state(provider: str, request: Request) -> str:
  state = secrets.token_urlsafe(64)
  payload = {
    'created': int(time.time()),
    'redirect_uri': _get_oauth_callback_redirect_uri(provider, request),
    'flow': request.query_params.get('flow', 'login'),
    'next': request.query_params.get('next'),
  }

  key = _get_oauth_provider_key(provider, state)
  cache.set(key, payload, settings.TIMEOUTS['OAUTH_STATE'])

  return state


def pop_oauth_state_data(provider: str, state: str) -> dict:
  key = _get_oauth_provider_key(provider, state)
  data = cache.get(key)
  if data is not None:
    cache.delete(key)

  return data


def get_authorize_url_with_params(provider: str, request: Request) -> str:
  state: str = _set_oauth_state(provider, request)

  params = {
    'client_id': settings.OAUTH_CLIENTS[provider]['client_id'],
    'redirect_uri': _get_oauth_callback_redirect_uri(provider, request),
    'state': state,
    'scope': settings.OAUTH_CLIENTS[provider]['scope'],
  }

  url = f'{settings.OAUTH_CLIENTS[provider]['authorize_url']}?{urlencode(params)}'

  return url


def validate_redirect_uri(
  provider: str,
  request: Request,
  state_data: dict
) -> bool:
  expected_redirect = state_data.get('redirect_uri')
  actual_redirect = _get_oauth_callback_redirect_uri(provider, request)

  return expected_redirect == actual_redirect


def get_payload_for_callback(
  code: str,
  request: Request,
  provider: str,
  state: str,
) -> dict:
  return {
    'client_id': settings.OAUTH_CLIENTS[provider]['client_id'],
    'client_secret': settings.OAUTH_CLIENTS[provider]['client_secret'],
    'code': code,
    'redirect_uri': _get_oauth_callback_redirect_uri(provider, request),
    'state': state,
  }


def get_headers_for_callback() -> dict:
  return {
    'Accept': 'application/json',
  }


def _rand_username(prefix: str = settings.DEFAULT_USERNAME_BASE) -> str:
  return f'{prefix}_{secrets.token_hex(6)}'


def _create_user_minimal() -> User:
  for _ in range(10):
    try:
      with transaction.atomic():
        user = User(username=_rand_username())
        user.set_unusable_password()
        user.save()
        return user
    except IntegrityError:
      continue

  raise IntegrityError


def complete_oauth(
  request: Request,
  provider: str,
  provider_payload: dict,
  flow: str,
  next_url: Optional[str] = None,
) -> Response:
  profile = provider_payload.get('profile') or {}
  provider_uid = profile.get('id')
  if not provider_uid:
    return Response(status=status.HTTP_502_BAD_GATEWAY)

  provider_uid = str(provider_uid)

  social_account = SocialAccount.objects.filter(
    provider=provider, provider_user_id=provider_uid
  ).select_related('user').first()

  if social_account:
    response = create_response_with_tokens(request, social_account.user, status.HTTP_200_OK, is_oauth=True)
    if next_url:
      response.status_code = status.HTTP_303_SEE_OTHER
      response['Location'] = next_url
      response.data = None
    return response

  if flow == 'link':
    user = getattr(request, 'user', None)
    if not user or not user.is_authenticated:
      return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
      with transaction.atomic():
        SocialAccount.objects.create(
          provider=provider, provider_user_id=provider_uid, user=user
        )
    except IntegrityError:
      pass

    if next_url:
      return Response(status=status.HTTP_303_SEE_OTHER, headers={'Location': next_url})
    return Response(status=status.HTTP_204_NO_CONTENT)

  user: User = _create_user_minimal()

  final_user: User
  try:
    with transaction.atomic():
      SocialAccount.objects.create(
        provider=provider, provider_user_id=provider_uid, user=user
      )

    final_user = user
  except IntegrityError:
    social_account = SocialAccount.objects.filter(
      provider=provider, provider_user_id=provider_uid
    ).select_related('user').first()
    if social_account:
      final_user = social_account.user
    else:
      with transaction.atomic():
        SocialAccount.objects.create(
          provider=provider, provider_user_id=provider_uid, user=user
        )
      final_user = user

  response = create_response_with_tokens(request, final_user, status.HTTP_200_OK, is_oauth=True)
  if next_url:
    response.status_code = status.HTTP_303_SEE_OTHER
    response['Location'] = next_url
    response.data = None

  return response