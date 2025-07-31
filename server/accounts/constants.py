EMAIL_FROM_NAME = 'Green Habit Team'
EMAIL_FROM_EMAIL = 'no-reply@greenhabit.ru'
EMAIL_SENDER_URL = 'https://api.brevo.com/v3/smtp/email'
EMAIL_TAKEN_ERROR = 'Email already taken'
INVALID_REFRESH_ERROR = 'Invalid or expired refresh token'
PASSWORD_MIN_LENGTH = 8
PASSWORD_PATTERN = (
  rf'^(?=.*[A-Za-z])'
  rf'(?=.*\d)'
  rf'[A-Za-z\d]{{{PASSWORD_MIN_LENGTH},}}$'
)
PASSWORD_VALIDATE_ERROR = (
    f'Password must be at least '
    f'{PASSWORD_MIN_LENGTH} characters long, '
    f'contain at least one letter and one digit, '
    f'and consist only of ASCII letters and digits.'
)
REFRESH_NOT_PROVIDED_ERROR = 'Refresh token not provided'
USER_NOT_FOUND_ERROR = 'User not found'
USERNAME_TAKEN_ERROR = 'Username already taken'
VERIFICATION_CODE_EXPIRED_ERROR = 'Verification code expired'
VERIFICATION_CODE_INCORRECT_ERROR = 'Verification code incorrect'
VERIFICATION_CODE_LENGTH = 6
VERIFICATION_CODE_LIFE_TIME_MINUTES = 10
VERIFICATION_MAIL_SUBJECT = 'Your email verification code for Habit'
VERIFICATION_MAIL_BODY = """
Hello!

To verify your email, please use the following code: {code}
This code is valid for {minutes} minutes.

If you did not request this verification, please disregard this email.
"""