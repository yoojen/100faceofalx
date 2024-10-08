from django.urls import path
from django.contrib.auth.views import LogoutView
from .views import (CreateUserProfileView, login_view,
                    CustomerListView, UserAccountDetailView,
                    create_password,
                    register)
from profiles.views import customer_profile_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', LogoutView.as_view(template_name="profiles/logout.html"), name='logout'),
    path('create-password/', create_password, name="create_password"),
    path('customers/', CustomerListView.as_view(), name="customers"),
    path('create-user/', register, name="create_user"),
    path('create-user-profile/', CreateUserProfileView.as_view(), name="create_user_profile"),
    path('user/account/<int:pk>/',
         UserAccountDetailView.as_view(), name='user_account'),
    path('user/<int:pk>', customer_profile_view, name="user_profile")

]
