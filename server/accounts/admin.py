from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
  fieldsets = UserAdmin.fieldsets + (
    (None, {'fields': ['is_email_verified', 'secret_code', 'code_created_at',]}),
  )

  add_fieldsets = UserAdmin.add_fieldsets + (
    (None, {'fields': ['is_email_verified',]}),
  )

  readonly_fields = ('secret_code', 'code_created_at')
  list_display = UserAdmin.list_display + ('is_email_verified',)
