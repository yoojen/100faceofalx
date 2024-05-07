from typing import Any
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from profiles.models import Profile, User
from django import forms


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        exclude = []


class UserCreationModelForm(forms.ModelForm):
    first_name = forms.CharField(required=True, disabled=True)
    last_name = forms.CharField(required=True, disabled=True)
    telephone = forms.CharField(max_length=13, disabled=True)
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