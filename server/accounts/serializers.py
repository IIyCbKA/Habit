from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .constants import *
from .validators import check_deliverability, ascii_password_validator

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
  username = serializers.CharField(
    min_length=1,
    validators=[UniqueValidator(
      queryset=User.objects.all(),
      lookup='iexact',
      message=USERNAME_TAKEN_ERROR
    )],
  )

  email = serializers.EmailField(
    validators=[UniqueValidator(
      queryset=User.objects.all(),
      lookup='iexact',
      message=EMAIL_TAKEN_ERROR
    )]
  )

  password = serializers.CharField(
    write_only=True,
    validators=[ascii_password_validator],
  )

  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'password', 'is_email_verified')
    read_only_fields = ('id', 'is_email_verified')

  def validate_email(self, value: str) -> str:
    if self.instance is None or self.instance.email.lower() != value.lower():
      check_deliverability(value)

    return value

  def create(self, validated_data) -> User:
    user = User(
      username=validated_data['username'],
      email=validated_data['email'],
    )
    user.set_password(validated_data['password'])
    user.save()

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
    user.verify_email()

    return user


class LoginSerializer(serializers.Serializer):
  identifier = serializers.CharField()
  password = serializers.CharField(write_only=True)

  def validate(self, data):
    identifier = data['identifier']
    password = data['password']

    try:
      user = User.objects.get(
        Q(username__iexact=identifier) |
        Q(email__iexact=identifier)
      )
    except User.DoesNotExist:
      raise serializers.ValidationError(INVALID_CREDENTIALS_ERROR)

    if not user.check_password(password):
      raise serializers.ValidationError(INVALID_CREDENTIALS_ERROR)

    data['user'] = user

    return data

  def save(self) -> User:
    user = self.validated_data['user']
    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])

    return user


class PasswordResetSerializer(serializers.Serializer):
  email = serializers.EmailField()

  def validate(self, data):
    user: User = User.objects.filter(email__iexact=data['email']).first()
    if user:
      data['user'] = user

    return data
