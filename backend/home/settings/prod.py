'''Use this for production'''

from .base import *

DEBUG = True
ALLOWED_HOSTS += ['*']
WSGI_APPLICATION = 'home.wsgi.prod.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'YOUR_NAME',
        'USER': 'YOUR_USER',
        'PASSWORD': 'YOUR_PASS',
        'HOST': 'HOST_ADDRESS',
        'PORT': 'PORT_NUMBER',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

CORS_ORIGIN_ALLOW_ALL = True
CROS_ALLOW_CREDENTIALS = True
