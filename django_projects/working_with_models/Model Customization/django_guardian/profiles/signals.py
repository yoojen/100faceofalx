from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from guardian.shortcuts import assign_perm
from django.conf import settings


@receiver(post_save, sender=User)
def user_post_save(sender, instance, created, **kwargs):
    """
    Create a Profile instance for all newly created User instances. We only
    run on user creation to avoid having to check for existence on each call
    to User.save.
    """
    if created and instance.username != settings.ANONYMOUS_USER_NAME:
        from profiles.models import Profile
        profile = Profile.objects.create(pk=instance.pk, user=instance)
        assign_perm("change_user", instance, instance)  # user him/herself
        assign_perm("change_profile", instance, profile)  # own profile
