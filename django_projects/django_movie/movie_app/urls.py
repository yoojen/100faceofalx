"""
URL configuration for movie_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from users.views import CustomPasswordResetView
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import (LoginView, 
                                       LogoutView,
                                         PasswordResetDoneView,
                                         PasswordResetConfirmView,
                                         PasswordResetCompleteView)
from django.conf import settings
from django.conf.urls.static import static
from users.views import CustomUserLoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', CustomUserLoginView.as_view(template_name='users/login.html'), name='login'),
    path('logout/', LogoutView.as_view(template_name='users/logout.html'), name='logout'),
    path('password-reset/', 
         CustomPasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done/',
         PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>',
         PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password-reset-complete',
         PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('', include('movie.urls')),
    path('', include('users.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, 
                          document_root=settings.MEDIA_ROOT)