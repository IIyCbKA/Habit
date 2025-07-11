from django.urls import path
from .views import (
  RefreshView,
  LoginView,
  PendingRegisterView,
  LogoutView,
  ConfirmEmailView
)

urlpatterns = [
  path('pending-register/', PendingRegisterView.as_view(), name='register'),
  path('confirm-email/', ConfirmEmailView.as_view(), name='confirm_email'),
  path('login/', LoginView.as_view(), name='login'),
  path('refresh/', RefreshView.as_view(), name='token_refresh'),
  path('logout/', LogoutView.as_view(), name='logout'),
]