from django.urls import path
from habit_server import views

urlpatterns = [
    path('login/', views.login),
    path('signup/', views.signup),
    path('test_token/', views.test_token),
]
