from django.db import models
from django.urls import reverse


class Author(models.Model):
    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"


class Book(models.Model):
    title = models.CharField(max_length=256)
    author = models.ForeignKey(
        Author, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.title}"

    def get_absolute_url(self):
        return reverse('books-home')
