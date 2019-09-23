from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import HttpResponse


def index(request):
    return HttpResponse("This is my app")


urlpatterns = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    # path('', index, name='index'),
    # path('api-auth/', include('rest_framework.urls')),
    # path('rest-auth/', include('rest_auth.urls')),
    # path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('admin/', admin.site.urls),
    path('survey/', include('survey.urls', namespace='survey')),
    path('test/', include('test_rest.urls')),  # new


    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),

]


print(static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))
