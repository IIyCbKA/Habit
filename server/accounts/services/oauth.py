import base64
import hashlib

from django.conf import settings
from django.core.cache import cache
from django.db import transaction, IntegrityError
from django.contrib.auth import get_user_model
from django.utils.http import urlencode

from rest_framework import status
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request

from .auth import create_response_with_tokens
from .providers import PROVIDER_HANDLERS
from accounts.models import Provider, SocialAccount
from accounts.types import OAuthCallbackContext
from accounts.exceptions import (
  OAuthStateError,
  OAuthRedirectMismatch,
  OAuthTokenExchangeError,
  OAuthProviderError,
  OAuthConflictError,
)

from typing import Optional
import requests
import secrets
import time
import uuid

User = get_user_model()

def _get_oauth_cache_key(provider: str, state: str) -> str:
  return f'oauth:{provider}:state:{state}'


def _get_oauth_callback_redirect_uri(provider: str, request: Request) -> str:
  return request.build_absolute_uri(f'/auth/oauth/{provider}/callback/')


def _generate_code_verifier() -> str:
  return secrets.token_urlsafe(64)[:128]


def _code_challenge_s256(verifier: str) -> str:
  digest = hashlib.sha256(verifier.encode('ascii')).digest()
  return base64.urlsafe_b64encode(digest).rstrip(b'=').decode('ascii')


def _set_oauth_state(provider: str, request: Request) -> str:
  state = secrets.token_urlsafe(64)
  code_verifier = _generate_code_verifier()
  payload = {
    'created': int(time.time()),
    'redirect_uri': _get_oauth_callback_redirect_uri(provider, request),
    'flow': request.query_params.get('flow', 'login'),
    'next': request.query_params.get('next'),
    'pkce_verifier': code_verifier,
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
  state_data = cache.get(_get_oauth_cache_key(provider, state)) or {}
  verifier = state_data['pkce_verifier']
  challenge = _code_challenge_s256(verifier)

  params = {
    'client_id': settings.OAUTH_CLIENTS[provider]['client_id'],
    'redirect_uri': _get_oauth_callback_redirect_uri(provider, request),
    'state': state,
    'scope': settings.OAUTH_CLIENTS[provider]['scope'],
    'code_challenge': challenge,
    'code_challenge_method': 'S256',
  }

  if provider == Provider.X.value:
    params['response_type'] = 'code'

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


def build_token_request_payload(ctx: OAuthCallbackContext) -> dict:
  base = {
    'code': ctx.code,
    'redirect_uri': ctx.redirect_uri,
    'code_verifier': ctx.code_verifier,
  }

  if ctx.provider == Provider.X.value:
    base['grant_type'] = 'authorization_code'
  else:
    base['client_id'] = settings.OAUTH_CLIENTS[ctx.provider]['client_id']
    base['client_secret'] = settings.OAUTH_CLIENTS[ctx.provider]['client_secret']

  return base


def token_request_headers(provider: str) -> dict:
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
  }

  if provider == Provider.X.value:
    cid = settings.OAUTH_CLIENTS[provider]['client_id']
    csec = settings.OAUTH_CLIENTS[provider]['client_secret']
    basic = base64.b64encode(f'{cid}:{csec}'.encode('ascii')).decode('ascii')
    headers['Authorization'] = f'Basic {basic}'

  return headers


def parse_callback_context(request: Request, provider: str) -> OAuthCallbackContext:
  code = request.query_params.get('code')
  state = request.query_params.get('state')
  if not code or not state:
    raise OAuthStateError('Missing code or state')

  state_data = pop_oauth_state_data(provider, state)
  if not state_data:
    raise OAuthStateError('OAuth state not found or expired')

  validate_callback_redirect_uri(provider, request, state_data)

  verifier = state_data.get('pkce_verifier')
  if not verifier:
    raise OAuthStateError('PKCE verifier missing from state')

  return OAuthCallbackContext(
    provider=provider,
    code=code,
    state=state,
    flow=state_data.get('flow', 'login'),
    next_url=state_data.get('next'),
    redirect_uri=_get_oauth_callback_redirect_uri(provider, request),
    code_verifier=verifier,
  )


def exchange_code_for_token(ctx: OAuthCallbackContext) -> dict:
  try:
    response = requests.post(
      settings.OAUTH_CLIENTS[ctx.provider]['access_token_url'],
      data=build_token_request_payload(ctx),
      headers=token_request_headers(ctx.provider),
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