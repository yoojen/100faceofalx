from django.shortcuts import render
from django.template import RequestContext
from guardian.shortcuts import get_objects_for_user


def user_dashboard(request, ):
    tasks = get_objects_for_user(request.user, 'task.view_task')
    return render(request, 'task/dashboard.html', {'tasks': tasks})
