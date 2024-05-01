from django.urls import path
from django.contrib.auth.views import LogoutView
from .views import (CreateUserProfileView,UserLoginView,
                    CustomerListView, 
                    register,
                    my_combined_view)

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(template_name="profiles/logout.html"), name='logout'),
    path('customers/', CustomerListView.as_view(), name="customers"),
    path('customers/<int:pk>', my_combined_view, name="customer"),
    path('create-user/', register, name="create_user"),
    path('create-user-profile/', CreateUserProfileView.as_view(), name="create_user_profile"),
]
