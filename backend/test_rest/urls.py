# snippets/urls.py
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken import views as eee
from test_rest import views

urlpatterns = [
    path('', views.ExampleView.as_view()),
    path('api/', eee.obtain_auth_token)
    # path('snippets/<int:pk>/', views.SnippetDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
