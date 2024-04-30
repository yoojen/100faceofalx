from django.contrib.auth.base_user import BaseUserManager
from django.db.models.query import QuerySet


class CustomUserManager(BaseUserManager):

    def create_user(self, telephone, password, **extra_fields):
        """
        Create and save new user with given attributes
        """

        if not telephone:
            raise ValueError("Please provide Phone number")
        if not password:
            raise ValueError("Provide password")
        extra_fields.setdefault("is_active", True)
        user = self.model(telephone=telephone, **extra_fields)
        user.set_password(password)
        user.type="CUSTOMER"
        user.save()

        return user

    def create_superuser(self, telephone=None, password=None, **extra_fields):
        """
        Create super user with is_superuser and is_staff enabled
        """

        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)

        if not extra_fields.get("is_superuser"):
            raise ValueError("is_superuser has to be to true")
        if not extra_fields.get("is_staff"):
            raise ValueError("is_staff has to be set to true")
        user = self.create_user(telephone, password, **extra_fields)
        user.type = 'ADMIN'
        user.save()
        return user
