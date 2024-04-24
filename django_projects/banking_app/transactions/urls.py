from django.urls import path
from .views import (TransactionPostView,
                     find_account,
                       AccountListView, 
                    my_combined_view,
                       CustomerTransactionListView)

urlpatterns = [
    path('transact/', TransactionPostView.as_view(), name="transact"),
    path('find_account/', find_account, name="find_account"),
    path('acc_inspect/', AccountListView.as_view(), name="acc_inspect"),
    path('acc_inspect/<int:pk>', my_combined_view,
         name="single_acc_insept"),
]
