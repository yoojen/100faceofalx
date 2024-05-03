from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.hashers import make_password
from django.contrib.auth.views import LoginView
from django.utils.translation import gettext_lazy as _
from django.contrib import messages
from django.shortcuts import render, redirect
from banking_app.serializer import Serializer
from transactions.models import Account, Transactions
from .models import User, CustomerProfile
from django.views.generic import CreateView, ListView, DetailView
from .forms import UserCreationModelForm


def register(request):
    if request.method == 'POST':
        form = UserCreationModelForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
        #   user.password = make_password(request.POST['password'])
            user.save()
            return redirect('profiles:customers')
    else:
        form = UserCreationModelForm()
    return render(request, 'profiles/user_form.html', {'form': form})
        

class CreateUserProfileView(CreateView):
    model = CustomerProfile
    fields = ["telephone","dob","province", "district", "sector","cell","image"]
    success_url = "create_user_profile"
    
    def form_valid(self, form):
        customer = User.objects.filter(
            telephone=form.cleaned_data["telephone"]).first()
        
        try:
            self.object = form.save(commit=False)
            self.object.customer_id = Serializer.dumps(customer)["id"]
            messages.success(request=self.request, message="Customer profile created successfully")
            super().form_valid(form)
            return redirect("profiles:create_user_profile")
        except Exception:
            messages.error(request=self.request, message="Customer profile is not created")
            return super().form_invalid(form)


class CustomerListView(ListView):
    model = User
    context_object_name = "customers"


class CustomerDetailView(DetailView):
    model = User


class AccountDetailView(DetailView):
    model = Account
    template_name = "profiles/user_detail.html"


class CustomerTransactionListView(ListView):
    model = Transactions
    template_name = "profiles/user_detail.html"


def my_combined_view(request, pk=None):
    list_data = []
    customer = User.objects.filter(pk=pk).first()
    account = Account.objects.filter(customer_phone_number=customer.telephone).first()
    if account:
        list_data = Transactions.objects.filter(
            account_num=account.account_num).all()

    context = {
        "customer": customer,
        'account': account if account else None,  # For DetailView
        'list_data': list_data if list_data else None,          # For ListView
    }
    return render(request, 'profiles/user_detail.html', context)

class UserAuthenticationForm(AuthenticationForm):
    error_messages={
        "invalid_login": _("Incorrect username or password"),
        "inactive": _("This account is inactive")
    }

class UserLoginView(LoginView):
    form_class = UserAuthenticationForm
    redirect_authenticated_user = True
    template_name = "profiles/login.html"
 
