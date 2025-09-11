from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_502_BAD_GATEWAY
from rest_framework.views import APIView

from .views_helpers import (
  get_authorize_url_with_params,
  pop_oauth_state_data,
  validate_redirect_uri,
  get_payload_for_callback,
  get_headers_for_callback,
  complete_oauth,
)

from .providers import PROVIDER_HANDLERS
import requests


class OAuthStartView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'oauth_start'

  def get(self, request: Request, provider: str = None) -> Response:
    if not provider or provider not in settings.OAUTH_CLIENTS:
      return Response(status=status.HTTP_400_BAD_REQUEST)

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

    code = request.query_params.get('code')
    state = request.query_params.get('state')

    if not code or not state:
      return Response(status=status.HTTP_400_BAD_REQUEST)

    state_data = pop_oauth_state_data(provider, state)
    if not state_data:
      return Response(status=status.HTTP_400_BAD_REQUEST)

    if not validate_redirect_uri(provider, request, state_data):
      return Response(status=status.HTTP_400_BAD_REQUEST)

    flow = state_data.get('flow', 'login')
    raw_next = state_data.get('next')
    next_url = raw_next if raw_next else settings.CLIENT_BASE_URL
    token_headers = get_headers_for_callback()
    token_payload = get_payload_for_callback(code, request, provider, state)

    try:
      token = requests.post(
        settings.OAUTH_CLIENTS[provider]['access_token_url'],
        data=token_payload,
        headers=token_headers,
        timeout=10
      )
    except requests.exceptions.RequestException:
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
      provider_payload = handler(access_token, token_json)
    except requests.RequestException:
      return Response(status=status.HTTP_502_BAD_GATEWAY)
    except Exception:
      return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return complete_oauth(request, provider, provider_payload, flow, next_url)
