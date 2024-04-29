from django.contrib import messages
from django.shortcuts import render, redirect
from .models import User, CustomerProfile
from django.views.generic import CreateView
from .forms import CustomUserCreationForm


class CreateUserView(CreateView):
    model = User
    form_class = CustomUserCreationForm
    success_url = "create_user"
    
    def form_valid(self, form):
        super().form_valid(form)   

        if form.is_valid():
            messages.success(self.request, "Customer created successfully",
                             f"User created with this email: {form.cleaned_data['email']}")
            return redirect("profiles:create_user")
        else:
            messages.error(request=self.request, message="Customer is not created")
            return super().form_invalid(form)
        

class CreateUserProfileView(CreateView):
    model = CustomerProfile
    fields = "__all__"
    success_url = "create_user_profile"
    
    def form_valid(self, form):
        super().form_valid(form)   

        if form.is_valid():
            messages.success(request=self.request, message="Customer profile created successfully")
            return redirect("profiles:create_user_profile")
        else:
            messages.error(request=self.request, message="Customer profile is not created")
            return super().form_invalid(form)

def profiles(request):
    return render(request, template_name="profiles/base.html")
