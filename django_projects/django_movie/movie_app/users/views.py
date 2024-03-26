from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.generic import CreateView
from.forms import ProfileUpdateForm, UserUpdateForm, UserRegistrationForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required


@login_required
def profile(request):
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileUpdateForm(
            request.POST, request.FILES, instance=request.user.profile)
        if u_form.is_valid() and  p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, f"Your account has been updated!")
            return redirect('profile')
    else:
        p_form = ProfileUpdateForm()
        u_form = UserUpdateForm(instance=request.user)
    context = {
        'u_form': u_form,
        'p_form': p_form
    }
    return render(request, 'users/profile.html', context)

def register(request):
    if request.method=='POST':
        user_form = UserRegistrationForm(request.POST)
        print(user_form)
        if user_form.is_valid():
            user_form.save()
            messages.success(request, 'registered successfully')
            redirect('movie-home')
    form = UserRegistrationForm()
    return render(request, 'users/register.html', {'form': form})
# class ProfileView(ListView):
#     model = Profile
#     context_object_name='person'
#     form = ProfileUpdateForm()