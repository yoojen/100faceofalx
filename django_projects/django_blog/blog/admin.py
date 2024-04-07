from django.contrib import admin
from .models import Post

class CustomPostMixin:


    # def has_module_permission(self, request):
    #     if super().has_module_permission(request):
    #         return True
    
    # def get_queryset(self, request):
    #     return super().get_queryset(request)
    
    # def has_permission(self, request):
    #     return super().has_module_permission(request)
    
    def has_view_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if request.user.has_perm("blog.view_post"):
            return True

    def has_add_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if request.user.has_perm("blog.add_post"):
            return True

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if request.user.has_perm("blog.change_post"):
            return True

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if request.user.has_perm("blog.delete_post"):
            return True


class PostAdmin(CustomPostMixin, admin.ModelAdmin):
    list_per_page = 10
    search_fields = ['title']
    actions = ['make_post_inactive']

    # def get_form(self, request, obj, **kwargs):
    #     form = super().get_form(request, obj, **kwargs)
    #     super_user = request.user.is_superuser
    #     if not super_user:
    #         form.base_fields['author'].disabled = True
    #     return form

    @admin.action(description="Set post inactive", permissions=['change'])
    def make_post_inactive(self, request, queryset):
        queryset.update(is_active=False)


admin.site.register(Post, PostAdmin)
