from django.contrib import admin
from .models import Post


class PostAdmin(admin.ModelAdmin):
    list_per_page = 10
    search_fields = ['title']
    actions = ['make_post_inactive']

    @admin.action(description="Set post inactive", permissions=['change'])
    def make_post_inactive(self, request, queryset):
        queryset.update(is_active=False)


admin.site.register(Post, PostAdmin)
