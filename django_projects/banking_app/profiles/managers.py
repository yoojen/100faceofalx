from django.contrib.auth.base_user import BaseUserManager
from django.db.models.query import QuerySet


class CustomUserManager(BaseUserManager):

    def create_user(self, email, password, **extra_fields):
        """
        Create and save new user with given attributes
        """

        if not email:
            raise ValueError("Please provide email")
        if not password:
            raise ValueError("Provide password")
        extra_fields.setdefault("is_active", True)
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.type="CUSTOMER"
        user.save(using=self.db)

        return user

    def create_superuser(self, email=None, password=None, **extra_fields):
        """
        Create super user with is_superuser and is_staff enabled
        """

        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)

        if not extra_fields.get("is_superuser"):
            raise ValueError("is_superuser has to be to true")
        if not extra_fields.get("is_staff"):
            raise ValueError("is_staff has to be set to true")
        user = self.create_user(email, password, **extra_fields)
        user.type = 'ADMIN'
        user.save(using=self.db)
        return user
