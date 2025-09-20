from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db.models import Q, UniqueConstraint
from django.db.models.functions import Lower
from django.contrib.auth.hashers import make_password
from django.db import models
from django.utils import timezone

from .constants import VERIFICATION_CODE_LENGTH

from datetime import timedelta
import secrets

class CustomUser(AbstractUser):
  email = models.EmailField(null=True, blank=True)
  is_email_verified = models.BooleanField(default=False)

  class Meta:
    constraints = [
      UniqueConstraint(Lower('username'), name='uniq_username_ci'),
      UniqueConstraint(
        Lower('email'),
        condition=Q(email__isnull=False) & ~Q(email=''),
        name='uniq_email_ci',
      ),
    ]

  def verify_email(self) -> None:
    self.is_email_verified = True
    self.save(update_fields=['is_email_verified'])


class EmailVerificationCodeQuerySet(models.QuerySet):
  def expired(self):
    cutoff = timezone.now() - timedelta(seconds=settings.TIMEOUTS['VERIFICATION_CODE'])
    return self.filter(code_created_at__lt=cutoff)


class EmailVerificationCode(models.Model):
  user = models.OneToOneField(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='verification_code'
  )
  secret_code = models.CharField(max_length=255, blank=True, editable=False)
  code_created_at = models.DateTimeField(null=True, blank=True, db_index=True)

  objects = EmailVerificationCodeQuerySet.as_manager()

  def generate_code(self) -> str:
    raw = f'{secrets.randbelow(10 ** VERIFICATION_CODE_LENGTH):0{VERIFICATION_CODE_LENGTH}d}'
    self.secret_code = make_password(raw)
    self.code_created_at = timezone.now()
    self.save(update_fields=['secret_code', 'code_created_at'])
    return raw

  def regenerate_code(self) -> str:
    return self.generate_code()

  def check_code(self, input_code: str) -> bool:
    from django.contrib.auth.hashers import check_password
    return check_password(input_code, self.secret_code)

  def is_expired(self) -> bool:
    if not self.code_created_at:
      return True

    return timezone.now() - self.code_created_at > timedelta(seconds=settings.TIMEOUTS['VERIFICATION_CODE'])


class Provider(models.TextChoices):
  GOOGLE = 'google', 'Google'
  GITHUB = 'github', 'GitHub'
  YANDEX = 'yandex', 'Yandex'
  X = 'x', 'X'


class SocialAccount(models.Model):
  provider = models.CharField(max_length=20, choices=Provider.choices)
  provider_user_id = models.CharField(max_length=255, blank=True, editable=False)
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='social_accounts'
  )

  class Meta:
    constraints = [
      UniqueConstraint(
        fields=['provider', 'provider_user_id'],
        name='uq_provider_uid',
      ),
    ]
