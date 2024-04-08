from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Book, Author
from django.contrib.auth.models import User


class BookInline(admin.TabularInline):
    model = Book
    can_delete = True
    verbose_name_plural = 'author'


class BookAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['title']}),
        ("Advanced Options", {
            "classes": ["collapse"],
            "fields": ["author"]
        })
    ]


class AuthorAdmin(admin.ModelAdmin):
    inlines = [BookInline]


admin.site.register(Book, BookAdmin)
admin.site.register(Author, AuthorAdmin)
