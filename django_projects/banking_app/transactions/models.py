from django.db import models
from django.urls import reverse
from profiles.models import User
from datetime import date, timedelta


class Account(models.Model):
    account_num = models.CharField(
        max_length=13, unique=True, blank=False, null=False)
    balance = models.DecimalField(
        default=0.00, decimal_places=2, max_digits=10)
    date_opened = models.DateField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.account_num}"
    
    class Meta:
        ordering=["-date_opened"]


class Transactions(models.Model):
    BOOLEAN_CHOICES = (
        ("Deposit", 'Deposit'),
        ("Withdraw", 'Withdraw'),
    )
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    account_num = models.PositiveIntegerField(null=True, blank=False)
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    date_done = models.DateField(auto_now=True)
    description = models.CharField(max_length=250, null=True)
    type = models.CharField(choices=BOOLEAN_CHOICES, max_length=250)

    def __str__(self) -> str:
        return f"{self.account.account_num} for {self.account.customer.email}"

    def get_absolute_url(self):
        return reverse("transactions:deposit")
    
    class Meta:
        ordering=['-date_done']



class Card(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE)
    card_type = models.CharField(max_length=250)
    card_number = models.CharField(max_length=250, unique=True)
    expiration_date = models.DateField(default=date.today() + timedelta(365))
    is_active = models.BooleanField(default=True)
    issue_date = models.DateField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.customer.email}"


class BillInfo(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    payee_name = models.CharField(max_length=250)
    payee_account = models.ForeignKey(
        Account, on_delete=models.SET_NULL, null=True)
    payment_date = models.DateField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.customer.email}"
