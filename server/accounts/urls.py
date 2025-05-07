from django.urls import path
from .views import RefreshView, LoginView, RegisterView, LogoutView

urlpatterns = [
  path('register/', RegisterView.as_view(), name='auth_register'),
  path('login/', LoginView.as_view(), name='auth_login'),
  path('refresh/', RefreshView.as_view(), name='token_refresh'),
  path('logout/', LogoutView.as_view(), name='auth_logout'),
]