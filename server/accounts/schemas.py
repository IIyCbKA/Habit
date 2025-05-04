from typing import TypedDict


class UserData(TypedDict):
  id: int
  username: str
  email: str


class AuthResponseData(TypedDict):
  accessToken: str
  user: UserData
