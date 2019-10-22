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
from .serializers import (
    ProfileSerializer,
    UserDetailsSerializer
)

from .models import Profile
import io
from rest_framework import authentication, permissions
from rest_framework.views import APIView

from rest_framework.generics import (
    ListAPIView,
    CreateAPIView, RetrieveUpdateAPIView,
    GenericAPIView
)
from django.contrib.auth.models import User, Permission
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


class CheckExistUserAPI(GenericAPIView):

    def post(self, request, *args, **kwargs):
        user = User.objects.filter(username__iexact=request.data['username'])
        if user:
            # In my experience we didnt need that contex variable at all.
            return Response({"msg": "USER_EXISTED"})
        else:
            return Response({"msg": "USER_NOT_EXISTED"})


class UserApiRequest(GenericAPIView):
    serializer_class = UserDetailsSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        has_perm = self.request.query_params.get("has_perm", False)
        if has_perm:
            return Response(self.request.user.has_perm(F'survey.{has_perm}'))
        return JsonResponse(
            {'status': 'false', 'message': 'bad request'}, status=400)

    def level_up(self, stage, user):
        if stage == "general":
            permissions = Permission.objects.get(
                codename="create_general_survey")
            user.user_permissions.add(permissions)
            return JsonResponse(
                {'status': 'true', 'message': 'permission has changed to general'}, status=201)
        elif stage == "marriage":
            permissions = Permission.objects.get(
                codename="create_marriage_survey")
            user.user_permissions.add(permissions)
            return JsonResponse(
                {'status': 'true', 'message': 'permission has changed to marriage'}, status=201)
        return JsonResponse(
            {'status': 'false', 'message': 'select appropriate permission'}, status=400)

    def level_down(self, stage, user):
        if stage == "general":
            permissions = Permission.objects.get(
                codename="create_general_survey")
            user.user_permissions.remove(permissions)
            return JsonResponse(
                {'status': 'true', 'message': 'permission has removed'}, status=201)
        elif stage == "marriage":
            permissions = Permission.objects.get(
                codename="create_marriage_survey")
            user.user_permissions.remove(permissions)
            return JsonResponse(
                {'status': 'true', 'message': 'permission has removed'}, status=201)

        return JsonResponse(
            {'status': 'false', 'message': 'select appropriate permission'}, status=400)

    def patch(self, request, *args, **kwargs):
        data = request.data

        if 'levelUp' in data:
            return self.level_up(data["levelUp"], request.user)
        elif 'levelDown' in data:
            return self.level_down(data['levelDown'], request.user)

        return JsonResponse(
            {'status': 'false', 'message': 'bad request'}, status=400)


class UserDetailsView(RetrieveUpdateAPIView):
    """
    Reads and updates UserModel fields
    Accepts GET, PUT, PATCH methods.
    Default accepted fields: username, first_name, last_name
    Default display fields: pk, username, email, first_name, last_name
    Read-only fields: pk, email
    Returns UserModel fields.
    """
    serializer_class = UserDetailsSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        """
        Adding this method since it is sometimes called when using
        django-rest-swagger
        https://github.com/Tivix/django-rest-auth/issues/275
        """

        return get_user_model().objects.none()
