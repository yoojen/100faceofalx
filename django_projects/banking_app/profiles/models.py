from django.shortcuts import redirect, reverse
from django.db import models
from django.contrib.auth.models import AbstractUser
# from django.contrib.auth.models import User


class User(AbstractUser):
    """Custom user """
    pass
#     username = None
#     type = models.CharField(max_length=250, default="CUSTOMER")
#     email = models.EmailField(unique=True)
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = []

#     objects = CustomUserManager()

#     class Meta:
#         permissions = [
#             ("can_control_manager", "Can add, change or delete manager"),
#             ("can_control_cashier", "Can add, change or delete"),
#         ]


class CustomerProfile(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE)
    dob = models.DateField(null=False)
    tel = models.CharField(max_length=250, null=False)
    province = models.CharField(max_length=250, null=False)
    district = models.CharField(max_length=250, null=False)
    sector = models.CharField(max_length=250, null=False)
    cell = models.CharField(max_length=250, null=False)
    image = models.ImageField(default='Contact.png',
                              upload_to='../media/profile_pictures')

    def __str__(self) -> str:
        return f"{self.customer.email}"

    def get_absolute_url(self):
        return redirect(reverse("profiles:create_user"))