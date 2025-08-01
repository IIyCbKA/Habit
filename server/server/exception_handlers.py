from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .constants import VALIDATION_ERROR_KEY

def _first_error(data) -> str:
  if isinstance(data, (list, tuple)):
    return _first_error(data[0])

  if isinstance(data, dict):
    for value in data.values():
      return _first_error(value)

  return str(data)


def custom_exception_handler(exc, context) -> Response:
  response = exception_handler(exc, context)

  if response is not None and isinstance(exc, ValidationError):
    response.data = {VALIDATION_ERROR_KEY: _first_error(response.data)}

  return response
