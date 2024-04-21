from typing import Any
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Transactions, Account
from django.views.generic import ListView, CreateView, DetailView
from banking_app.serializer import Serializer

class TransactionPostView(CreateView):
    model = Transactions
    fields = ["account_num",  "amount", "description", "type"]
    template_name = "transactions/deposit.html"
    context_object_name = "account"
    success_message = 'Transaction Recorded Created Successfully'

    def form_valid(self, form):
        account = Account.objects.filter(
            account_num=form.cleaned_data["account_num"]).first()
        amount = form.cleaned_data["amount"]
        type = form.cleaned_data["type"]
        if not account:
            messages.error(self.request, "No account found")
            return super().form_invalid(form)
        try:
            if type == "Deposit":
                account.balance += amount
                account.save()
            else:
                if account.balance < amount:
                    raise ValueError("Low balance")
                else:
                    account.balance = account.balance - amount
                    account.save()
            messages.success(self.request, self.success_message)
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request, "Can't process the request")
            return super().form_invalid(form)
        


def find_account(request):
    account = Account.objects.filter(
        account_num=request.GET.get("account_num")).first()
    if account:
        acc_info = Serializer.dumps(account)
        messages.success(request, "Account number found", Serializer.dumps(account))
        return redirect("transactions:deposit")
    messages.error(request, "Nothing found")
    return redirect("transactions:deposit")
