from django.shortcuts import render
from django.contrib import admin
from .models import Post
from guardian.shortcuts import get_objects_for_user
from guardian.admin import GuardedModelAdmin
from guardian.managers import UserObjectPermissionManager

class UserMixinPermission(UserObjectPermissionManager):
    pass
class PostAdmin(GuardedModelAdmin, admin.ModelAdmin):
    list_per_page = 10
    search_fields = ["title"]
    actions = ["make_post_inactive"]

    # Restrict user from changing object-level allowed permissions
    def obj_perms_manage_user_view(self, request, object_pk, user_id):
        if not request.user.has_perm('guardian.change_userobjectpermission'):
            return render(request, 'blog/not_found.html')
        return super().obj_perms_manage_user_view(request, object_pk, user_id)
    
    def has_module_permission(self, request):
        if super().has_module_permission(request):
            return True
        return self.get_model_object(request).exists()
        

    def get_queryset(self, request):
        opts = self.opts
        if request.user.is_superuser:
            return super().get_queryset(request)
        return self.get_model_object(request)
       
    def get_model_object(self, request, actions=None, klass=None):
        opts = self.opts
        klass = klass if klass else opts.model
        actions = [actions] if actions else ['view', 'add', 'delete', 'change']
        model_name = klass._meta.model_name
        return get_objects_for_user(user=request.user,
                             perms=[f"{perm}_{model_name}" for perm in actions],
                             any_perm=True, klass=klass)

    def has_permission(self, request, obj, action):
        opts = self.opts
        perm=f"{opts.app_label}.{action}_{opts.model_name}"
        
        if obj:
            return request.user.has_perm(perm, obj)
        else:
            return True
        
    def has_view_permission(self, request, obj=None):
        return self.has_permission(request, obj, 'view')
    
    def has_change_permission(self, request, obj=None):
        return self.has_permission(request, obj, 'change')
    
    def has_delete_permission(self, request, obj=None):
        return self.has_permission(request, obj, 'delete')
    
    def has_add_permission(self, request, obj=None):
        return self.has_permission(request, obj, 'add')
    
    @admin.action(description="Set post inactive", permissions=["change"])
    def make_post_inactive(self, request, queryset):
        queryset.update(is_active=False)


admin.site.register(Post, PostAdmin)