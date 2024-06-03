from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission, IsAdminUser, IsAuthenticated
from transactions.models import Account
from .serializers import TransactionSerializer, Transactions
from api.accounts.helpers import IsManagerOrTeller


class IsOwnerOfTransaction(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return super().has_permission(request, view)
    
    def has_object_permission(self, request, view, obj):
        if not obj.account == request.user.account:
            return False
        return True


class TransactionsViewSet(ModelViewSet):
    queryset=None
    serializer_class = TransactionSerializer

    def get_object(self):
        """Custom get_object method that returns current object"""
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

    def get_queryset(self):
        queryset = Transactions.objects.all()
        try:
            if self.request.user.type == 'CUSTOMER':
                TransactionsViewSet.queryset = queryset.filter(account=self.request.user.account).all()
                queryset = TransactionsViewSet.queryset
            TransactionsViewSet.queryset = queryset
            return queryset
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong"},
                            status=status.HTTP_400_BAD_REQUEST)
    
    def get_permissions(self):
        if self.action in ['retrieve']:
            self.permission_classes = [IsAdminUser |
                                       IsManagerOrTeller | IsOwnerOfTransaction]
        elif self.action in ['destroy', 'update', 'patch']:
            self.permission_classes = [IsAdminUser]
        elif self.action in ['list']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsManagerOrTeller|IsAdminUser]
        return [permission() for permission in self.permission_classes]
    
    def list(self, request):
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

    def retrieve(self, request, pk=None):
        transaction = self.get_object()
        serializer = self.serializer_class(transaction)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        return Response({"message": "Please try different endpoints", "endpoints": [
            "http://localhost:8000/api/v1/transactions/deposit",
            "http://localhost:8000/api/v1/transactions/withdraw",

            ]})
    
    def update(self, request, pk=None):
        data = request.data
        obj = self.get_object()
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
        try:
            transaction = self.get_object()
            transaction.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=["POST"], url_path="deposit", url_name="deposit")
    def deposit(self, request):
        """Process deposit transctions"""
        if request.data.get('type') != "Deposit":
            return Response({"errors": "Please provide correct type"})
        try:
            account = Account.objects.filter(
                account_num=request.data.get("account_num")).first()
            
            serializer = TransactionSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            account.balance = float(account.balance) + \
                float(request.data.get('amount'))
            account.save()
            serializer.save()
            return Response({"message": "Recorded successfully"})
        except Exception as e:
            return Response({"errors": str(e)})

    @action(detail=False, methods=["POST"], url_path="withdraw", url_name="deposit")
    def withdraw(self, request):
        """Process withdraw transctions"""
        if request.data.get('type') != "Withdraw":
            return Response({"errors": "Please provide correct type"})
        try:
            serializer = TransactionSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            account = Account.objects.filter(
                account_num=request.data.get('account_num')).first()
            if account.balance >= float(request.data.get('amount')):
                account.balance = float(account.balance) - \
                    float(request.data.get('amount'))
                account.save()
                serializer.save()
                return Response({"message": "Recorded successfully"}, status=status.HTTP_201_CREATED)
            return Response({"erros": "Insuficient funds"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["GET"], url_path="trans-date", url_name="transactions_date")
    def transactions_by_date(self, request):
        """Returns transactions that occured in range of date"""
        res = {}
        data = request.query_params
        if data.keys not in ['from_date', 'to_date']:
            return Response({"errors": "Please provide correct query params"},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            if not data.get('from_date') and data.get('to_date'):
                res = TransactionsViewSet.queryset.filter(date_done__lte=data.get('to_date')).all()
                serializer = TransactionSerializer(res, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            if data.get('from_date') and not data.get('to_date'):
                res = TransactionsViewSet.queryset.filter(
                    date_done__gte=data.get('from_date')).all()
                serializer = TransactionSerializer(res, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            res = TransactionsViewSet.queryset.filter(date_done__gte=data.get('from_date'),
                                    date_done__lte=data.get('to_date')).all()
            serializer = TransactionSerializer(res, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong, try again!"},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["GET"], url_path="trans-amt", url_name="transactions_amt")
    def transactions_by_amount(self, request):
        """Returns transaction based on amount query param"""
        try:
            data = request.query_params
            for k in data.keys():
                if k not in ['from_amt', 'to_amt']:
                    return Response({"errors": "Please provide correct query params"},
                                status=status.HTTP_400_BAD_REQUEST)
            if not data.get('from_amt') and data.get('to_amt'):
                res = TransactionsViewSet.queryset.filter(
                    amount__lte=data.get('to_amt')).all()
                serializer = TransactionSerializer(res, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            if data.get('from_amt') and not data.get('to_amt'):
                res = TransactionsViewSet.queryset.filter(
                    amount__gte=data.get('from_amt')).all()
                serializer = TransactionSerializer(res, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            res = TransactionsViewSet.queryset.filter(amount__gte=data.get('from_amt'),
                                       amount__lte=data.get('to_amt')).all()
            serializer = TransactionSerializer(res, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong, try again!"},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["GET"], url_path="recent-trans", url_name="recent_transactions")
    def transaction_recent_paid(self, request):
        """
        Return recent transactions
        """
        serializer = TransactionSerializer(TransactionsViewSet.queryset[:10], many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

        
    @action(detail=False, methods=["GET"], url_path='trans-type', url_name='transaction_by_type')
    def transactions_by_type(self, request):
        """Return transactions based on type: Deposit | Withdraw """
        data = request.query_params
        if data.get('type') not in ["Deposit", "Withdraw"]:
            return Response({"errors": "Please provide correct query params"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        if data.get('type') == "Deposit":
            serializer = TransactionSerializer(TransactionsViewSet.queryset.filter(
                type=data.get('type')).all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        if data.get('type') == "Withdraw":
            serializer = TransactionSerializer(
                TransactionsViewSet.queryset.filter(type=data.get('type')).all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        