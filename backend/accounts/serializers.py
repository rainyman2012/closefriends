from django.db.models import Q
from pudb import set_trace
from rest_framework.utils import html, model_meta, representation
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from .models import Profile
from django.db.models import Count
from django.contrib.auth.models import User, Permission
from django.contrib.auth import get_user_model, authenticate
from django.core import exceptions

try:
    import json
except ImportError:
    from django.utils import simplejson as json

try:
    from django.forms.utils import ValidationError
except ImportError:
    from django.forms.util import ValidationError


UserModel = get_user_model()


class Base64ImageField(serializers.ImageField):
    """
    A Django REST framework field for handling image-uploads through raw post data.
    It uses base64 for encoding and decoding the contents of the file.
    Heavily based on
    https://github.com/tomchristie/django-rest-framework/pull/1268
    Updated for Django REST framework 3.
    """

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            # Generate file name:
            # 12 characters are more than enough.
            file_name = str(uuid.uuid4())[:12]
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension, )

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


class ProfileSerializer(serializers.ModelSerializer):
    image = Base64ImageField(
        max_length=None, use_url=True, required=False
    )

    class Meta:
        model = Profile
        fields = ('id', 'gender', 'age', 'lang', 'image')
        depth = 2  # we can set this to get all realation

    # Default `create` and `update` behavior...

    def update(self, instance, validated_data):

        # set_trace()  # This is put to debug.

        info = model_meta.get_field_info(instance)
        # set_trace()  # This is put to debug.
        # Simply set each attribute on the instance, and then save it.
        # Note that unlike `.create()` we don't need to treat many-to-many
        # relationships as being a special case. During updates we already
        # have an instance pk for the relationships to be associated with.
        for attr, value in validated_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                field = getattr(instance, attr)
                field.set(value)
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance

    def create(self, validated_data):
        ModelClass = self.Meta.model
        instance = ModelClass._default_manager.create(
            user=self.context['request'].user, **validated_data)

        return instance


class PermissionSerializer(serializers.ModelSerializer):
    """
    User model w/o password
    """
    class Meta:
        model = Permission
        fields = ('codename',)


class UserDetailsSerializer(serializers.ModelSerializer):
    """
    User model w/o password
    """
    profile = ProfileSerializer(required=False, many=False, read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = UserModel
        fields = ('pk', 'username', 'email',
                  'first_name', 'last_name', 'profile', 'permissions')

    def get_permissions(self, obj):
        if obj.is_superuser:
            return "All"
        return obj.user_permissions.all().values_list('codename', flat=True)
