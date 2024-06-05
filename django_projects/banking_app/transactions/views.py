from django.db.models import Q
from django.forms import BaseModelForm
from django.http.response import HttpResponse as HttpResponse
from django.urls import reverse
from profiles.forms import CustomUserUpdateForm
from .forms import AccountCreationForm, BillForm
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Transactions, Account, BillInfo
from django.views.generic import ListView, CreateView, DetailView
from banking_app.serializer import Serializer
from profiles.models import Profile, User
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib.auth.views import redirect_to_login
from django.contrib.auth.decorators import login_required, permission_required
from profiles.helpers import check_permission, TestUserMixin

class UserAccessMixin(PermissionRequiredMixin):
    """Check user and make redirection accordingly"""
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect_to_login(next=request.get_full_path(), 
                                     login_url=self.get_login_url(),
                                     redirect_field_name=self.get_redirect_field_name())
        if not self.has_permission():
            if request.user.type == "TELLER":
                return render(request, "transactions/404_error_teller.html")
            if request.user.type == "CUSTOMER":
                return render(request, "transactions/404_error_customer.html")
        
        return super(UserAccessMixin, self).dispatch(request, *args, **kwargs)

    
class TransactionPostView(UserAccessMixin, CreateView):
    model = Transactions
    permission_required = ["transactions.add_transactions"]
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
                    raise ValueError(f"Insufficient funds {account.balance} only left")
                else:
                    account.balance = account.balance - amount
                    account.save()
                    messages.success(
                        self.request, self.success_message, f"Balance: {self.object.account.balance}")
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request, str(e))
            return super().form_invalid(form)

@login_required
def find_account(request):
    account = Account.objects.filter(
        account_num=request.GET.get("account_num")).first()
    if account:
        messages.success(request, "Account number found",
                         Serializer.dumps(account))
        return redirect("transactions:transact")
    messages.error(request, "Nothing found")
    return redirect("transactions:transact")


class AccountListView(UserAccessMixin, ListView):
    model = Account
    permission_required = ["transactions.view_account"]
    template_name = "transactions/acc_inspection.html"
    context_object_name = "accounts"

    def get_queryset(self):
        queryset = super().get_queryset()
        search_account = self.request.GET.get('account_num')
        if search_account:
            return queryset.filter(account_num=search_account).all()
        return queryset


def generate_account_number(request):
    from datetime import datetime
    today = str(datetime.now()).replace(":", "")
    today = today.replace("-", "")
    today = today.replace(".", "")
    today = today.replace(" ", "")
    today = today[:13]
    messages.success(request, "Account number generated", today)
    return redirect("transactions:create_account")


class CreateAccountView(UserAccessMixin, CreateView):
    model = Account
    permission_required = [
        "transactions.add_account", "transactions.view_account"]
    form_class = AccountCreationForm

    def form_valid(self, form):
        try:
            self.object = form.save(commit=False)
            customer = User.objects.filter(
                telephone=form.cleaned_data["phone_number"]).first()
            if customer is None:
                raise ValueError(
                    "Customer with this phone number does not exist.")
            self.object.customer_id = customer.id

            self.object.save()
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request, str(e))
            return super().form_invalid(form)
            

class TransactionListView(UserAccessMixin, ListView):
    model = Transactions
    permission_required = ["transactions.view_transactions"]
    context_object_name = "object"

    def get_queryset(self):
        queryset = super().get_queryset()
        search_account = self.request.GET.get('account_num')
        if search_account:
            return queryset.filter(account_num=search_account).all()
        return queryset

    
class BillCreateView(UserAccessMixin, CreateView):
    model = BillInfo
    form_class = BillForm
    permission_required = ["transactions.add_billinfo"]

    def form_valid(self, form):
        payer = self.request.user.account
        payee = Account.objects.filter(
            account_num=form.cleaned_data["payee_acc"]).first()
        
        if payer == payee:
            messages.error(self.request, "You can't send to same account")
            return super().form_invalid(form)
        if not payer or not payee:
            messages.error(self.request, "Please provide correct information")
            return super().form_invalid(form)

        if form.is_valid():
            self.object = form.save(commit=False)
            self.object.customer_id = self.request.user.id
            self.object.payee_account_id = payee.id
            # Making Transactions and Account instances
            if form.cleaned_data['amount'] < 50:
                messages.error(self.request, "Too few to make pay bill")
                return super().form_invalid(form)
            if payer.balance >= form.cleaned_data["amount"]:
                payer.balance -= form.cleaned_data["amount"]
                payee.balance += form.cleaned_data["amount"]
                payee.save()
                payer.save()
                messages.success(self.request, "Thanks for working with us!")
                return super().form_valid(form)
            messages.error(
                self.request, f"Not enough You've {payer.balance} on your account.")
            return super().form_invalid(form)
        else:
            return super().form_invalid(form)


class UserTransactionsListView(TestUserMixin, ListView):
    model = Transactions
    template_name = "transactions/user_transactions.html"
    context_object_name = "objects"
    ordering = "-date_done"

    def get_queryset(self):
        # account yet to be created
        try:
            queryset = super().get_queryset().filter(
                account_id=self.request.user.account.id)
        except Exception as e:
            return []
        return queryset



class AccountDetailView(UserAccessMixin, DetailView):
    model = Account
    permission_required = ["transactions.view_transactions"]
    template_name = "profiles/user_detail.html"


class CustomerTransactionListView(ListView):
    model = Transactions
    template_name = "profiles/user_detail.html"


@check_permission(["transactions.view_account"])
@login_required
def my_combined_view(request, pk=None):
    try:
        customer = User.objects.get(pk=pk)
        account = customer.account
        if account:
            context = {
                "customer": customer,
                'account': account if account else None,  # For DetailView
                'list_data': account.transactions.all(),          # For ListView
            }
            return render(request, 'transactions/account_detail.html', context)
        else:
            messages.error(request, "No account yet created")
            return render(request, 'transactions/account_detail.html', {})
    except Exception as e:
        print(str(e))
        messages.error(request, str(e))
        return render(request, 'transactions/account_detail.html', {})



@login_required
def customer_profile_view(request, pk):
    profile_form = CustomUserUpdateForm
    try:
        _ = request.user.profile
    except Exception:
        messages.error(request, "No profile for this user")
        return redirect(reverse("profiles:login"))
    
    if request.method == 'POST':
        profile_form = CustomUserUpdateForm(
            request.POST, request.FILES, instance=request.user.profile)
        if profile_form.is_valid():
            profile_form.save()
            return redirect(reverse("transactions:user_profile", kwargs={"pk": request.user.id}))
    else:
        profile_form = CustomUserUpdateForm(instance=request.user.profile)
        if request.user.type == 'CUSTOMER':
            return render(request, 'transactions/user_detail.html', {"profile_form":  profile_form})
        return render(request, 'transactions/teller_details.html', {"profile_form":  profile_form})



