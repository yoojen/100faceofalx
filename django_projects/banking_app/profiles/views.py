from django.contrib import messages
from django.shortcuts import render
from .models import User
from django.views.generic import CreateView
from .forms import CustomUserCreationForm


class CreateUserView(CreateView):
    model = User
    form_class = CustomUserCreationForm
    success_url = "create_account"
    
    def form_valid(self, form):
        super().form_valid(form)   

        if form.is_valid():
            messages.success(request=self.request, message="Customer created successfully")
        messages.error(request=self.request, message="Customer is not created")
        return super().form_invalid()

def profiles(request):
    return render(request, template_name="profiles/base.html")
