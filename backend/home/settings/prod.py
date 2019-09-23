'''Use this for production'''

from .base import *

DEBUG = True
ALLOWED_HOSTS += ['*']
WSGI_APPLICATION = 'home.wsgi.prod.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'df53u6igr6hok7',
        'USER': 'mxczqrbjxaxbje',
        'PASSWORD': '0399a3439d49ac3d3b7c164fffd3126a57dcf392e5e7870459b5dada514eb9bc',
        'HOST': 'ec2-46-51-190-87.eu-west-1.compute.amazonaws.com',
        'PORT': '5432',
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
