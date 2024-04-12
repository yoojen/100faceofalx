from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse


class Task(models.Model):
    summary = models.CharField(max_length=32)
    content = models.TextField()
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        permissions = (
            ('assign_task', 'Assign task'),
        )

    def __str__(self):
        return f"{self.summary}"

    def get_absolute_url(self):
        return reverse('dashboard')
