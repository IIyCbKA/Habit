from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
  is_email_verified = models.BooleanField(default=False)
  secret_code = models.CharField(max_length=16, blank=True, editable=False)
  code_created_at = models.DateTimeField(null=True, blank=True)
