from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.validators import RegexValidator
from email_validator import validate_email, EmailNotValidError
from rest_framework import serializers
from datetime import timedelta

from core.utils import seconds2dhms
from .constants import (
  PASSWORD_PATTERN,
  PASSWORD_VALIDATE_ERROR,
  USERNAME_CHANGE_LIMIT_ERROR,
)
from .models import UsernameChange

User = get_user_model()

def check_deliverability(email: str) -> None:
  try:
    validate_email(
      email,
      check_deliverability=not settings.DEBUG,
      allow_smtputf8=True,
      test_environment=settings.DEBUG,
    )
  except EmailNotValidError as e:
    raise serializers.ValidationError(str(e))


def check_username_change_limit(user: User) -> None:
  cutoff = UsernameChange.get_cutoff()
  active_qs = (UsernameChange.objects
    .filter(user=user, changed_at__gte=cutoff)
    .order_by('changed_at')
  )

  if active_qs.count() >= settings.USERNAME_CHANGE_LIMIT:
    first_active = active_qs.first()
    remaining: timedelta = first_active.time_until_next_change()
    human: str = seconds2dhms(remaining)

    message = USERNAME_CHANGE_LIMIT_ERROR.format(
      limit=settings.USERNAME_CHANGE_LIMIT,
      window_days=settings.USERNAME_CHANGE_WINDOW_DAYS,
      human=human,
    )

    raise serializers.ValidationError(message)


ascii_password_validator = RegexValidator(
    regex=PASSWORD_PATTERN,
    message=PASSWORD_VALIDATE_ERROR
)