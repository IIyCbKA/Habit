from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.db import models
from django.utils import timezone

from .constants import *

from datetime import timedelta
from random import randint

class CustomUser(AbstractUser):
  is_email_verified = models.BooleanField(default=False)
  secret_code = models.CharField(blank=True, editable=False)
  code_created_at = models.DateTimeField(null=True, blank=True)

  def generate_secret_code(self) -> str:
    raw = f"{randint(0, 10 ** VERIFICATION_CODE_LENGTH - 1):0{VERIFICATION_CODE_LENGTH}d}"
    self.secret_code = make_password(raw)
    self.code_created_at = timezone.now()

    return raw

  def regenerate_secret_code(self) -> str:
    raw = self.generate_secret_code()
    self.save(update_fields=['secret_code', 'code_created_at'])

    return raw

  def verify_email(self) -> str:
    self.is_email_verified = True
    raw = self.generate_secret_code()
    self.save(update_fields=['is_email_verified', 'secret_code', 'code_created_at'])

    return raw

  def is_code_expired(self) -> bool:
    if not self.code_created_at:
      return True
    return timezone.now() - self.code_created_at > timedelta(minutes=VERIFICATION_CODE_LIFE_TIME_MINUTES)