from django.urls import path
from .views import (
  RefreshView,
  LoginView,
  PendingRegisterView,
  LogoutView,
  EmailConfirmView,
  CodeResendView
)

urlpatterns = [
  path('register/', PendingRegisterView.as_view(), name='register'),
  path('email/confirm/', EmailConfirmView.as_view(), name='email_confirm'),
  path('code/resend/', CodeResendView.as_view(), name='code_resend'),
  path('login/', LoginView.as_view(), name='login'),
  path('refresh/', RefreshView.as_view(), name='token_refresh'),
  path('logout/', LogoutView.as_view(), name='logout'),
]