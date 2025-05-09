# Django Rest Framework server for project "Habit"

## Installation and setup

1. Install all requirements
```bash
pip install -r requirements-base.txt
```

2. Create `.env` file in the project root with the following variables:
```
DJANGO_ADMIN_URL=your_url
DJANGO_ADMIN_IP=public_ip_of_admin_for_django_admin/
DB_NAME=name_of_your_db
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=your_host
DB_PORT=your_host
SECRET_KEY=your_secret_key
```

3. Set up a PostgreSQL database using the credentials from your `.env` file


## Running the server

1. Apply migrations
```bash
python manage.py migrate
```
2. Run development server
```bash
python manage.py runserver
```