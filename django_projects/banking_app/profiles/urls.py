from django.urls import path
from .views import (CreateUserView, 
                    CreateUserProfileView,
                    CustomerListView, 
                    CustomerDetailView,
                    my_combined_view)

urlpatterns = [
    path('customers/', CustomerListView.as_view(), name="customers"),
    path('customers/<int:pk>', my_combined_view, name="customer"),
    path('create-user/', CreateUserView.as_view(), name="create_user"),
    path('create-user-profile/', CreateUserProfileView.as_view(), name="create_user_profile"),
]
