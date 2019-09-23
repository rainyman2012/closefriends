
from django.urls import path, re_path
from survey.views import (
    SurveyViewSet,
    StatisticViewSet
)
from . import views
from rest_framework.routers import DefaultRouter

app_name = "survey"

router = DefaultRouter()
router.register(r'statistics', StatisticViewSet, base_name='Statistic')
router.register(r'', SurveyViewSet, base_name='survey')


urlpatterns = router.urls

for url in router.urls:
    print(url, '\n')
