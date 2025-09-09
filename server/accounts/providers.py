from rest_framework import status
from typing import Optional
import requests

from .models import Provider


def _github_api_headers(access_token: str) -> dict:
  return {
    'Authorization': f'Bearer {access_token}',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }


def _fetch_github_user(cfg: dict, access_token: str, timeout: int = 10) -> dict:
  base = cfg.get('api_base_url', 'https://api.github.com').rstrip('/')
  url = f'{base}/user'
  resp = requests.get(url, headers=_github_api_headers(access_token), timeout=timeout)
  resp.raise_for_status()
  return resp.json()


def _fetch_github_emails(cfg: dict, access_token: str, timeout: int = 10) -> Optional[list]:
  base = cfg.get('api_base_url', 'https://api.github.com').rstrip('/')
  url = f'{base}/user/emails'
  resp = requests.get(url, headers=_github_api_headers(access_token), timeout=timeout)
  if resp.status_code == status.HTTP_200_OK:
    return resp.json()
  return None


def normalize_github_profile(user_json: dict, emails_json: Optional[list]) -> dict:
  uid = user_json.get('id')
  primary_email = None
  email_verified = None
  if emails_json:
    primary = next((e for e in emails_json if e.get('primary')), None)
    if primary:
      primary_email = primary.get('email')
      email_verified = bool(primary.get('verified'))

  if not primary_email:
    primary_email = user_json.get('email')

  name = user_json.get('name') or user_json.get('login')
  preferred_username = user_json.get('login')

  return {
    'id': str(uid) if uid is not None else None,
    'email': primary_email,
    'email_verified': email_verified,
    'name': name,
    'preferred_username': preferred_username,
  }


def fetch_profile_github(cfg: dict, access_token: str, raw_token_response: dict) -> dict:
  try:
    user_json = _fetch_github_user(cfg, access_token)
  except requests.HTTPError as exc:
    raise

  try:
    emails_json = _fetch_github_emails(cfg, access_token)
  except Exception:
    emails_json = None

  profile = normalize_github_profile(user_json, emails_json)

  return {
    'provider': Provider.GITHUB.value,
    'profile': profile,
    'emails': emails_json,
    'raw_user': user_json,
    'raw_token': raw_token_response,
  }


PROVIDER_HANDLERS = {
  Provider.GITHUB.value: fetch_profile_github,
}
