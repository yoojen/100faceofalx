from django.shortcuts import render
from django.db.models  import Q
from django.db.models.query import QuerySet
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Transactions, Account
from django.views.generic import ListView, CreateView, DetailView
from banking_app.serializer import Serializer

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
            else:
                if account.balance < amount:
                    raise ValueError("Insufficient funds")
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
        messages.success(request, "Account number found", Serializer.dumps(account))
        return redirect("transactions:transact")
    messages.error(request, "Nothing found")
    return redirect("transactions:transact")



class AccountListView(ListView):
    model = Account
    template_name = "transactions/acc_inspection.html"
    context_object_name = "accounts"

    def get_queryset(self):
        # Get search term from query string
        search_term = self.request.GET.get('q', '')
        # Replace with your search fields
        search_fields = ['name', 'description']

        if search_term:
            queryset = django_admin_like_search(
                self.model, search_term, search_fields)
        else:
            queryset = super().get_queryset()  # Use default queryset if no search term

        return queryset


class AccountDetailView(DetailView):
    model = Account
    context_object_name = "account"
    template_name = "transactions/account_detail.html"


class CustomerTransactionListView(ListView):
    model = Transactions
    template_name = "transactions/account_detail.html"


def my_combined_view(request, pk=None):
    detail_object = Account.objects.filter(id=pk).first()

    list_data = Transactions.objects.filter(account_num=detail_object.account_num).all()

    context = {
        'detail_object': detail_object,  # For DetailView
        'list_data': list_data,          # For ListView
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


class CreateAccountView(CreateView):
    model=Account
    fields = "__all__"
