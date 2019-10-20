import os
from django.db.models import Q
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.db import models
import base64
from PIL import Image
from passlib.hash import pbkdf2_sha256


class Profile (models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    image = models.ImageField(upload_to='profile_pics', blank=True, null=True)
    gender = models.CharField(max_length=2, blank=True, null=True)
    lang = models.CharField(max_length=10, blank=True, null=True)
    age = models.PositiveIntegerField(default=10)

    def save(self, *args, **kwargs):
        # True if there is no primary key created.
        new_profile = self.pk is None
        super().save(*args, **kwargs)

        try:
            img = Image.open(self.image.path)
            if img.height > 300 or img.width > 300:
                output_size = (300, 300)
                img.thumbnail(output_size)
                img.save(self.image.path)
            else:
                pass
        except:
            if new_profile:
                if self.gender == "m":
                    self.generate_default_image(
                        f'{settings.MEDIA_ROOT}/profile_pics/male_default.png')
                elif self.gender == "f":
                    self.generate_default_image(
                        f'{settings.MEDIA_ROOT}/profile_pics/female_default.png')
                elif self.gender == "b":
                    self.generate_default_image(
                        f'{settings.MEDIA_ROOT}/profile_pics/bisexual_default.png')

    def generate_default_image(self, path):
        from pathlib import Path

        img = Image.open(path)
        dirname = os.path.dirname(path)
        filename = os.path.basename(path).split('.')[0]
        extension = os.path.basename(path).split('.')[1]

        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(f'{dirname}/{filename}_{self.user.username}.{extension}')
            self.image = f'profile_pics/{filename}_{self.user.username}.{extension}'
            self.save()

    def __str__(self):
        return f'{self.user.username} Profile'

    def delete(self, *args, **kwargs):

        self.image.delete()
        super().delete(*args, **kwargs)
