from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile
from guardian.shortcuts import assign_perm


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def create_profile(sender, instance, **kwargs):
    instance.profile.save()
    assign_perm('auth.change_user', instance, instance)
    assign_perm('users.change_profile', instance, instance.profile)
