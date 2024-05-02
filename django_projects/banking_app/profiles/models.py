from django.shortcuts import redirect, reverse
from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager

class User(AbstractUser):
    """Custom user """
    username = None
    type = models.CharField(max_length=250, default="CUSTOMER")
    telephone = models.CharField(max_length=13, verbose_name="Phone Number", unique=True, blank=False)
    password = models.CharField(max_length=250, null=True)
    
    USERNAME_FIELD = 'telephone'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self) -> str:
        return self.first_name + " " + self.last_name
    
    class Meta:
        permissions = [
            ("can_control_manager", "Can add, change or delete manager"),
            ("can_control_cashier", "Can add, change or delete"),
        ]

    


class CustomerProfile(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE)
    telephone = models.CharField(max_length=13, verbose_name="Phone Number", unique=True, blank=False)
    dob = models.DateField(null=False)
    province = models.CharField(max_length=250, null=False)
    district = models.CharField(max_length=250, null=False)
    sector = models.CharField(max_length=250, null=False)
    cell = models.CharField(max_length=250, null=False)
    image = models.ImageField(default='profile_pictures/Contact.png',
                              upload_to='profile_pictures')

    def __str__(self) -> str:
        return f"{self.customer.email}"

    def get_absolute_url(self):
        return redirect(reverse("profiles:create_user"))