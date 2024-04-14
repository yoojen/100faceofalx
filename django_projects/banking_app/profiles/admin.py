from django.contrib import admin
from .models import CustomerProfile, User
from django.contrib.auth.admin import UserAdmin

admin.site.register(CustomerProfile)
admin.site.register(User)