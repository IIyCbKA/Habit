from django.conf import settings
from django.core.validators import RegexValidator
from email_validator import validate_email, EmailNotValidError
from rest_framework import serializers

from .constants import PASSWORD_PATTERN, PASSWORD_VALIDATE_ERROR

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


ascii_password_validator = RegexValidator(
    regex=PASSWORD_PATTERN,
    message=PASSWORD_VALIDATE_ERROR
)