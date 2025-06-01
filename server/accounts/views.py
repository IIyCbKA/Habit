from django.conf import settings
from django.utils import timezone
from django.db.models import Q
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import (
  RefreshToken,
  AccessToken,
  TokenError
)

from .serializers import RegisterSerializer, UserSerializer
from rest_framework.permissions import AllowAny

from .tasks import blacklistRefreshJTI
from .schemas import AuthResponseData
from typing import Optional

User = get_user_model()

def getTokensForUser(user: User) -> tuple[RefreshToken, AccessToken]:
  refresh: RefreshToken = RefreshToken.for_user(user)
  access: AccessToken = refresh.access_token
  return refresh, access


def resetTokenFromRequest(request: Request) -> None:
  cookieName: str = settings.SIMPLE_JWT['REFRESH_COOKIE']
  rawRefresh: Optional[str] = request.COOKIES.get(cookieName)

  if not rawRefresh:
    return

  try:
    refresh: RefreshToken = RefreshToken(rawRefresh)
    jti: str = refresh["jti"]
    blacklistRefreshJTI.apply_async(args=(jti,), countdown=30)
  except TokenError:
    return


def createResponse(request: Request, user: User, httpStatus: int) -> Response:
  resetTokenFromRequest(request)

  refresh, access = getTokensForUser(user)
  data: AuthResponseData = {
    'accessToken': str(access),
    'user': UserSerializer(user).data,
  }

  response: Response = Response(data, status=httpStatus)
  setRefresh2Cookie(response, refresh)

  return response


def setRefresh2Cookie(response: Response, refresh: RefreshToken) -> None:
  response.set_cookie(
    key=settings.SIMPLE_JWT['REFRESH_COOKIE'],
    value=str(refresh),
    max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
    httponly=settings.SIMPLE_JWT['REFRESH_COOKIE_HTTP_ONLY'],
    secure=settings.SIMPLE_JWT['REFRESH_COOKIE_SECURE'],
    samesite=settings.SIMPLE_JWT['REFRESH_COOKIE_SAMESITE'],
  )


class RegisterView(APIView):
  permission_classes = [AllowAny]

  def post(self, request) -> Response:
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    response: Response = createResponse(request, user, status.HTTP_201_CREATED)
    return response


class LoginView(APIView):
  permission_classes = [AllowAny]

  def post(self, request) -> Response:
    identifier: str = request.data.get('identifier')
    password: str = request.data.get('password')

    try:
      user = User.objects.get(Q(username=identifier) | Q(email=identifier))
    except User.DoesNotExist:
      return Response(status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
      return Response(status=status.HTTP_401_UNAUTHORIZED)

    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])

    response: Response = createResponse(request, user, status.HTTP_200_OK)
    return response


class RefreshView(APIView):
  permission_classes = [AllowAny]

  def post(self, request) -> Response:
    cookieName: str = settings.SIMPLE_JWT['REFRESH_COOKIE']
    rawRefresh: Optional[str] = request.COOKIES.get(cookieName)

    if rawRefresh is None:
      return Response({'detail': 'Refresh token not provided'},
        status=status.HTTP_401_UNAUTHORIZED)

    try:
      oldRefresh: RefreshToken = RefreshToken(rawRefresh)
    except TokenError:
      return Response({'detail': 'Invalid or expired refresh token'},
        status=status.HTTP_401_UNAUTHORIZED)

    try:
      userID: int = oldRefresh.payload.get('user_id')
      user = User.objects.get(pk=userID)
    except (KeyError, User.DoesNotExist):
      return Response({'detail': 'User not found'},
        status=status.HTTP_401_UNAUTHORIZED)

    response: Response = createResponse(request, user, status.HTTP_200_OK)
    return response


class LogoutView(APIView):
  permission_classes = [AllowAny]

  def post(self, request) -> Response:
    resetTokenFromRequest(request)

    return Response(status=status.HTTP_200_OK)
