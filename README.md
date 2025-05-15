# Habit (in development) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/IIyCbKA/Chess/blob/main/LICENSE) [![Python](https://img.shields.io/badge/Python-3.12-blue)](https://www.python.org/downloads/release/python-3120/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/) [![Node](https://img.shields.io/badge/Node-20-green)](https://nodejs.org/en) [![Django](https://img.shields.io/badge/Django-5.2-green)](https://www.djangoproject.com/download/?supported-versions)

## 🌿 Description
**Habit** is a web app that helps users set health-related goals, track daily progress, leave notes, and visualize achievements. Your health matters most!

## 🛠️ Pre-setup

#### 1. **Prepare environment file**
Copy the template and fill only the variables relevant to your environment:

   ```bash
   cp .env.example .env
   ```

#### 2. **Configure `.env`**

   ```dotenv
   # ==============================================================================
#                                   GENERAL
# ==============================================================================
SECRET_KEY=your_secret_key
DJANGO_ADMIN_URL=your_admin_url
DB_NAME=your_db_name_for_server
DB_USER=your_db_user_for_server
DB_PASSWORD=your_db_password_for_server
DB_HOST=your_db_host_from_for_server
DB_PORT=your_db_port_from_for_server


# ==============================================================================
#                                     LOCAL
# ==============================================================================
DEBUG=True


# ==============================================================================
#                                     PROD
# ==============================================================================
POSTGRES_NAME=your_postgres_name
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_HOST=your_postgres_host
POSTGRES_PORT=your_postgres_port
DJANGO_HOST_URL=your_server_host
DJANGO_ADMIN_IP=your_ip_for_django_admin
   ```

## 📦 Assets Attribution
- Flags: [Rene Herrmann Figma files](https://www.figma.com/community/plugin/749888869584535589/flags) under [Community Free Resource License](https://www.figma.com/legal/community-free-resource-license) (Cropped original images).
- Utils Icons: [Ahmad Al Haddad Figma files](https://www.figma.com/community/plugin/775671607185029020/material-design-icons-community) under [Community Free Resource License](https://www.figma.com/legal/community-free-resource-license) (Repainted original images).
- Social Media Icons: [Mads Egmose Figma files](https://www.figma.com/community/file/839558611085349133) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (Repainted original images, Google icon was copied, and components were merged into a single entity.).

## 📄 Licence
- Project: [MIT licensed](https://github.com/IIyCbKA/Habit/blob/main/LICENSE).
- Flags images: as specified above.
- Utils Icons: as specified above.
- Social Media Icons: [CC BY 4.0 licensed](https://creativecommons.org/licenses/by/4.0/) (as specified above).