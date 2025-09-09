from django.conf import settings
from django.core.cache import cache
from django.utils.http import urlencode
from rest_framework.request import Request

import secrets
import time


def get_key(provider: str, state: str) -> str:
  return f'oauth:{provider}:state:{state}'


def get_redirect_uri(provider: str, request: Request) -> str:
  return request.build_absolute_uri(f'/auth/oauth/{provider}/callback/')


def set_state(provider: str, request: Request) -> str:
  state = secrets.token_urlsafe(64)
  payload = {
    'created': int(time.time()),
    'redirect_uri': get_redirect_uri(provider, request),
  }

  key = get_key(provider, state)
  cache.set(key, payload, settings.TIMEOUTS['OAUTH_STATE'])

  return state


def pop_state_data(provider: str, state: str) -> dict:
  key = get_key(provider, state)
  data = cache.get(key)
  if data is not None:
    cache.delete(key)

  return data


def get_authorize_url_with_params(provider: str, request: Request) -> str:
  state: str = set_state(provider, request)

  params = {
    'client_id': settings.OAUTH_CLIENTS[provider]['client_id'],
    'redirect_uri': get_redirect_uri(provider, request),
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
  actual_redirect = get_redirect_uri(provider, request)

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
    'redirect_uri': get_redirect_uri(provider, request),
    'state': state,
  }


def get_headers_for_callback() -> dict:
  return {
    'Accept': 'application/json',
  }