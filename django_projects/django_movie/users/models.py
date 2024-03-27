from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    image=models.ImageField(default='default.jpg', upload_to='profile_pics')

    def __str__(self) -> str:
        return f"{self.user.username}"

class History(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    movie_title=models.CharField(max_length=256)
    searched_link=models.CharField(max_length=256)

    def __str__(self) -> str:
        return f"{self.user.username}->{self.movie_title}"