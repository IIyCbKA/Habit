from django.core.cache import cache
from django.conf import settings
from django.utils.crypto import salted_hmac, constant_time_compare

_GRACE = settings.REFRESH_ROTATION_GRACE_SECONDS

def _gkey(jti: str) -> str:
  return f'refresh:grace:{jti}'


def _fp(token_str: str) -> str:
  return salted_hmac(
    key_salt='refresh:grace',
    value=token_str,
    secret=settings.REFRESH_GRACE_SECRET
  ).hexdigest()


def put_in_grace(jti: str, token_str: str, seconds: int | None = None) -> None:
  cache.set(_gkey(jti), _fp(token_str), timeout=seconds or _GRACE)


def in_grace(jti: str, token_str: str | None = None) -> bool:
  val = cache.get(_gkey(jti))
  if not val:
    return False

  if isinstance(val, str):
    if not token_str:
      return False
    return constant_time_compare(_fp(token_str), val)

  return bool(val)
