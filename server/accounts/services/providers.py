from django.conf import settings

from accounts.models import Provider

import requests

def _get_base_api_url(provider_key: str) -> str:
  return settings.OAUTH_CLIENTS[provider_key]['api_base_url'].rstrip('/')

# -----------------------
#          GitHub
# -----------------------
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


def _normalize_github_profile(user_json: dict) -> dict:
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

  profile = _normalize_github_profile(user_json)

  return {
    'provider': Provider.GITHUB.value,
    'profile': profile,
    'raw_user': user_json,
    'raw_token': raw_token_response,
  }

# -----------------------
#            X
# -----------------------
def _x_api_headers(access_token: str) -> dict:
  return {
    'Authorization': f'Bearer {access_token}',
    'Accept': 'application/json',
    'User-Agent': 'MyApp/1.0',
  }


def _fetch_x_user(access_token: str, timeout: int = 10) -> dict:
  base = _get_base_api_url(Provider.X.value)
  url = f'{base}/users/me?user.fields=id,name,username'
  response = requests.get(url, headers=_x_api_headers(access_token), timeout=timeout)
  response.raise_for_status()
  return response.json()


def _normalize_x_profile(user_json: dict) -> dict:
  data = user_json.get('data') or {}
  uid = data.get('id')
  name = data.get('name')
  preferred_username = data.get('username')

  return {
    'id': str(uid) if uid is not None else None,
    'name': name,
    'preferred_username': preferred_username,
  }


def fetch_profile_x(access_token: str, raw_token_response: dict) -> dict:
  try:
    user_json = _fetch_x_user(access_token)
  except requests.HTTPError:
    raise

  profile = _normalize_x_profile(user_json)

  return {
    'provider': Provider.X.value,
    'profile': profile,
    'raw_user': user_json,
    'raw_token': raw_token_response,
  }

# -----------------------
#          Google
# -----------------------
def _google_api_headers(access_token: str) -> dict:
  return {
    'Authorization': f'Bearer {access_token}',
    'Accept': 'application/json',
  }


def _fetch_google_user(access_token: str, timeout: int = 10) -> dict:
  base = _get_base_api_url(Provider.GOOGLE.value)
  url = f'{base}/v1/userinfo'
  response = requests.get(url, headers=_google_api_headers(access_token), timeout=timeout)
  response.raise_for_status()
  return response.json()


def _normalize_google_profile(user_json: dict) -> dict:
  uid = user_json.get('sub')
  name = user_json.get('name') or user_json.get('email')
  preferred_username = user_json.get('email')

  return {
    'id': str(uid) if uid is not None else None,
    'name': name,
    'preferred_username': preferred_username,
  }


def fetch_profile_google(access_token: str, raw_token_response: dict) -> dict:
  try:
    user_json = _fetch_google_user(access_token)
  except requests.HTTPError:
    raise

  profile = _normalize_google_profile(user_json)

  return {
    'provider': Provider.GOOGLE.value,
    'profile': profile,
    'raw_user': user_json,
    'raw_token': raw_token_response,
  }

# -----------------------
#          Yandex
# -----------------------
def _yandex_api_headers(access_token: str) -> dict:
  return {
    'Authorization': f'OAuth {access_token}',
    'Accept': 'application/json',
  }


def _fetch_yandex_user(access_token: str, timeout: int = 10) -> dict:
  base = _get_base_api_url(Provider.YANDEX.value)
  url = f'{base}/info?format=json'
  resp = requests.get(url, headers=_yandex_api_headers(access_token), timeout=timeout)
  resp.raise_for_status()
  return resp.json()


def _normalize_yandex_profile(user_json: dict) -> dict:
  uid = user_json.get('id') or user_json.get('uid')
  name = user_json.get('real_name') or user_json.get('display_name') or user_json.get('login')
  preferred_username = user_json.get('login') or user_json.get('email')

  return {
    'id': str(uid) if uid is not None else None,
    'name': name,
    'preferred_username': preferred_username,
  }


def fetch_profile_yandex(access_token: str, raw_token_response: dict) -> dict:
  try:
    user_json = _fetch_yandex_user(access_token)
  except requests.HTTPError:
    raise

  profile = _normalize_yandex_profile(user_json)

  return {
    'provider': Provider.YANDEX.value,
    'profile': profile,
    'raw_user': user_json,
    'raw_token': raw_token_response,
  }


PROVIDER_HANDLERS = {
  Provider.GITHUB.value: fetch_profile_github,
  Provider.X.value: fetch_profile_x,
  Provider.GOOGLE.value: fetch_profile_google,
  Provider.YANDEX.value: fetch_profile_yandex,
}
