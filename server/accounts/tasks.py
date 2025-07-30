from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.token_blacklist.models import (
  OutstandingToken,
  BlacklistedToken
)

from .constants import *

@shared_task
def blacklistRefreshJTI(jti: str) -> None:
  ot = OutstandingToken.objects.filter(jti=jti).first()
  if ot:
    BlacklistedToken.objects.get_or_create(token=ot)


@shared_task
def send_verification_email(email: str, code: str) -> None:
  message: str = VERIFICATION_MAIL_BODY.format(
    code=code,
    minutes=VERIFICATION_CODE_LIFE_TIME_MINUTES
  )

  send_mail(
    subject=VERIFICATION_MAIL_SUBJECT,
    message=message,
    from_email=settings.DEFAULT_FROM_EMAIL,
    recipient_list=[email],
    fail_silently=False,
  )
