from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .constants import *

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
  username = serializers.CharField(
    validators=[UniqueValidator(
      queryset=User.objects.all(),
      message=USERNAME_TAKEN_ERROR
    )],
    min_length=1,
  )

  email = serializers.EmailField(
    validators=[UniqueValidator(
      queryset=User.objects.all(),
      message=EMAIL_TAKEN_ERROR
    )]
  )

  password = serializers.CharField(write_only=True, min_length=8)

  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'password')
    read_only_fields = ('id',)

  def create(self, validated_data) -> User:
    user = User(
      username=validated_data['username'],
      email=validated_data['email'],
    )
    user.set_password(validated_data['password'])
    user.save()

    return user


class LoginSerializer(serializers.Serializer):
  identifier = serializers.CharField()
  password = serializers.CharField(write_only=True)

  def validate(self, data):
    identifier = data['identifier']
    password = data['password']

    try:
      user = User.objects.get(Q(username=identifier) | Q(email=identifier))
    except User.DoesNotExist:
      return serializers.ValidationError(USER_NOT_FOUND_ERROR)

    if not user.check_password(password):
      return serializers.ValidationError(USER_NOT_FOUND_ERROR)

    data['user'] = user

    return data

  def save(self):
    user = self.validated_data['user']
    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])
    return user
