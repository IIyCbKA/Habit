from django.urls import path
from .views import (
  RefreshView,
  LoginView,
  PendingRegisterView,
  LogoutView,
  EmailConfirmView,
  ResendCodeView,
  PasswordResetView,
)

urlpatterns = [
  path('register/', PendingRegisterView.as_view(), name='register'),
  path('email/confirm/', EmailConfirmView.as_view(), name='email_confirm'),
  path('code/resend/', ResendCodeView.as_view(), name='code_resend'),
  path('password/reset/', PasswordResetView.as_view(), name='password_reset'),
  path('login/', LoginView.as_view(), name='login'),
  path('refresh/', RefreshView.as_view(), name='token_refresh'),
  path('logout/', LogoutView.as_view(), name='logout'),
]