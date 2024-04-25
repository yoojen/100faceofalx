from django.urls import path
from .views import (TransactionPostView,
                     find_account,
                       AccountListView, 
                    my_combined_view,
                    CustomerTransactionListView,
                      CreateAccountView)

urlpatterns = [
    path('transact/', TransactionPostView.as_view(), name="transact"),
    path('find_account/', find_account, name="find_account"),
    path('acc-inspect/', AccountListView.as_view(), name="acc_inspect"),
    path('acc-inspect/<int:pk>', my_combined_view,
         name="single_acc_inspect"),
    path('create-account/', CreateAccountView.as_view(), name="create_account")
]
