import requests

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_502_BAD_GATEWAY
from rest_framework.views import APIView

from .oauth_helpers import (
  get_authorize_url_with_params,
  pop_state_data,
  validate_redirect_uri, get_payload_for_callback, get_headers_for_callback
)

from .providers import PROVIDER_HANDLERS


class OAuthStartView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'oauth_start'

  def get(self, request: Request, provider: str = None) -> Response:
    if not provider or provider not in settings.OAUTH_CLIENTS:
      return Response(status=status.HTTP_400_BAD_REQUEST)

    provider_cfg = settings.OAUTH_CLIENTS.get(provider)
    if not provider_cfg or not provider_cfg.get('client_id'):
      return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    authorize_url = get_authorize_url_with_params(provider, request)
    return Response(
      status=status.HTTP_302_FOUND,
      headers={'Location': authorize_url}
    )


class OAuthCallbackView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'oauth_callback'

  def get(self, request: Request, provider: str = None) -> Response:
    if not provider or provider not in settings.OAUTH_CLIENTS:
      return Response(status=status.HTTP_400_BAD_REQUEST)

    cfg = settings.OAUTH_CLIENTS[provider]

    code = request.query_params.get('code')
    state = request.query_params.get('state')

    if not code or not state:
      return Response(status=status.HTTP_400_BAD_REQUEST)

    state_data = pop_state_data(provider, state)
    if not state_data:
      return Response(status=status.HTTP_400_BAD_REQUEST)

    if not validate_redirect_uri(provider, request, state_data):
      return Response(status=status.HTTP_400_BAD_REQUEST)

    token_headers = get_headers_for_callback()
    token_payload = get_payload_for_callback(code, request, provider, state)

    try:
      token = requests.post(
        cfg['access_token_url'],
        data=token_payload,
        headers=token_headers,
        timeout=10
      )
    except requests.exceptions.RequestException as e:
      return Response(status=status.HTTP_502_BAD_GATEWAY)

    if token.status_code != status.HTTP_200_OK:
      return Response(status=HTTP_502_BAD_GATEWAY)

    token_json = token.json()
    access_token = token_json.get('access_token')

    if not access_token:
      return Response(status=status.HTTP_502_BAD_GATEWAY)

    handler = PROVIDER_HANDLERS.get(provider)
    if not handler:
      return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    try:
      result = handler(cfg, access_token, token_json)
    except requests.RequestException as e:
      return Response(status=status.HTTP_502_BAD_GATEWAY)
    except Exception:
      return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(result, status=status.HTTP_200_OK)