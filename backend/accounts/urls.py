from django.urls import path, include, reverse
from django.conf.urls import url
from .views import (
    ProfileView,
    CheckExistUserAPI,
    UserDetailsView,
    UserApiRequest
)

app_name = 'api'

urlpatterns = [
    url(r'profile/', ProfileView.as_view(), name="profile"),
    url(r'user/request/', UserApiRequest.as_view()),
    url(r'user/', UserDetailsView.as_view()),
    url(r'checkExistUser', CheckExistUserAPI.as_view()),


]
