#####################
#      CONFIGS      #
#####################
PASSWORD_MIN_LENGTH = 8
PASSWORD_PATTERN = (
  r'^(?=.*[A-Za-z])'
  r'(?=.*\d)'
  rf'[A-Za-z\d]{{{PASSWORD_MIN_LENGTH},}}'
  r'$'
)
VERIFICATION_CODE_LENGTH = 6


######################
#       ERRORS       #
######################
EMAIL_TAKEN_ERROR = 'Email already taken'
INVALID_CREDENTIALS_ERROR = 'Invalid identifier or password'
INVALID_REFRESH_ERROR = 'Invalid or expired refresh token'
PASSWORD_VALIDATE_ERROR = (
  'Password must be at least {min_length} characters long, '
  'contain at least one letter and one digit, '
  'and consist only of ASCII letters and digits.'
).format(min_length=PASSWORD_MIN_LENGTH)
REFRESH_NOT_PROVIDED_ERROR = 'Refresh token not provided'
USERNAME_TAKEN_ERROR = 'Username already taken'
VERIFICATION_CODE_EXPIRED_ERROR = 'Verification code expired'
VERIFICATION_CODE_INCORRECT_ERROR = 'Verification code incorrect'


#####################
#       MAILS       #
#####################
RESET_PASSWORD_MAIL_SUBJECT = 'Password reset request'
RESET_PASSWORD_MAIL_BODY = """
Hi,

You requested a password reset for your Greenhabit account.

The link will be valid until {expiry} {timezone}.
{link}

If you didn't request this, just ignore this email.
If the link doesn't work, request a new password reset from the app.

Thanks,
The Greenhabit Team
"""

VERIFICATION_MAIL_SUBJECT = 'Your email verification code for Habit'
VERIFICATION_MAIL_BODY = """
Hi,

To verify your email, please use the following code: {code}
This code is valid until {expiry} {timezone}.

If you did not request this verification, please disregard this email.

Thanks,
The Greenhabit Team
"""