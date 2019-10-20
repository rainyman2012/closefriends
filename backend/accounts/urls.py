from django.urls import path, include, reverse
from django.conf.urls import url
from .views import (
    ProfileView,
)

app_name = 'api'

urlpatterns = [
    url(r'profile/', ProfileView.as_view(), name="profile")
]
