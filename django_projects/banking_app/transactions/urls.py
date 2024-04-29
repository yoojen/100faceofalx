from django.urls import path
from .views import (TransactionPostView,
                    AccountListView, 
                    CustomerTransactionListView,
                    CreateAccountView,
                    find_account,
                    my_combined_view,
                    generate_account_number)

urlpatterns = [
    path('transact/', TransactionPostView.as_view(), name="transact"),
    path('acc-inspect/', AccountListView.as_view(), name="acc_inspect"),
    path('acc-inspect/<int:pk>', my_combined_view,
         name="single_acc_inspect"),
    path('create-account/', CreateAccountView.as_view(), name="create_account"),
    path('find-account/', find_account, name="find_account"),
    path('gen-acc/', generate_account_number, name="gen_acc"),
]
