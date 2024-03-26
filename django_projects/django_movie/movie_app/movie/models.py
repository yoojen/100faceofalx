from django.db import models
from django.utils import timezone
from django.core.validators import MinLengthValidator
from django import forms

class Genre(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self) -> str:
        return f"{self.name}"

# class Actors(models.Model):
#     first_name=models.CharField(min_length=2, null=False)
#     last_name=models.CharField(min_length=2, null=False)


class Movie(models.Model):
    name = models.CharField(max_length=256, null=False)
    description = models.TextField()
    date_released = models.DateField(default=timezone.now)
    ratings = models.IntegerField(default=0)
    image_url = models.CharField(
        max_length=256, null=False, default="https://hips.hearstapps.com/hmg-prod/images/best-fall-movies-1659459329.jpg")
    language = models.CharField(max_length=256, null=False)
    country = models.CharField(max_length=256, null=False)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.name}"

    class Meta:
        ordering = ["-date_released"]


class SearchForm(forms.Form):
    type_choises=(
        ('end', "End"),
        ('series', "Series")
    )
    plot_choices = (
        ('full', "Full"),
        ('short', "Short")
    )
    t=forms.CharField(label="Title",max_length=256)
    y=forms.IntegerField(label="Year", required=False)
    plot = forms.ChoiceField(label="Plot", choices=plot_choices)