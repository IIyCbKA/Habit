import secrets
import requests

from django.conf import settings
from django.core.cache import cache
from django.utils.http import urlencode
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_502_BAD_GATEWAY
from rest_framework.views import APIView

class GithubOAuthStartView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'oauth_start'

  def get(self, request: Request, provider: str = None) -> Response:
    if provider != 'github':
      return Response(status=status.HTTP_400_BAD_REQUEST)

    if not settings.OAUTH_CLIENTS['github']['client_id']:
      return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    state = secrets.token_urlsafe(32)
    cache.set(f'oauth:gh:state:{state}', True, 600)

    params = {
      'client_id': settings.OAUTH_CLIENTS['github']['client_id'],
      'redirect_uri': request.build_absolute_uri('/auth/oauth/github/callback/'),
      'state': state,
      'scope': settings.OAUTH_CLIENTS['github']['scope'],
    }

    url = f'{settings.OAUTH_CLIENTS['github']['authorize_url']}?{urlencode(params)}'

    return Response(status=status.HTTP_302_FOUND, headers={'Location': url})


class GithubOAuthCallbackView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'oauth_callback'

  def get(self, request: Request, provider: str = None) -> Response:
    if provider != 'github':
      return Response(status=status.HTTP_400_BAD_REQUEST)

    code = request.query_params.get('code')
    state = request.query_params.get('state')

    if not code or not state:
      return Response(status=status.HTTP_400_BAD_REQUEST)

    if not cache.get(f'oauth:gh:state:{state}'):
      return Response(status=status.HTTP_400_BAD_REQUEST)

    cache.delete(f'oauth:gh:state:{state}')

    token_headers = {
      'Accept': 'application/json',
    }

    token_payload = {
      'client_id': settings.OAUTH_CLIENTS['github']['client_id'],
      'client_secret': settings.OAUTH_CLIENTS['github']['client_secret'],
      'code': code,
      'redirect_uri': request.build_absolute_uri('/auth/oauth/github/callback/'),
      'state': state,
    }

    try:
      t = requests.post(
        settings.OAUTH_CLIENTS['github']['access_token_url'],
        data=token_payload,
        headers=token_headers,
        timeout=10
      )
    except requests.exceptions.RequestException as e:
      return Response(status=status.HTTP_502_BAD_GATEWAY)

    if t.status_code != status.HTTP_200_OK:
      return Response(status=HTTP_502_BAD_GATEWAY)

    token_json = t.json()
    access_token = token_json.get('access_token')
    token_type = token_json.get('token_type')

    if not access_token:
      return Response(status=status.HTTP_502_BAD_GATEWAY)

    api_headers = {
      'Authorization': f'Bearer {access_token}',
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }
    try:
      me_resp = requests.get(
        f'{settings.OAUTH_CLIENTS['github']['api_base_url']}/user',
        headers=api_headers,
        timeout=10
      )
    except requests.RequestException as e:
      return Response(status=HTTP_502_BAD_GATEWAY)

    if me_resp.status_code != status.HTTP_200_OK:
      return Response(status=HTTP_502_BAD_GATEWAY)

    me_json = me_resp.json()

    emails_json = None
    try:
      emails_resp = requests.get(
        f'{settings.OAUTH_CLIENTS['github']['api_base_url']}/user/emails',
        headers=api_headers,
        timeout=10
      )
      if emails_resp.status_code == status.HTTP_200_OK:
        emails_json = emails_resp.json()
    except requests.RequestException:
      pass

    return Response({
      'provider': 'github',
      'token_info': {'token_type': token_type, 'masked': f'***{access_token[-6:]}'},
      'user': me_json,
      'emails': emails_json,
    }, status=status.HTTP_200_OK)
