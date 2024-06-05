# create transaction when user is created with balance account
from django.db.models.signals import post_save
from .models import Transactions, Account, BillInfo
from django.dispatch import receiver
from .utils import get_current_request

@receiver(post_save, sender=Account)
def create_transaction(sender, instance, created, **kwargs):
    if created:
        Transactions.objects.create(account=instance, account_num=instance.account_num,
                                    description="Opening amount", amount=instance.balance, type="Deposit")


@receiver(post_save, sender=BillInfo)
def create_transaction_after_bill(sender, instance, created, **kwargs):
    request = get_current_request()
    if created:
        payer = request.user.account
        payee = Account.objects.filter(
            account_num=instance.payee_account).first()
        if payer and payee:
            data = [
                {
                    "account": payer,
                    "account_num": payer.account_num,
                    "amount": instance.amount,
                    "description": f"Paid Bill to {payee.customer}",
                    "type": "Withdraw",
                },
                {
                    "account": payee,
                    "account_num": payee.account_num,
                    "amount": instance.amount,
                    "description": f"Received Payment from {payer.customer}",
                    "type": "Deposit",
                }
            ]
            print(data)
            for d in data:
                obj = Transactions.objects.create(**d)
        else:
            raise ValueError("Please enter correct information")