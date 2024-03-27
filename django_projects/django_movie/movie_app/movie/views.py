from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
import requests
from .models import SearchForm
from users.models import History


API_URL = "http://www.omdbapi.com/"
API_KEY = "apikey=ff5f3c28"


@login_required
def movies(request):
    form = SearchForm()
    if request.GET:
        movie_link = requests.get(f"{API_URL}?{API_KEY}", params=request.GET)
        movie = dict(movie_link.json())

        movie = {
            "Title": movie.get("Title"), "Rated": movie.get("Rated"),
            "Year": movie.get("Year"), "Released": movie.get("Released"),
            "Runtime": movie.get("Runtime"), "Genre": movie.get("Genre"),
            "Director": movie.get("Director"), "Plot": movie.get("Plot"),
            "Poster": movie.get("Poster")
        }
        if movie:
          if not History.objects.filter(movie_title=movie.get('Title')):
            if History.objects.filter(user_id=request.user.id).count() == 5:
                user_hist = History.objects.filter(user_id=request.user.id)
                user_hist.delete()
            user_history = History(user_id=request.user.id,
                  movie_title=movie.get('Title'),
                                  searched_link=movie_link.url)
            user_history.save()
        return render(request, 'movie/movie_list.html', {'form': form, "Title": movie.get("Title"),
                                                          "Rated": movie.get("Rated"),
                                                         "Year": movie.get("Year"),
                                                           "Released": movie.get("Released"),
                                                         "Runtime": movie.get("Runtime"),
                                                           "Genre": movie.get("Genre"),
                                                         "Director": movie.get("Director"), 
                                                         "Plot": movie.get("Plot"),
                                                         "Poster": movie.get("Poster")})
    else:
        return render(request, 'movie/movie_list.html', {'form': form})

