from typing import Any
from django.contrib.auth.views import LoginView, redirect_to_login
from django.views.generic import ListView, DetailView, DeleteView, UpdateView, CreateView
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.http import HttpRequest, HttpResponse
from .forms import UserRegistrationForm
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Book


class BookAuthMixin(PermissionRequiredMixin):
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        if not request.user.is_authenticated:
            return redirect_to_login(self.request.get_full_path(),
                                     self.get_login_url(),
                                     self.get_redirect_field_name())

        if not self.has_permission():
            return redirect('books-home')
        return super(BookAuthMixin, self).dispatch(request, *args, **kwargs)


class CustomLoginView(LoginView):
    redirect_authenticated_user = True
    template_name = 'books/login.html'


def register_user(request):
    if request.user.is_authenticated:
        return redirect('books-home')
    if request.method != 'POST':
        form = UserRegistrationForm()
    else:
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Account created successfully')
            return redirect('login')
    return render(request, 'books/register.html', {'form': form})


class CreateBookView(BookAuthMixin, CreateView):
    raise_exception = False
    permission_required = 'books.add_book'
    redirect_field_name = 'next'
    permission_denied_message = ''

    model = Book
    context_object_name = 'book'
    fields = ['title', 'author']


class UpdateBookView(BookAuthMixin, UpdateView):
    permission_required = 'books.change_book'
    model = Book
    context_object_name = 'book'
    fields = ['title', 'author']


class BookListView(ListView):
    model = Book
    ordering = 'title'
    context_object_name = 'book'


class BookDetailView(DetailView):
    model = Book
    context_object_name = 'book'


class BookDeleteView(DeleteView):
    model = Book
    context_object_name = 'book'
