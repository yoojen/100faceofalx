from django.db.models  import Q
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Transactions, Account
from django.views.generic import ListView, CreateView
from banking_app.serializer import Serializer
from profiles.models import CustomerProfile

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
                    messages.success(self.request, self.success_message, f"Balance: {self.object.account.balance}")
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request, "Can't process the request", str(e))
            return super().form_invalid(form)
        


def find_account(request):
    account = Account.objects.filter(
        account_num=request.GET.get("account_num")).first()
    if account:
        messages.success(request, "Account number found", Serializer.dumps(account))
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
        list_data = Transactions.objects.filter(account_num=detail_object.account_num).all()
        print(list_data)

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
    model=Account
    fields = ["customer_phone_number", "account_num", "balance"]

    def form_valid(self, form):
        customer = CustomerProfile.objects.filter(telephone=form.cleaned_data["customer_phone_number"]).first()
        print(form.cleaned_data['customer_phone_number'], customer)
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