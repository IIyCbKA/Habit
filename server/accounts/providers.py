from django.conf import settings

from .models import Provider

import requests

def _get_base_api_url(provider: Provider) -> str:
  return settings.OAUTH_CLIENTS[provider]['api_base_url'].rstrip('/')


def _github_api_headers(access_token: str) -> dict:
  return {
    'Authorization': f'Bearer {access_token}',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }


def _fetch_github_user(access_token: str, timeout: int = 10) -> dict:
  base = _get_base_api_url(Provider.GITHUB.value)
  url = f'{base}/user'
  response = requests.get(url, headers=_github_api_headers(access_token), timeout=timeout)
  response.raise_for_status()
  return response.json()


def normalize_github_profile(user_json: dict) -> dict:
  uid = user_json.get('id')
  name = user_json.get('name') or user_json.get('login')
  preferred_username = user_json.get('login')

  return {
    'id': str(uid) if uid is not None else None,
    'name': name,
    'preferred_username': preferred_username,
  }


def fetch_profile_github(access_token: str, raw_token_response: dict) -> dict:
  try:
    user_json = _fetch_github_user(access_token)
  except requests.HTTPError:
    raise

  profile = normalize_github_profile(user_json)

  return {
    'provider': Provider.GITHUB.value,
    'profile': profile,
    'raw_user': user_json,
    'raw_token': raw_token_response,
  }


PROVIDER_HANDLERS = {
  Provider.GITHUB.value: fetch_profile_github,
}
