from django.shortcuts import render
from guardian.shortcuts import get_objects_for_user
from django.contrib.auth.models import Group
from django.views.generic import UpdateView
from .models import Task
from guardian.decorators import permission_required_or_403
from django.http import HttpResponse


def user_dashboard(request):
    tasks = get_objects_for_user(
        request.user, 'task.view_task', accept_global_perms=False)
    return render(request, 'task/dashboard.html', {'tasks': tasks})


class TaskUpdateView(UpdateView):
    model = Task
    fields = '__all__'
