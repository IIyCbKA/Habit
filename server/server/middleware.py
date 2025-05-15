from django.http import HttpRequest, HttpResponse
from django.core.exceptions import PermissionDenied
from django.conf import settings

class AdminIPRestrictionMiddleware:
  def __init__(self, response):
    self.response = response

  def __call__(self, request: HttpRequest) -> HttpResponse:
    if request.path.startswith(f"/{settings.ADMIN_URL}"):
      clientID = request.META.get('REMOTE_ADDR')
      if clientID not in settings.ADMIN_IPS:
        raise PermissionDenied("Access denied")

    return self.response(request)
