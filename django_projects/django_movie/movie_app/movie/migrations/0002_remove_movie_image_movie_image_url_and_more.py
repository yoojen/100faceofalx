# Generated by Django 5.0.3 on 2024-03-24 18:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movie', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movie',
            name='image',
        ),
        migrations.AddField(
            model_name='movie',
            name='image_url',
            field=models.CharField(default='https://hips.hearstapps.com/hmg-prod/images/best-fall-movies-1659459329.jpg', max_length=256),
        ),
        migrations.AlterField(
            model_name='movie',
            name='country',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='movie',
            name='language',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='movie',
            name='name',
            field=models.CharField(max_length=256),
        ),
    ]