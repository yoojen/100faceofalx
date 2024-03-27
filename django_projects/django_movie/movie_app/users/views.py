from django.shortcuts import render, redirect
from django.contrib import messages
from.forms import ProfileUpdateForm, UserUpdateForm, UserRegistrationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth.views import PasswordResetView, LoginView
class CustomPasswordResetView(UserPassesTestMixin, PasswordResetView):
   
    def test_func(self) -> bool | None:
        if self.request.user.is_authenticated:
            return False
        return True
    

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
            redirect('login')
    form = UserRegistrationForm()
    return render(request, 'users/register.html', {'form': form})


class CustomUserLoginView(LoginView):
    redirect_authenticated_user = True
