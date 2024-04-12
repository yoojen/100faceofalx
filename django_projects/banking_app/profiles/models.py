from django.db import models
from django.contrib.auth.models import User


class CustomerProfile(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE)
    dob = models.DateField(null=False)
    tel = models.CharField(max_length=250, null=False)
    province=models.CharField(max_length=250, null=False)
    district=models.CharField(max_length=250, null=False)
    sector=models.CharField(max_length=250, null=False)
    cell=models.CharField(max_length=250, null=False)