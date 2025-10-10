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
PASSWORD_VALIDATE_ERROR = (
  'Password must be at least {min_length} characters long, '
  'contain at least one letter and one digit, '
  'and consist only of ASCII letters and digits'
).format(min_length=PASSWORD_MIN_LENGTH)


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

NEW_DEVICE_LOGIN_SUBJECT = 'New sign-in to your Greenhabit account'
NEW_DEVICE_LOGIN_BODY = """
Hi,

We detected a sign-in to your Greenhabit account from a new 
device on {time} {timezone}:

Platform: {platform}
IP address: {ip}

If this was you, no further action is required.

If you do NOT recognize this activity, please secure your account immediately 
by open the Greenhabit website and change password from your account settings.

Thanks,
The Greenhabit Team
"""