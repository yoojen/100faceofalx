from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomerProfile
from .models import User
from guardian.admin import GuardedModelAdmin
from guardian.shortcuts import get_objects_for_user


class CustomerProfileInline(admin.StackedInline):
    model = CustomerProfile
    can_delete = True
    verbose_name_plural = "customer profile"


@admin.register(User)
class UserAdmin(GuardedModelAdmin,  BaseUserAdmin):
    model = User
    add_fieldsets = (
        (None, {
            "classes": ("wide"),
            "fields": (
                "username", "email", "password1", "password2", "first_name", "last_name",
                "is_staff",  "is_active", "groups", "user_permissions"
            )
        }),
    )
    # Now what's remaining is to start using model level permission and object level
    # Permission so that user manager can view user queryset except admin
    # Build function that will check permission before he/she does any action

    def has_permission(self, request, obj=None, action=None):
        opts = self.opts
        model_name = opts.model_name
        app_lebel = opts.app_label

        if request.user.is_superuser:
            return True
        return request.user.has_perm(f"{app_lebel}.{action}_{model_name}", obj)

    # Change get_queryset it will show objects according to type of user
    def get_queryset(self, request):
        if request.user.is_superuser:
            return super().get_queryset(request)
        return User.objects.filter(username='jera').first()

    def has_module_permission(self, request):
        if super().has_module_permission(request):
            return True

    def has_view_permission(self, request, obj=None):
        return self.has_permission(request, obj, 'view')

    def has_add_permission(self, request):
        return super().has_add_permission(request)

    def has_change_permission(self, request, obj=None):
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return super().has_delete_permission(request, obj)


admin.site.register(CustomerProfile)
