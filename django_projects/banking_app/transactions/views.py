from typing import Any
from django.db.models import Q
from django.db.models.query import QuerySet
from django.http import HttpRequest
from django.http.response import HttpResponse as HttpResponse, HttpResponseRedirect
from django.urls import reverse

from profiles.forms import CustomUserUpdateForm, UserCreationModelForm
from .forms import BillForm
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Transactions, Account, BillInfo
from django.views.generic import ListView, CreateView, DetailView
from banking_app.serializer import Serializer
from profiles.models import Profile, User
from django.contrib.auth.mixins import UserPassesTestMixin, PermissionRequiredMixin
from django.contrib.auth.views import redirect_to_login

# Mixin for restricting access
class TestCustomerViewsMixin(UserPassesTestMixin):
    def check_user(self):
        if self.request.user.type == "CUSTOMER":
            return True
        elif self.request.user.type == "MANAGER":
            return True
        else:
            return False
        
    def get_test_func(self):
        return self.check_user
    
class UserAccessMixin(PermissionRequiredMixin):
    """Check user and make redirection accordingly"""
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        print(request.user.get_user_permissions())
        if not request.user.is_authenticated:
            return redirect_to_login(next=request.get_full_path(), 
                                     login_url=self.get_login_url(),
                                     redirect_field_name=self.get_redirect_field_name())
        
        return super(UserAccessMixin, self).dispatch(request, *args, **kwargs)

    
class TransactionPostView(CreateView):
    model = Transactions
    fields = ["account_num", "amount", "description", "type"]
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
            self.object = form.save(commit=False)
            self.object.account_id = Serializer.dumps(account)["id"]
            if type == "Deposit":
                account.balance += amount
                account.save()
                messages.success(
                    self.request, self.success_message,  f"Balance: {self.object.account.balance}")
            else:
                if account.balance < amount:
                    raise ValueError("Insufficient funds")
                else:
                    account.balance = account.balance - amount
                    account.save()
                    messages.success(
                        self.request, self.success_message, f"Balance: {self.object.account.balance}")
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request, "Can't process the request", str(e))
            return super().form_invalid(form)


def find_account(request):
    account = Account.objects.filter(
        account_num=request.GET.get("account_num")).first()
    if account:
        messages.success(request, "Account number found",
                         Serializer.dumps(account))
        return redirect("transactions:transact")
    messages.error(request, "Nothing found")
    return redirect("transactions:transact")


class AccountListView(ListView):
    model = Account
    template_name = "transactions/acc_inspection.html"
    context_object_name = "accounts"

    def get_queryset(self):
        queryset = super().get_queryset()
        search_account = self.request.GET.get('account_num')
        if search_account:
            return queryset.filter(account_num=search_account).all()
        return queryset


def my_combined_view(request, pk=None):
    list_data = []
    detail_object = Account.objects.filter(id=pk).first()
    if detail_object:
        list_data = Transactions.objects.filter(
            account_num=detail_object.account_num).all()

    context = {
        'detail_object': detail_object if detail_object else None,  # For DetailView
        'list_data': list_data if list_data else None,          # For ListView
    }
    return render(request, 'transactions/account_detail.html', context)


def django_admin_like_search(model, search_term, search_fields):
    all_queries = None

    # Split the search term into keywords for individual filtering
    for keyword in search_term.split():
        keyword_query = None

    # Iterate through each search field
    for field in search_fields:
        # Construct a Q object for case-insensitive search using icontains
        each_query = Q(**{field + '__icontains': keyword})

    # Combine queries using OR (any keyword match)
    if not keyword_query:
        keyword_query = each_query
    else:
        keyword_query |= each_query

    # Combine all keyword queries using AND (all keywords must match)
    if not all_queries:
        all_queries = keyword_query
    else:
        all_queries &= keyword_query

    # Apply the combined filters to the model queryset
    return model.objects.filter(all_queries).distinct()


def generate_account_number(request):
    from datetime import datetime
    today = str(datetime.now()).replace(":", "")
    today = today.replace("-", "")
    today = today.replace(".", "")
    today = today.replace(" ", "")
    today = today[:13]
    messages.success(request, "Account number generated", today)
    return redirect("transactions:create_account")


class CreateAccountView(CreateView):
    model = Account
    fields = ["customer_phone_number", "account_num", "balance"]

    def form_valid(self, form):
        customer = Profile.objects.filter(
            telephone=form.cleaned_data["customer_phone_number"]).first()
        if customer:
            customer = customer.customer
        try:
            self.object = form.save(commit=False)
            self.object.customer_id = Serializer.dumps(customer)["id"]
            messages.success(self.request,
                             "Account created successfully",
                             f"Account created with this account number: {form.cleaned_data['account_num'] }")
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request,
                           "Account Not Created",
                           f"No user found with this Phone Number: {form.cleaned_data['customer_phone_number'] }")
            return super().form_invalid(form)


class TransactionListView(ListView):
    model = Transactions
    context_object_name = "object"

    def get_queryset(self):
        queryset = super().get_queryset()
        search_account = self.request.GET.get('account_num')
        if search_account:
            return queryset.filter(account_num=search_account).all()
        return queryset

    
class BillCreateView(CreateView):
    model = BillInfo
    form_class = BillForm
    permission_required = ["transactions.add_billinfo"]

    def form_valid(self, form):
        payer = Account.objects.filter(
            customer_phone_number=self.request.user.telephone).first()
        payee = Account.objects.filter(
            account_num=form.cleaned_data["payee_acc"]).first()
        if not payer or not payee:
            return super().form_invalid(form)
        data = [
            {
                "account": payer,
                "account_num":payer.account_num,
                "amount": form.cleaned_data["amount"],
                "description": f"Paid Bill to {payee.customer}",
                "type": "Withdraw",
            },
            {
                "account": payee,
                "account_num": payee.account_num,
                "amount": form.cleaned_data["amount"],
                "description": f"Received Payment from {payer.customer}",
                "type": "Deposit",
            }
        ]

        if form.is_valid():
            self.object = form.save(commit=False)
            self.object.customer_id = self.request.user.id
            
            # Making Transactions and Account instances
            if payer.balance >= form.cleaned_data["amount"]:
                payer.balance -= form.cleaned_data["amount"]
                payee.balance += form.cleaned_data["amount"]
                payee.save()
                payer.save()
                for d in data:
                    Transactions.objects.create(**d)

                return super().form_valid(form)
            messages.error(
                self.request, "Not enough balance to make transactions", f"You've {payer.balance} on your account.")
            return super().form_invalid(form)
        else:
            return super().form_invalid(form)


class UserTransactionsListView(ListView):
    model = Transactions
    template_name = "transactions/user_transactions.html"
    context_object_name = "objects"
    ordering = "-date_done"

    def get_queryset(self):
        queryset = super().get_queryset().filter(
            account_id=self.request.user.account.id)
        return queryset


class UserAccountDetailView(DetailView):
    model = Account
    template_name = "transactions/user_account_info.html"
    context_object_name = "object"



class AccountDetailView(DetailView):
    model = Account
    template_name = "profiles/user_detail.html"


class CustomerTransactionListView(ListView):
    model = Transactions
    template_name = "profiles/user_detail.html"


def my_combined_view(request, pk=None):
    list_data = []
    customer = User.objects.filter(pk=pk).first()
    if customer:
        account = Account.objects.filter(
            customer_phone_number=customer.telephone).first()
    else:
        return render(request, 'transactions/account_detail.html', {})
    if account:
        list_data = Transactions.objects.filter(
            account_num=account.account_num).all()
    else:
        return render(request, 'transactions/account_detail.html', {})

    context = {
        "customer": customer,
        'account': account if account else None,  # For DetailView
        'list_data': list_data if list_data else None,          # For ListView
    }
    return render(request, 'transactions/account_detail.html', context)


def customer_profile_view(request, pk):
    profile_form = CustomUserUpdateForm
    user_info = UserCreationModelForm
    for field in user_info.base_fields:
        user_info.base_fields[field].disabled = True
    if request.method == 'POST':
        profile_form = CustomUserUpdateForm(
            request.POST, request.FILES, instance=request.user.profile)
        if profile_form.is_valid():
            profile_form.save()
            return redirect(reverse("transactions:user_profile", kwargs={'pk': request.user.id}))
    else:
        user_info = UserCreationModelForm(instance=request.user)
        profile_form = CustomUserUpdateForm(instance=request.user.profile)
    return render(request, 'transactions/user_detail.html', {'user_form': user_info,
                                                             "profile_form":  profile_form})
