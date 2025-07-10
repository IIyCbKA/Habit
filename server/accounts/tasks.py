from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.token_blacklist.models import (
  OutstandingToken,
  BlacklistedToken
)

from .constants import *
import requests

@shared_task
def blacklistRefreshJTI(jti: str) -> None:
  ot = OutstandingToken.objects.filter(jti=jti).first()
  if ot:
    BlacklistedToken.objects.get_or_create(token=ot)


@shared_task
def send_verification_email(email: str, code: str) -> None:
  message: str = (
    f"Hello!\n\n"
    f"To verify your email, please use the following code: {code}\n\n"
    f"This code is valid for {VERIFICATION_CODE_LIFE_TIME} hours.\n\n"
    "If you did not request this verification, please disregard this email."
  )

  if settings.DEBUG:
    send_mail(
      subject=VERIFICATION_MAIL_SUBJECT,
      message=message,
      from_email=settings.DEFAULT_FROM_EMAIL,
      recipient_list=[email],
      fail_silently=False,
    )
    return

  payload: dict = {
    'sender': {
      'name': EMAIL_FROM_NAME,
      'email': EMAIL_FROM_EMAIL,
    },
    'to': [{'email': email}],
    'subject': VERIFICATION_MAIL_SUBJECT,
    'textContent': message,
  }

  headers: dict = {
    'accept': 'application/json',
    'api-key': settings.EMAIL_API_KEY,
    'content-type': 'application/json',
  }

  response = requests.post(EMAIL_SENDER_URL, headers=headers, json=payload)
  response.raise_for_status()
