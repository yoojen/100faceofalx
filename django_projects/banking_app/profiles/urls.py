from django.urls import path
from .views import profiles, CreateUserView

urlpatterns = [
    path('create-user', CreateUserView.as_view(), name="create_user"),
    path('profiles/', profiles, name="profile")
]
