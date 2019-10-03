
from django.urls import path, re_path

from survey.views import (
    SurveyViewSet,
    StatisticViewSet,
    VerifiedPasswordView,
    QuestionListView,
    GeneralView

)
from . import views
from rest_framework.routers import DefaultRouter

app_name = "survey"

router = DefaultRouter()
router.register(r'statistics', StatisticViewSet, base_name='Statistic')
router.register(r'', SurveyViewSet, base_name='survey')


urlpatterns = router.urls
urlpatterns += [
    path(r'getQuestions/<str:lang>/<str:sex>/', QuestionListView.as_view()),
    path(r'verify', VerifiedPasswordView.as_view()),
    path(r'like', GeneralView.as_view())
]

for url in router.urls:
    print(url, '\n')
