from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .constants import *
from .tasks import send_verification_email

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
    fields = ('id', 'username', 'email', 'password', 'is_email_verified')
    read_only_fields = ('id', 'is_email_verified')

  def create(self, validated_data) -> User:
    user = User(
      username=validated_data['username'],
      email=validated_data['email'],
    )
    user.set_password(validated_data['password'])

    user.save()
    raw_code = user.regenerate_secret_code()
    send_verification_email.delay(user.email, raw_code)

    return user


class EmailVerificationSerializer(serializers.Serializer):
  code = serializers.CharField(
    min_length=VERIFICATION_CODE_LENGTH,
    max_length=VERIFICATION_CODE_LENGTH,
    write_only=True
  )

  def validate(self, data):
    user: User = self.context['user']
    code = data['code']

    if user.is_code_expired():
      raise serializers.ValidationError(VERIFICATION_CODE_EXPIRED_ERROR)

    if not check_password(code, user.secret_code):
      raise serializers.ValidationError(VERIFICATION_CODE_INCORRECT_ERROR)

    return data

  def save(self, **kwargs) -> User:
    user: User = self.context['user']
    user.is_email_verified = True
    user.save(update_fields=['is_email_verified'])
    user.regenerate_secret_code()

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

  def save(self) -> User:
    user = self.validated_data['user']
    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])
    return user
