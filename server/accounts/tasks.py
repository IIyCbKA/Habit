from celery import shared_task
from django.core.mail import send_mail
from django.core.management import call_command
from django.conf import settings
from django.utils import timezone

from datetime import datetime, timedelta

from .constants import *
from .models import EmailVerificationCode


def _send_email(
  email: str,
  timeout_key: str,
  body_template: str,
  format_kwargs: dict,
  subject: str
) -> None:
  timeout_seconds: int = settings.TIMEOUTS[timeout_key]
  expiry: datetime = timezone.now() + timedelta(seconds=timeout_seconds)
  expiry_str: str = expiry.strftime("%Y-%m-%d %H:%M:%S")

  format_kwargs = {
    **format_kwargs,
    'expiry': expiry_str,
    'timezone': settings.TIME_ZONE,
  }

  message: str = body_template.format(**format_kwargs)

  send_mail(
    subject=subject,
    message=message,
    from_email=settings.DEFAULT_FROM_EMAIL,
    recipient_list=[email],
    fail_silently=False,
  )


@shared_task
def send_verification_email(email: str, code: str) -> None:
  _send_email(
    email=email,
    timeout_key='VERIFICATION_CODE',
    body_template=VERIFICATION_MAIL_BODY,
    format_kwargs={'code': code},
    subject=VERIFICATION_MAIL_SUBJECT,
  )


@shared_task
def send_password_reset_email(email: str, reset_link: str) -> None:
  _send_email(
    email=email,
    timeout_key='PASSWORD_RESET_LINK',
    body_template=RESET_PASSWORD_MAIL_BODY,
    format_kwargs={'link': reset_link},
    subject=RESET_PASSWORD_MAIL_SUBJECT,
  )


@shared_task
def flush_expired_jwt_tokens():
  call_command('flushexpiredtokens')


@shared_task
def purge_expired_email_codes():
  deleted, _ = EmailVerificationCode.objects.expired().delete()
  return deleted