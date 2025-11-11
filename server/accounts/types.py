from dataclasses import dataclass

@dataclass(frozen=True)
class OAuthCallbackContext:
  provider: str
  code: str
  state: str
  flow: str
  next_url: str | None
  redirect_uri: str
  code_verifier: str
