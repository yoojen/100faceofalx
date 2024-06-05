from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from profiles.models import Profile, User
from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import gettext_lazy as _


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        exclude = []


class UserCreationModelForm(forms.ModelForm):
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    telephone = forms.CharField(max_length=13)
    class Meta:
        model = User
        fields = ("telephone", "first_name", "last_name")

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
        return user
    

class CustomUserCreationForm(UserCreationForm):    
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    
    class Meta:
        model = User
        fields = ("telephone", "first_name", "last_name", "password1", "password2")


class CustomUserUpdateForm(UserChangeForm):
    class Meta:
        model = Profile
        fields = ("image",)


class PasswordCreationForm(UserCreationForm):
    password1 = forms.PasswordInput()
    password2 = forms.PasswordInput()
    telephone = forms.CharField(max_length=13, label="Phone Number", required=True)
    
    class Meta:
        model = User
        fields = ("password1", "password2")


class UserAuthenticationForm(AuthenticationForm):
    error_messages = {
        "invalid_login": _("Incorrect username or password"),
        "inactive": _("This account is inactive")
    }


class ProfileCrationForm(forms.ModelForm):
    telephone = forms.CharField(required=True)
    class Meta:
        model = Profile
        fields = ["telephone", "dob","province", "district", "sector","cell","image"]