from django.db import models
from django.contrib.auth.models import AbstractUser 
from .managers import CustomUserManager


class User(AbstractUser):
    username=None
    email = models.EmailField(unique=True,blank=True, null=True)
    type = models.CharField(max_length=250, default="CUSTOMER")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = CustomUserManager()
    class Meta:
        permissions = [
            ("can_control_manager", "Can add, change or delete manager"),
            ("can_control_cashier", "Can add, change or delete"),
        ]

class CustomerProfile(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE)
    dob = models.DateField(null=False)
    tel = models.CharField(max_length=250, null=False)
    province=models.CharField(max_length=250, null=False)
    district=models.CharField(max_length=250, null=False)
    sector=models.CharField(max_length=250, null=False)
    cell=models.CharField(max_length=250, null=False)
    image = models.ImageField(default='Contact.png', upload_to='../media/profile_pictures')
