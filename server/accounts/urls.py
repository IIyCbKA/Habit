from django.urls import path
from .views.auth import (
  RefreshView,
  LoginView,
  PendingRegisterView,
  LogoutView,
  EmailConfirmView,
  ResendCodeView,
  PasswordResetView,
  PasswordResetConfirmView,
  ValidatePasswordResetTokenView,
)

from .views.oauth import OAuthStartView, OAuthCallbackView

urlpatterns = [
  path('register/', PendingRegisterView.as_view(), name='register'),
  path('email/confirm/', EmailConfirmView.as_view(), name='email_confirm'),
  path('code/resend/', ResendCodeView.as_view(), name='code_resend'),
  path('password/reset/', PasswordResetView.as_view(), name='password_reset'),
  path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
  path('password/reset/validate/', ValidatePasswordResetTokenView.as_view(), name='password_reset_validate'),
  path('login/', LoginView.as_view(), name='login'),
  path('refresh/', RefreshView.as_view(), name='token_refresh'),
  path('logout/', LogoutView.as_view(), name='logout'),
  path('oauth/<str:provider>/start/', OAuthStartView.as_view(), name='oauth_start'),
  path('oauth/<str:provider>/callback/', OAuthCallbackView.as_view(), name='oauth_callback'),
]