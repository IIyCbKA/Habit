from ipaddress import ip_address, ip_network
from datetime import timedelta

TRUSTED_PROXIES = [
  ip_network('127.0.0.1'),
  ip_network('::1')
]

def _is_trusted(ip_str: str) -> bool:
  try:
    ip = ip_address(ip_str)
  except ValueError:
    return False
  return any(ip in net for net in TRUSTED_PROXIES)


def get_client_ip(request) -> str | None:
  xff = request.META.get('HTTP_X_FORWARDED_FOR')
  if xff:
    chain = [ip.strip() for ip in xff.split(',') if ip.strip()]
    for part in reversed(chain):
      try:
        ip = ip_address(part)
      except ValueError:
        continue
      if not _is_trusted(str(ip)):
        return str(ip)

  remote = request.META.get('REMOTE_ADDR')
  try:
    return str(ip_address(remote)) if remote else None
  except ValueError:
    return None


def seconds2dhms(value: int | float | timedelta) -> str:
  if isinstance(value, timedelta):
    total = int(value.total_seconds())
  else:
    total = int(value)

  if total <= 0:
    return '0 seconds'

  days, rem = divmod(total, 86400)
  hours, rem = divmod(rem, 3600)
  minutes, seconds = divmod(rem, 60)

  parts = []
  if days:
    parts.append(f'{days} days')
  if hours or (days and (minutes or seconds)):
    parts.append(f'{hours} hours')
  if minutes or (hours and seconds):
    parts.append(f'{minutes} minutes')
  parts.append(f'{seconds} seconds')
  return ', '.join(parts)
