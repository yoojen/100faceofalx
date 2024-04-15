from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.http import HttpRequest
from .models import CustomerProfile, User
from guardian.admin import GuardedModelAdmin


class CustomPermissionMixin(GuardedModelAdmin):

    def get_form(self, request, obj, change, **kwargs):
        form = super().get_form(request, obj, change, **kwargs)
        if not request.user.is_superuser:
            form.base_fields['is_superuser'].disabled = True
            form.base_fields['is_staff'].disabled = True
            return form

    def has_view_permission(self, request, obj=None) -> bool:
        return super().has_view_permission(request, obj)

    def has_add_permission(self, request) -> bool:
        return super().has_add_permission(request)

    def has_change_permission(self, request, obj=None) -> bool:
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None) -> bool:
        return super().has_delete_permission(request, obj)


class CustomerProfileInline(admin.StackedInline):
    model = CustomerProfile
    can_delete = True
    verbose_name_plural = "customer profile"


class CustomUserAdmin(UserAdmin, CustomPermissionMixin):
    model = User
    search_fields = ("email",)
    ordering = ("email",)
    list_per_page = 10

    list_display = ("email", "is_staff", "is_active", "is_superuser")
    list_filter = ("email", "is_staff", "is_active", "is_superuser")
    fieldsets = (
        (None, {"fields": ("email", "password", "type")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser",
                                    "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "type", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
         ),
    )
    inlines = [CustomerProfileInline]

    # @admin.action("Set user inactive")


admin.site.register(CustomerProfile)
admin.site.register(User, CustomUserAdmin)
