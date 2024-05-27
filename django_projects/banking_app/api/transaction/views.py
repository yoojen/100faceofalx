from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework import status
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from transactions.models import Account
from .serializers import TransactionSerializer, Transactions

class TransactionsViewSet(ViewSet):
    queryset=Transactions.objects.all()

    def get_object(self, pk=None):
        """Custom get_object method that returns current object"""
        return get_object_or_404(self.queryset, pk=pk)
    
    def list(self, request):
        serializer = TransactionSerializer(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        transaction = self.get_object(pk=pk)
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        data = request.data
        obj = self.get_object(pk=pk)
        serializer = TransactionSerializer(obj, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        account = Account.objects.filter(pk=obj.account_id).first()

        if data.get('amount') and not data.get('type'):
            return Response({"errors": "Please provide type of initial transaction"})
        if data.get('amount') or data.get('type'):
            if obj.type == "Deposit" and data.get('type') == "Withdraw":
                if account.balance >= (data.get('amount') * 2 if data.get('amount') else obj.amount):
                    account.balance = account.balance - obj.amount
                    account.balance = account.balance - \
                        data.get('amount') if data.get('amount') else obj.amount
                return Response({"erros": "Insufficient funds"},status=status.HTTP_400_BAD_REQUEST)
            elif obj.type == "Withdraw" and data.get('type') == "Deposit":
                account.balance = account.balance + obj.amount
                account.balance = account.balance + \
                    data.get('amount') if data.get('amount') else obj.amount
            elif obj.description == "Opening amount":
                return Response({"errors:" "Can not process the transaction"},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"errors:" "Check transaction type"},
                                status=status.HTTP_400_BAD_REQUEST)
            account.save()
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, pk=None):
        pass
    
    @action(detail=False, methods=["POST"], url_path="deposit", url_name="deposit")
    def deposit(self, request):
        """Process deposit transctions"""
        pass

    @action(detail=False, methods=["POST"], url_path="withdraw", url_name="deposit")
    def withdraw(self, request):
        """Process withdraw transctions"""
        pass

    @action(detail=False,methods=['GET'], url_path='trans-for-acc',
            url_name='transction_for_acc')
    def transaction_by_account(self, request, acc_num=None):
        """Return transaction for a passed accunt number"""
        pass

    @action(detail=False, methods=["GET"], url_path="trans-date", url_name="transactions_date")
    def transactions_by_date(self, request):
        """Returns transactions that occured in range of date"""
        pass

    @action(detail=False, methods=["GET"], url_path="trans-amt", url_name="transactions_amt")
    def transactions_by_amount(self, request):
        """Returns transaction based on amount query param"""
        pass

    @action(detail=False, methods=["POST"], url_path='pay-bills', url_name='pay_bills')
    def transaction_paybills(self, request):
        """Allow customer to pay bills"""
        pass

    @action(detail=False, methods=["GET"], url_path="recent-transactions", url_name="recent_transactions")
    def transaction_recent_paid(self, request, acc_num=None):
        """
        Return recent transactions made by a user
        This is implemented to easy payment when payment is done
        to same user frequently
        """

        pass

    @action(detail=False, methods=["GET"])
    def transactions_by_type(self, request):
        """Return transactions based on type: Deposit | Withdraw """
        pass

    @action(detail=False, methods=["GET"], url_path="trans-type-amt", url_name="trans_type_amt")
    def transactions_by_type_and_amount(self, request):
        """Returnt transactions based on type and amount"""
        pass

    