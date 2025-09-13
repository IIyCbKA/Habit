from django.conf import settings
from django.core.cache import cache
from django.db import transaction, IntegrityError
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlencode

from rest_framework import status
from rest_framework.exceptions import NotAuthenticated
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

from .exceptions import (
  OAuthStateError,
  OAuthRedirectMismatch,
  OAuthTokenExchangeError,
  OAuthProviderError,
  OAuthConflictError,
)
from .models import SocialAccount
from .serializers import UserSerializer
from .providers import PROVIDER_HANDLERS
from .token_grace import put_in_grace, in_grace
from .types import OAuthCallbackContext

import requests
import secrets
import time
import uuid

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


def get_tokens_for_user(user: User) -> tuple[Optional[RefreshToken], AccessToken]:
  if user.email and not user.is_email_verified:
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
) -> Response:
  refresh, access = get_tokens_for_user(user)

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


def _get_oauth_cache_key(provider: str, state: str) -> str:
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

  key = _get_oauth_cache_key(provider, state)
  cache.set(key, payload, settings.TIMEOUTS['OAUTH_STATE'])

  return state


def pop_oauth_state_data(provider: str, state: str) -> dict:
  key = _get_oauth_cache_key(provider, state)
  data = cache.get(key)
  if data is not None:
    cache.delete(key)

  return data


def build_authorization_url(provider: str, request: Request) -> str:
  state: str = _set_oauth_state(provider, request)

  params = {
    'client_id': settings.OAUTH_CLIENTS[provider]['client_id'],
    'redirect_uri': _get_oauth_callback_redirect_uri(provider, request),
    'state': state,
    'scope': settings.OAUTH_CLIENTS[provider]['scope'],
  }

  url = f'{settings.OAUTH_CLIENTS[provider]["authorize_url"]}?{urlencode(params)}'

  return url


def ensure_valid_provider(provider: Optional[str]) -> None:
  if not provider or provider not in settings.OAUTH_CLIENTS:
    raise OAuthStateError('Unknown provider')


def validate_callback_redirect_uri(
  provider: str,
  request: Request,
  state_data: dict
) -> None:
  expected = state_data.get('redirect_uri')
  actual = _get_oauth_callback_redirect_uri(provider, request)
  if not expected or expected != actual:
    raise OAuthRedirectMismatch('URI does not match the request')


def build_token_request_payload(
  code: str,
  provider: str,
  redirect_uri: str,
  state: str,
) -> dict:
  return {
    'client_id': settings.OAUTH_CLIENTS[provider]['client_id'],
    'client_secret': settings.OAUTH_CLIENTS[provider]['client_secret'],
    'code': code,
    'redirect_uri': redirect_uri,
    'state': state,
  }


def token_request_headers() -> dict:
  return { 'Accept': 'application/json' }


def parse_callback_context(request: Request, provider: str) -> OAuthCallbackContext:
  code = request.query_params.get('code')
  state = request.query_params.get('state')
  if not code or not state:
    raise OAuthStateError('Missing code or state')

  state_data = pop_oauth_state_data(provider, state)
  if not state_data:
    raise OAuthStateError('OAuth state not found or expired')

  validate_callback_redirect_uri(provider, request, state_data)

  return OAuthCallbackContext(
    provider=provider,
    code=code,
    state=state,
    flow=state_data.get('flow', 'login'),
    next_url=state_data.get('next'),
    redirect_uri=_get_oauth_callback_redirect_uri(provider, request),
  )


def exchange_code_for_token(ctx: OAuthCallbackContext) -> dict:
  try:
    response = requests.post(
      settings.OAUTH_CLIENTS[ctx.provider]['access_token_url'],
      data=build_token_request_payload(
        code=ctx.code,
        provider=ctx.provider,
        redirect_uri=ctx.redirect_uri,
        state=ctx.state
      ),
      headers=token_request_headers(),
      timeout=10,
    )
  except requests.RequestException:
    raise OAuthTokenExchangeError()

  if response.status_code != status.HTTP_200_OK:
    raise OAuthTokenExchangeError()

  token_json = response.json()
  if not token_json.get('access_token'):
    raise OAuthTokenExchangeError('No access token in response')

  return token_json


def fetch_provider_payload(provider: str, token_json: dict) -> dict:
  access_token = token_json.get('access_token')
  handler = PROVIDER_HANDLERS.get(provider)
  if not handler:
    raise OAuthProviderError('Provider handler not implemented')
  try:
    return handler(access_token, token_json)
  except requests.RequestException:
    raise OAuthProviderError('Provider API call failed')


def find_user_by_social(provider: str, provider_uid: str) -> User | None:
  social_account = (SocialAccount.objects
    .filter(provider=provider, provider_user_id=provider_uid)
    .select_related('user')
    .first()
  )

  return social_account.user if social_account else None


def link_social_to_current_user(current_user: User, provider: str, provider_uid: str) -> None:
  if not current_user or not current_user.is_authenticated:
    raise NotAuthenticated('Authentication required to link social account')

  obj, created = SocialAccount.objects.get_or_create(
    provider=provider,
    provider_user_id=provider_uid,
    defaults={'user': current_user},
  )

  if not created and obj.user_id != current_user.id:
    raise OAuthConflictError()


def _new_random_username(prefix: str = settings.DEFAULT_USERNAME_PREFIX) -> str:
  return f'{prefix}_{uuid.uuid4().hex}'


def _create_user_minimal() -> User:
  user = User(username=_new_random_username())
  user.set_unusable_password()
  user.save()
  return user


def register_user_for_social(provider: str, provider_uid: str) -> User:
  try:
    with transaction.atomic():
      user: User = _create_user_minimal()
      SocialAccount.objects.create(
        provider=provider, provider_user_id=provider_uid, user=user
      )
    return user
  except IntegrityError:
    existing = find_user_by_social(provider, provider_uid)
    if existing:
      return existing
    raise


def issue_login_response(request: Request, user: User, next_url: Optional[str]) -> Response:
  response = create_response_with_tokens(request, user, status.HTTP_200_OK)
  if next_url:
    response.status_code = status.HTTP_303_SEE_OTHER
    response['Location'] = next_url
    response.data = None

  return response


def finalize_oauth_flow(request: Request, ctx: OAuthCallbackContext, provider_payload: dict) -> Response:
  profile = provider_payload.get('profile') or {}
  provider_uid = str(profile.get('id') or '')
  if not provider_uid:
    return Response(status=status.HTTP_502_BAD_GATEWAY)

  existing = find_user_by_social(ctx.provider, provider_uid)
  if existing:
    return issue_login_response(request, existing, ctx.next_url)

  if ctx.flow == 'link':
    link_social_to_current_user(getattr(request, 'user', None), ctx.provider, provider_uid)
    if ctx.next_url:
      return Response(status=status.HTTP_303_SEE_OTHER, headers={'Location': ctx.next_url})
    return Response(status=status.HTTP_204_NO_CONTENT)

  new_user = register_user_for_social(ctx.provider, provider_uid)
  return issue_login_response(request, new_user, ctx.next_url)