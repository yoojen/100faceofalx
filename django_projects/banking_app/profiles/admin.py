from django.shortcuts import redirect
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomerProfile
from .models import User
from guardian.admin import GuardedModelAdmin
from guardian.shortcuts import get_objects_for_user
from .forms import CustomUserChangeForm, CustomUserCreationForm


class CustomObjectAccessMixin(GuardedModelAdmin):
    def has_module_permission(self, request):
        if super().has_module_permission(request):
            return True
        return self.model_objects_for_user(request, actions=[
            "view", "change", "add", "delete"]
        ).exists()

    def model_objects_for_user(self, request, klass=None, actions: list = None):
        klass = self.opts.model if not klass else klass
        perms = [
            f"{self.opts.app_label}.{perm}_{self.opts.model_name}" for perm in actions]
        data = get_objects_for_user(
            user=request.user, perms=perms, klass=klass, any_perm=True)
        if klass is User and not request.user.is_superuser:
            return data.exclude(is_superuser=True)
        return data

    def has_permission(self, request, obj=None, action=None):
        opts = self.opts
        model_name = opts.model_name
        app_lebel = opts.app_label
        if obj:
            return request.user.has_perm(f"{app_lebel}.{action}_{model_name}", obj)
        return request.user.has_perm(f"{app_lebel}.{action}_{model_name}")

    def get_queryset(self, request, ):
        if request.user.is_superuser:
            return super().get_queryset(request)
        data = self.model_objects_for_user(
            request, actions=["view", "add", "change", "delete"])
        return data

    def has_view_permission(self, request, obj=None):
        return self.model_objects_for_user(request, actions=[
            "view", "change", "add", "delete"]
        ).exists()

    def has_add_permission(self, request):
        return self.has_permission(request, action="add")

    def has_change_permission(self, request, obj=None):
        if request.user.is_staff and obj != request.user:
            return self.has_permission(request, action="change")
        return self.has_permission(request, obj, action="change")

    def has_delete_permission(self, request, obj=None):
        return self.has_permission(request, obj, action="delete")


class CustomerProfileInline(admin.StackedInline):
    model = CustomerProfile
    can_delete = True
    verbose_name_plural = "customer profile"


@admin.register(User)
class UserAdmin(CustomObjectAccessMixin,  BaseUserAdmin):
    model = User
    add_form=CustomUserCreationForm
    form = CustomUserChangeForm
    list_display = ["email", "date_joined"]
    ordering=["email"]
    fieldsets=(
        (None, {"fields": ("email", "password")}),
        (("Personal info"), {"fields": ("first_name", "last_name")}),
        (
            ("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide"),
            "fields": (
                "email", "password1", "password2", "first_name", "last_name",
                "is_staff",  "is_active", "is_superuser", "groups", "user_permissions"
            )
        }),
    )

    def obj_perms_manage_user_view(self, request, object_pk, user_id):
        if not request.user.has_perm('guardian.change_userobjectpermission'):
            return redirect('admin/')
        return super().obj_perms_manage_user_view(request, object_pk, user_id)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if self.has_permission(request, obj, action="change") or self.has_permission(request, action="change") and\
                not request.user.is_superuser:
            form.base_fields["is_superuser"].disabled = True
            form.base_fields["is_staff"].disabled = True
            form.base_fields["groups"].disabled = True
            form.base_fields["user_permissions"].disabled = True
            return form
        return form



# admin.site.register(User)
admin.site.register(CustomerProfile)
