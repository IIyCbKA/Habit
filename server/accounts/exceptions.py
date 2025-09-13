from rest_framework.exceptions import APIException

class EmailAlreadyVerifiedError(APIException):
  status_code = 409
  default_detail = 'Email address already verified'


class InvalidRefreshTokenError(APIException):
  status_code = 401
  default_detail = 'Invalid or expired refresh token'


class OAuthConflictError(APIException):
  status_code = 409
  default_detail = 'Social account already linked to another user'


class OAuthProviderError(APIException):
  status_code = 502
  default_detail = 'Provider API error'


class OAuthRedirectMismatch(APIException):
  status_code = 400
  default_detail = 'OAuth redirect_uri mismatch'


class OAuthStateError(APIException):
  status_code = 400
  default_detail = 'Invalid or expired OAuth state'


class OAuthTokenExchangeError(APIException):
  status_code = 502
  default_detail = 'Failed to exchange authorization code'
