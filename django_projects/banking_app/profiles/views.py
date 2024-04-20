from django.shortcuts import render


def profiles(request):
    return render(request, template_name="profiles/base.html")
