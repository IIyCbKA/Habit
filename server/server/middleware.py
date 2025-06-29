from django.http import HttpRequest, HttpResponse
from django.core.exceptions import PermissionDenied
from django.conf import settings
from ipaddress import ip_address, AddressValueError

TRUSTED_PROXIES = {"127.0.0.1", "::1"}

def get_client_ip(request) -> str | None:
  xff = request.META.get("HTTP_X_FORWARDED_FOR")
  if xff:
    chain = [ip.strip() for ip in xff.split(",")]
    while chain and chain[-1] in TRUSTED_PROXIES:
      chain.pop()
    candidate = chain[0] if chain else None
  else:
    candidate = request.META.get("REMOTE_ADDR")

  try:
    return str(ip_address(candidate))
  except AddressValueError:
    return None


class AdminIPRestrictionMiddleware:
  def __init__(self, response):
    self.response = response

  def __call__(self, request: HttpRequest) -> HttpResponse:
    if request.path.startswith(f"/{settings.ADMIN_URL}"):
      client_ip: str = get_client_ip(request)
      if client_ip not in settings.ADMIN_IPS:
        raise PermissionDenied("Access denied")

    return self.response(request)