from django.db import models
from django.contrib.auth.models import User
from datetime import date, timedelta

class Account(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(default=0.00)
    date_opened = models.DateField(auto_now=True)

class Transactions(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField()
    date_done = models.DateField(auto_now=True)
    description = models.CharField(max_length=250, null=True)

class Card(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE)
    card_type = models.CharField(max_length=250)
    card_number = models.CharField(max_length=250)
    expiration_date = models.DateField(default=date.today() + timedelta(365))
    is_active = models.BooleanField(default=True)
    issue_date = models.DateField(auto_now=True)

class BillsInfo(models.Models):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    payee_name = models.CharField(max_length=250)
    payee_account = models.ForeignKey(Account, on_delete=models.SET_NULL)
    payment_date= models.DateField(auto_now=True)
    