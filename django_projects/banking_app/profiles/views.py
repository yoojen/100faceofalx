from django.contrib.auth.hashers import make_password
from django.contrib.auth.views import LoginView
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.contrib import messages
from django.shortcuts import render, redirect
from banking_app.serializer import Serializer
from .models import User, Profile
from django.views.generic import CreateView, ListView, DetailView
from .forms import CustomUserUpdateForm, UserCreationModelForm, UserAuthenticationForm


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
    model = Profile
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


def customer_profile_view(request):
    profile_form = CustomUserUpdateForm
    user_info = UserCreationModelForm
    if request.method == 'POST':
        profile_form = CustomUserUpdateForm(request.POST, request.FILES, instance=request.user.profile)
        if profile_form.is_valid():
            profile_form.save()
            return redirect(reverse("transactions:user_profile", kwargs={'pk': request.user.id}))
    else:
        user_info = UserCreationModelForm(instance=request.user)
        profile_form = CustomUserUpdateForm(instance=request.user.profile)
    return render(request, 'transactions/user_detail.html', {'user_form': user_info,
                                                         "profile_form":  profile_form})


class CustomerDetailView(DetailView):
    model = User




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
    