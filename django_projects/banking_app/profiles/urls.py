from django.urls import path
from .views import profiles

urlpatterns = [
    path('profiles/', profiles, name="profile")
]
