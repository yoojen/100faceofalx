from django.contrib.auth.views import LoginView
from django.views.generic import ListView, DetailView, DeleteView, UpdateView
from django.http import HttpResponse
from .forms import UserRegistrationForm
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Book


class CustomLoginView(LoginView):
    redirect_authenticated_user = True
    template_name = 'books/login.html'


def register_user(request):
    if request.method != 'POST':
        form = UserRegistrationForm()
    else:
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Account created successfully')
            return redirect('login')
    return render(request, 'books/register.html', {'form': form})


def homeview(request):
    return HttpResponse(f'HOMEPAGE, WELCOME BACK {request.user.username}')


class UpdateBookView(UpdateView):
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
