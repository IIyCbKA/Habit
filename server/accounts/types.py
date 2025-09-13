from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class OAuthCallbackContext:
  provider: str
  code: str
  state: str
  flow: str
  next_url: Optional[str]
  redirect_uri: str
