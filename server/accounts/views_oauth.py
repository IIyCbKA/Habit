from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .views_helpers import (
  build_authorization_url,
  ensure_valid_provider,
  parse_callback_context,
  exchange_code_for_token,
  fetch_provider_payload,
  finalize_oauth_flow,
)

class OAuthStartView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'oauth_start'

  def get(self, request: Request, provider: str = None) -> Response:
    ensure_valid_provider(provider)

    authorize_url = build_authorization_url(provider, request)
    return Response(status=status.HTTP_302_FOUND, headers={'Location': authorize_url})


class OAuthCallbackView(APIView):
  permission_classes = [AllowAny]
  throttle_scope = 'oauth_callback'

  def get(self, request: Request, provider: str = None) -> Response:
    ensure_valid_provider(provider)

    ctx = parse_callback_context(request, provider)
    token_json = exchange_code_for_token(ctx)
    provider_payload = fetch_provider_payload(ctx.provider, token_json)
    return finalize_oauth_flow(request, ctx, provider_payload)
