from django.urls import path
from .views import movies
urlpatterns = [
    path('', movies, name="movie-home")
]
