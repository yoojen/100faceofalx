from django.urls import path
from .views import TransactionPostView, find_account

urlpatterns = [
    path('deposit/', TransactionPostView.as_view(), name="deposit"),
    path('find_account/', find_account, name="find_account")
]
