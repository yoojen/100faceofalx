# Generated by Django 5.0.3 on 2024-03-28 15:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_models', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='presidentinfo',
            name='ages',
        ),
    ]
