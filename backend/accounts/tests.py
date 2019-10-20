from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
import json
from pudb import set_trace
# from rest_framework import viewsets
from rest_framework.response import Response

from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)


from rest_framework import viewsets, mixins
from accounts.serializers import (
    ProfileSerializer,
    UserDetailsSerializer
)


from .models import Program
import io
from rest_framework import authentication, permissions
from rest_framework.views import APIView

from rest_framework.generics import (
    ListAPIView,
    CreateAPIView, RetrieveUpdateAPIView
)
from django.contrib.auth.models import User
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django.db.models import Q


class ProfileView(CreateAPIView, RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_object(self):
        return self.request.user.profile

    def get_queryset(self):
        return get_user_model().objects.none()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
