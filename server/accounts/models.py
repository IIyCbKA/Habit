from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db.models import Q, UniqueConstraint
from django.db.models.functions import Lower
from django.contrib.auth.hashers import make_password
from django.db import models, transaction
from django.utils import timezone

from .constants import VERIFICATION_CODE_LENGTH

from datetime import datetime, timedelta
from functools import lru_cache
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

  def change_username(self, new_username: str) -> None:
    old = self.username
    with transaction.atomic():
      self.username = new_username
      self.save(update_fields=['username'])
      UsernameChange.objects.create(
        user=self,
        old_username=old,
        new_username=new_username
      )


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


class Device(models.Model):
  device_id = models.CharField(max_length=64, unique=True, db_index=True)
  created_at = models.DateTimeField(auto_now_add=True)
  last_seen = models.DateTimeField(default=timezone.now, db_index=True)
  last_ip = models.GenericIPAddressField(null=True, blank=True)

  user_agent = models.TextField(null=True, blank=True)
  language = models.CharField(max_length=64, null=True, blank=True)
  screen = models.CharField(max_length=64, null=True, blank=True)
  logical_processors = models.IntegerField(null=True, blank=True)
  approx_memory = models.IntegerField(null=True, blank=True)
  cookies_enabled = models.BooleanField(null=True, blank=True)
  platform = models.CharField(max_length=128, null=True, blank=True)
  timezone = models.CharField(max_length=64, null=True, blank=True)

  @classmethod
  @lru_cache(maxsize=1)
  def get_updatable_fields(cls):
    immutable = {'id', 'device_id', 'created_at'}
    names = {f.name for f in cls._meta.concrete_fields}
    return names - immutable

  def __str__(self) -> str:
    return self.device_id or f'Device {self.pk}'


class UserDevice(models.Model):
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='user_devices'
  )
  device = models.ForeignKey(
    Device,
    on_delete=models.CASCADE,
    related_name='user_devices'
  )

  class Meta:
    unique_together = ('user', 'device')


class UsernameChangeQuerySet(models.QuerySet):
  def old(self):
    cutoff = timezone.now() - timedelta(days=settings.USERNAME_CHANGE_WINDOW_DAYS)
    return self.filter(changed_at__lt=cutoff)


class UsernameChange(models.Model):
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='username_changes'
  )
  old_username = models.CharField(max_length=150)
  new_username = models.CharField(max_length=150)
  changed_at = models.DateTimeField(auto_now_add=True, db_index=True)

  objects = UsernameChangeQuerySet.as_manager()

  @staticmethod
  def get_window() -> timedelta:
    return timedelta(days=settings.USERNAME_CHANGE_WINDOW_DAYS)

  @classmethod
  def get_cutoff(cls) -> datetime:
    return timezone.now() - cls.get_window()

  def time_until_next_change(self) -> timedelta:
    next_allowed_at: datetime = self.changed_at + self.get_window()
    remaining: timedelta = next_allowed_at - timezone.now()

    if remaining.total_seconds() < 0:
      return timedelta(0)
    return remaining

  def __str__(self):
    return f'{self.user} {self.old_username} → {self.new_username} @ {self.changed_at}'