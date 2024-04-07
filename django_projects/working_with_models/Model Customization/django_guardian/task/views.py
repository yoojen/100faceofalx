from django.shortcuts import render
from guardian.shortcuts import get_objects_for_user


def user_dashboard(request):
    tasks = get_objects_for_user(
        request.user, 'task.view_task', accept_global_perms=False)
    return render(request, 'task/dashboard.html', {'tasks': tasks})