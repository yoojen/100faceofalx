from typing import Any
from django.shortcuts import render, redirect
from django.contrib import messages
from django.urls import reverse
from .models import Transactions, Account
from django.views.generic import ListView, CreateView, DetailView


class TransactionPostView(CreateView):
    model = Transactions
    fields = "__all__"
    template_name = "transactions/deposit.html"
    context_object_name = "account"
    success_message = 'Transaction Recorded Created Successfully'

    def form_valid(self, form):
        account = Account.objects.filter(
            account_num=form.cleaned_data["account"]).first()
        amount = form.cleaned_data["amount"]
        type = form.cleaned_data["type"]
        try:
            if type == "Deposit":
                account.balance += amount
                account.save()
            else:
                if account.balance < amount:
                    raise ValueError("Can process that")
                account.balance -= float(amount)
            messages.success(self.request, self.success_message)
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request, "Can't process the request")
            return super().form_invalid(form)


def find_account(request):
    account = Account.objects.filter(
        account_num=request.GET.get("account_num")).first()
    if account:
        messages.success(request, "Account number found", account)
        return redirect("deposit")
    messages.error(request, "Nothing found")
    return redirect("deposit")
