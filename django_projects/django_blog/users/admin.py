from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.http import HttpRequest
from .models import Profile
from guardian.admin import GuardedModelAdmin

class ProfileInline(admin.TabularInline):
    model = Profile
    verbose_name_plural = "user profile"
    can_delete = False


class UserAdmin(BaseUserAdmin):
    """Display user profile on the user in the admin page"""
    inlines = [ProfileInline]


class ProfileAdmin(GuardedModelAdmin, admin.ModelAdmin):
    list_display = ['user', 'image']
    search_fields = ['user__exact']
    list_per_page = 10
    actions = ["update_image"]


    def has_view_permission(self, request, obj=None):
        return super().has_view_permission(request, obj)
    
    def has_change_permission(self, request, obj=None):
        return super().has_change_permission(request, obj)
    
    def has_add_permission(self, request):
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return super().has_delete_permission(request, obj)
    
    @admin.action(description="Set image from admin page", permissions=['change'])
    def update_image(self, request, queryset):
        queryset.update(image="profile_pics/IMG_20201126_083637_9.jpg")
        self.message_user(request, "Profile picture updated successfully")


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
