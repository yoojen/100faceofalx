# create transaction when user is created with balance account
from django.db.models.signals import post_save
from .models import Transactions, Account
from django.dispatch import receiver


@receiver(post_save, sender=Account)
def create_transaction(sender, instance, created, **kwargs):
    if created:
        Transactions.objects.create(account=instance, account_num=instance.account_num,
                                    description="Opening amount", amount=instance.balance, type="Deposit")
