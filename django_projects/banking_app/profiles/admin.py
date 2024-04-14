from django.contrib import admin
from .models import CustomerProfile, User


class CustomerProfileInline(admin.StackedInline):
    model = CustomerProfile
    can_delete = True
    verbose_name_plural = "customer profile"


class UserAdmin(admin.ModelAdmin):
    search_fields = ['email']
    list_per_page = 10


    inlines = [CustomerProfileInline]

   
    # @admin.action("Set user inactive")


admin.site.register(CustomerProfile)
admin.site.register(User, UserAdmin)