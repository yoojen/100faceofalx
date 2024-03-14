from django.shortcuts import render
from django.http import HttpResponse


posts = [
    {
        'author': "Eugene Emma",
        'title': "Blog post",
        'content': "First post content",
        "date_posted": "August 27, 2024"
    },
    {
        'author': "Henry Johns",
        'title': "Blog post 2",
        'content': "Second post content",
        "date_posted": "August 28, 2024"
    }
]


def home(request):
    context = {
        'posts': posts
    }
    return render(request, 'blog/home.html', context)


def about(request):
    return render(request, 'blog/about.html', {'title': 'About'})
