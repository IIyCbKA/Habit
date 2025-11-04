from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.db.models import Q
from django.utils import timezone
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import EmailVerificationCode
from .validators import check_deliverability, ascii_password_validator

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
  username = serializers.CharField(
    validators=[UniqueValidator(
      queryset=User.objects.all(),
      lookup='iexact',
      message='Username already taken'
    )],
    allow_blank=False,
  )

  email = serializers.EmailField(
    validators=[UniqueValidator(
      queryset=User.objects.all(),
      lookup='iexact',
      message='Email already taken'
    )],
    allow_blank=False,
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
  code = serializers.CharField(allow_blank=False, write_only=True)

  def validate(self, data):
    user: User = self.context['user']
    code = data['code']

    try:
      verification = EmailVerificationCode.objects.select_for_update().get(user=user)
    except EmailVerificationCode.DoesNotExist:
      raise serializers.ValidationError('No verification code available')

    if verification.is_expired():
      raise serializers.ValidationError('Verification code expired')

    if not verification.check_code(code):
      raise serializers.ValidationError('Verification code incorrect')

    data['verification'] = verification
    return data

  def save(self, **kwargs) -> User:
    user: User = self.context['user']
    if not user.is_email_verified:
      user.verify_email()

    verification: EmailVerificationCode | None = self.validated_data.get('verification')
    if verification:
      verification.delete()
    else:
      EmailVerificationCode.objects.filter(user=user).delete()

    return user


class DeviceInfoSerializer(serializers.Serializer):
  device_id = serializers.CharField(max_length=64)
  user_agent = serializers.CharField(allow_null=True, required=False, allow_blank=True)
  language = serializers.CharField(allow_null=True, required=False, allow_blank=True)
  screen = serializers.CharField(allow_null=True, required=False, allow_blank=True)
  logical_processors = serializers.IntegerField(allow_null=True, required=False)
  approx_memory = serializers.IntegerField(allow_null=True, required=False)
  cookies_enabled = serializers.BooleanField(allow_null=True, required=False)
  platform = serializers.CharField(allow_null=True, required=False, allow_blank=True)
  timezone = serializers.CharField(allow_null=True, required=False, allow_blank=True)


class LoginSerializer(serializers.Serializer):
  identifier = serializers.CharField()
  password = serializers.CharField(write_only=True)
  device = DeviceInfoSerializer(required=False)

  def validate(self, data):
    identifier = data['identifier']
    password = data['password']

    try:
      user = User.objects.get(
        Q(username__iexact=identifier) |
        Q(email__iexact=identifier)
      )
    except User.DoesNotExist:
      raise serializers.ValidationError('Invalid identifier or password')

    if not user.check_password(password):
      raise serializers.ValidationError('Invalid identifier or password')

    data['user'] = user
    return data

  def save(self) -> User:
    user = self.validated_data['user']
    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])
    return user


class PasswordResetSerializer(serializers.Serializer):
  email = serializers.EmailField(allow_blank=False)

  def validate(self, data):
    user: User = User.objects.filter(email__iexact=data['email']).first()
    if user:
      data['user'] = user

    return data


class BasePasswordResetTokenSerializer(serializers.Serializer):
  uid = serializers.CharField(allow_blank=False)
  token = serializers.CharField(allow_blank=False)

  def validate(self, data):
    uidb64 = data['uid']
    token = data['token']

    try:
      uid = force_str(urlsafe_base64_decode(uidb64))
      user = User.objects.select_for_update().get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
      raise serializers.ValidationError(
        'Password reset link is invalid or has expired'
      )

    if not default_token_generator.check_token(user, token):
      raise serializers.ValidationError(
        'Password reset link is invalid or has expired'
      )

    data['user'] = user
    return data

  class Meta:
    abstract = True


class PasswordResetConfirmSerializer(BasePasswordResetTokenSerializer):
  new_password = serializers.CharField(
    write_only=True,
    validators=[ascii_password_validator],
  )

  def save(self) -> User:
    user = self.validated_data['user']
    token = self.validated_data['token']
    new_password = self.validated_data['new_password']

    if not default_token_generator.check_token(user, token):
      raise serializers.ValidationError(
        'Password reset link is invalid or has expired'
      )

    user.set_password(new_password)
    user.save(update_fields=['password'])
    return user


class ValidatePasswordResetTokenSerializer(BasePasswordResetTokenSerializer):
  pass


class UpdateUsernameSerializer(serializers.Serializer):
  username = serializers.CharField(
    validators=[UniqueValidator(
      queryset=User.objects.all(),
      lookup='iexact',
      message='This username already taken'
    )],
    allow_blank=False,
  )

  def save(self) -> User:
    user: User = self.context['user']
    user.username = self.validated_data['username']
    user.save(update_fields=['username'])
    return user
