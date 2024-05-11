from django.urls import path
from django.contrib.auth.views import LogoutView
from .views import (CreateUserProfileView,UserLoginView,
                    CustomerListView, UserAccountDetailView, 
                    customer_profile_view, register)

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(template_name="profiles/logout.html"), name='logout'),
    path('customers/', CustomerListView.as_view(), name="customers"),
    path('create-user/', register, name="create_user"),
    path('create-user-profile/', CreateUserProfileView.as_view(), name="create_user_profile"),
    path('user/account/<int:pk>/',
         UserAccountDetailView.as_view(), name='user_account'),
    path('user/<int:pk>', customer_profile_view, name="user_profile")

]
