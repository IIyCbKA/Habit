from celery import shared_task
from rest_framework_simplejwt.token_blacklist.models import (
  OutstandingToken,
  BlacklistedToken
)

@shared_task
def blacklistRefreshJTI(jti: str) -> None:
  ot = OutstandingToken.objects.filter(jti=jti).first()
  if ot:
    BlacklistedToken.objects.get_or_create(token=ot)
