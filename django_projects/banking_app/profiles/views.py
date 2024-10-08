from typing import Any
from django.contrib.auth.hashers import make_password
from django.contrib.auth.views import LoginView
from django.http.response import HttpResponse as HttpResponse
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.contrib import messages
from django.shortcuts import render, redirect
from banking_app.serializer import Serializer
from transactions.models import Account
from transactions.views import UserAccessMixin
from .models import User, Profile
from django.views.generic import CreateView, ListView, DetailView
from .forms import (CustomUserUpdateForm, ProfileCrationForm,
                    UserCreationModelForm, 
                    UserAuthenticationForm,
                    PasswordCreationForm, LoginForm)
from .helpers import TestUserMixin, check_permission


@check_permission(perms=["profiles.add_user", "profiles.view_user"])
def register(request):
    try:
        if request.method == 'POST':
            form = UserCreationModelForm(request.POST)
            if form.is_valid():
                print(form.cleaned_data)
                user = form.save(commit=False)
                user.save()
                return redirect('profiles:customers')
        else:
            form = UserCreationModelForm()
        return render(request, 'profiles/user_form.html', {'form': form})
    except Exception as e:
        messages.error(request, str(e))
        return redirect("profiles:create_user")
        

def create_password(request):
    """Allow customer to create password"""
    form = PasswordCreationForm

    if request.user.is_authenticated:
        if request.user.type == "CUSTOMER":
            return redirect("transactions:pay_bills")
        elif request.user.type == "TELLER":
            return redirect("transactions:transact")
        else:
            return redirect("admin:index")
    
    if request.method == 'POST':
        form = PasswordCreationForm(request.POST)
        if form.is_valid():
            _ = form.save(commit=False)
            tel = form.cleaned_data.get("telephone")
            _user = User.objects.filter(telephone=tel).first()
            if _user:
                if _user.password:
                    messages.info(request, "Passwrd Already Set!")
                    return redirect("profiles:login")
                _user.password = make_password(request.POST['password1'])
                _user.save()
                messages.success(request, "Password Successfully Created")
                return redirect("profiles:login")
            messages.error(request, "No User Found")
            return redirect("profiles:create_password")
    return render(request, 'profiles/create_password.html', {'form': form})


class CreateUserProfileView(UserAccessMixin, CreateView):
    model = Profile
    form_class = ProfileCrationForm
    permission_required = ["profiles.add_user"]
    success_url = "create_user_profile"
    template_name = 'profiles/customerprofile_form.html'
    
    def form_valid(self, form):
        customer = User.objects.filter(
            telephone=form.cleaned_data["telephone"]).first()
        
        try:
            self.object = form.save(commit=False)
            self.object.customer_id = Serializer.dumps(customer)["id"]
            messages.success(request=self.request, message="Customer profile created successfully")
            super().form_valid(form)
            return redirect("profiles:create_user_profile")
        except Exception as e:
            print(str(e))
            messages.error(request=self.request, message="Customer profile is not created")
            return super().form_invalid(form)


class CustomerListView(UserAccessMixin, ListView):
    model = User
    context_object_name = "customers"
    permission_required = ["profiles.view_user"]


def customer_profile_view(request, pk):
    user_info = UserCreationModelForm

    try:
        if request.method == 'POST':
            profile_form = CustomUserUpdateForm(request.POST, request.FILES, instance=request.user.profile)
            if profile_form.is_valid():
                profile_form.save()
                return redirect(reverse("profiles:user_profile", kwargs={"pk": request.user.id}))
        else:
            profile_form = CustomUserUpdateForm(instance=request.user.profile)
            return render(request, 'transactions/user_detail.html', {'user_form': user_info,
                                                            "profile_form":  profile_form})
    except Exception as e:
        print(e)
        return render(request, "transactions/404_error_customer.html")

class CustomerDetailView(DetailView):
    model = User


class UserAccountDetailView(TestUserMixin, DetailView):
    model = Account
    template_name = "transactions/user_account_info.html"
    context_object_name = "object"


from django.contrib.auth import authenticate, login

def login_view(request):
    form = LoginForm()
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            telephone = form.cleaned_data["telephone"]
            password = form.cleaned_data["password"]
            user_from_db = User.objects.filter(telephone=telephone).first()
            if not user_from_db.password:
                messages.info(request, "Please create password first")
                return redirect("profiles:create_password")
            user = authenticate(request, username=telephone, password=password)
            if not user:
                messages.error(request=request, message="Incorrect credentials, try again! Or set password if you're new o system")
                return redirect("profiles:login")
            login(request, user)
            if request.user.type == "ADMIN":
                return redirect("admin:index")
            elif request.user.type == "CUSTOMER":
                return redirect("transactions:pay_bills")
            else:
                return redirect("transactions:transact")

    return render(request=request, template_name="profiles/login.html", context={'form': form})