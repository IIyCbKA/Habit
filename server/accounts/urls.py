from django.urls import path
from .views import (
  RefreshView,
  LoginView,
  PendingRegisterView,
  LogoutView,
  VerifyEmailView
)

urlpatterns = [
  path('pending-register/', PendingRegisterView.as_view(), name='register'),
  path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
  path('login/', LoginView.as_view(), name='login'),
  path('refresh/', RefreshView.as_view(), name='token_refresh'),
  path('logout/', LogoutView.as_view(), name='logout'),
]