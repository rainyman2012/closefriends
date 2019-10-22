from django.db.models.signals import post_save
from django.contrib.auth.models import User, Permission
from django.dispatch import receiver


@receiver(post_save, sender=User)
def add_permission(sender, instance, created, **kwargs):
    if created:
        perm_obj = Permission.objects.get(codename="create_general_survey")
        instance.user_permissions.add(perm_obj)
