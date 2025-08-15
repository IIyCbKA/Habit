from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
  fieldsets = UserAdmin.fieldsets + (
    (None, {'fields': ['is_email_verified',]}),
  )

  add_fieldsets = UserAdmin.add_fieldsets + (
    (None, {'fields': ['is_email_verified',]}),
  )

  readonly_fields = ()
  list_display = UserAdmin.list_display + ('is_email_verified',)


@admin.register(EmailVerificationCode)
class EmailVerificationCodeAdmin(admin.ModelAdmin):
  search_fields = ('user__username', 'user__email')
  readonly_fields = ('secret_code', 'code_created_at')
  list_display = ('user', 'code_created_at', 'is_expired')
