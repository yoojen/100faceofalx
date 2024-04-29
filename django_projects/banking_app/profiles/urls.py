from django.urls import path
from .views import profiles, CreateUserView, CreateUserProfileView

urlpatterns = [
    path('create-user/', CreateUserView.as_view(), name="create_user"),
    path('create-user-profile/', CreateUserProfileView.as_view(), name="create_user_profile"),
    path('profiles/', profiles, name="profile")
]
