from typing import Any
from django.contrib.auth.hashers import make_password
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import permission_required
from django.http import HttpRequest
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
from .forms import (CustomUserUpdateForm,
                    UserCreationModelForm, 
                    UserAuthenticationForm,
                    PasswordCreationForm)
from .helpers import TestUserMixin, check_permission


@check_permission(perms=["profiles.add_user", "profiles.view_user"])
def register(request):
    if request.method == 'POST':
        form = UserCreationModelForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.save()
            return redirect('profiles:customers')
    else:
        form = UserCreationModelForm()
    return render(request, 'profiles/user_form.html', {'form': form})
        

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
    permission_required = ["profile.add_user"]
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


class CustomerListView(UserAccessMixin, ListView):
    model = User
    context_object_name = "customers"
    permission_required = ["profiles.view_user"]


def customer_profile_view(request, pk):
    profile_form = CustomUserUpdateForm
    user_info = UserCreationModelForm

    try:
        if request.method == 'POST':
            profile_form = CustomUserUpdateForm(request.POST, request.FILES, instance=request.user.profile)
            if profile_form.is_valid():
                profile_form.save()
                return redirect(reverse("profiles:user_profile", kwargs={"pk": request.user.id}))
        else:
            user_info = UserCreationModelForm(instance=request.user)
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


class UserLoginView(LoginView):
    form_class = UserAuthenticationForm
    redirect_authenticated_user = True
    template_name = "profiles/login.html"


    def form_valid(self, form):
        super().form_valid(form)
        
        if self.request.user.type == "ADMIN":
            return redirect("admin:index")
        elif self.request.user.type == "CUSTOMER":
            return redirect("transactions:pay_bills")
        else:
            return redirect("transactions:transact")
    