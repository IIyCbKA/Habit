from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class RegisterSerializer(serializers.ModelSerializer):
  username = serializers.CharField(
    validators=[UniqueValidator(
      queryset=User.objects.all(),
      message="Username already taken"
    )]
  )

  email = serializers.EmailField(
    validators=[UniqueValidator(
      queryset=User.objects.all(),
      message="Email already taken"
    )]
  )

  password = serializers.CharField(write_only=True)

  class Meta:
    model = User
    fields = ('username', 'password', 'email')

  def create(self, validatedData) -> User:
    user = User(
      username=validatedData['username'],
      email=validatedData['email'],
    )
    user.set_password(validatedData['password'])
    user.save()
    return user


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username', 'email')