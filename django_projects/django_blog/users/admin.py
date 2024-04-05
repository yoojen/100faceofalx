from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    verbose_name_plural = "user profile"
    can_delete = False


class UserAdmin(BaseUserAdmin):
    """Display user profile on the user in the admin page"""
    inlines = [ProfileInline]


@admin.action(description="Set image from admin page")
def update_image(modeladmin, request, queryset):
    queryset.update(image="profile_pics/IMG_20201126_083637_9.jpg")


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'image']
    search_fields = ['user__exact']
    list_per_page = 10
    actions = [update_image]


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
