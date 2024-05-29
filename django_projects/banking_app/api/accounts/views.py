from django.shortcuts import get_object_or_404
from api.transaction.serializers import TransactionSerializer
from profiles.models import User
from transactions.models import Account, Transactions
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from .serializers import AccountSerializer
from rest_framework.response import Response
from rest_framework import status

class AccountViewSet(ViewSet):
    queryset = Account.objects.all()


    def get_object(self, pk):
        return get_object_or_404(self.queryset, pk=pk)
    
    def list(self, request):
        serializer = AccountSerializer(self.queryset, many=True)
        return Response(serializer.data,  status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        account = get_object_or_404(self.queryset, pk=pk)
        serialzer = AccountSerializer(account)
        return Response(serialzer.data, status=status.HTTP_200_OK)
        
    
    def create(self, request):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            # creation of transaction
            acc_num, amount = serializer.validated_data["account_num"], \
                serializer.validated_data["balance"]
            user = User.objects.filter(
                telephone=serializer.validated_data["customer_phone_number"]).first()
            if not user:
                return Response({"message": "Enter correct phone number"},
                                 status=status.HTTP_400_BAD_REQUEST)
            account = Account.objects.create(account_num=acc_num, balance=amount, 
                              customer_phone_number=user.telephone, customer_id=user.id)
            return Response({"data": account.id, 
                            "message": f"Account created successfully with {account.balance} balance"},
                            status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def destroy(self, request, pk=None):
        try:
            account = self.queryset.get(pk=pk)
            account.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Account.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


    @action(detail=False, methods=["GET"],url_path='gen-acc-num', 
            url_name='gen_acc_num')
    def generate_account_num(self, request):
        from datetime import datetime
        today = str(datetime.now()).replace(
            ":", "").replace("-", "").replace(".", "").replace(" ", "")
        today = today[:13]
        return Response({"data": today, 
                         "message": "Account number generated successfully"})

    @action(detail=True, methods=["GET"], url_path='acc-transactions',
            url_name='acc_transactions')
    def account_transactions(self, request, pk=None):
        account = self.get_object(pk=pk)
        trans = account.transactions.all()
        serializer = TransactionSerializer(trans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["GET"], url_path='acc-transactions-one/(?P<trans_id>\d+)',
            url_name="single_account_trans")
    def account_transactions_single(self, request, pk=None, trans_id=None):
        account = self.get_object(pk=pk)
        trans = account.transactions.filter(pk=trans_id).first()
        serializer = TransactionSerializer(trans)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=["GET"], url_path='acc-amt-range', url_name='acc_amt_range')
    def account_amount_range(self, request):
        res = {}
        try:
            data = request.data
            if data.keys not in ['from_bal', 'to_bal']:
                return Response({"errors": "Please provide correct query params"},
                                status=status.HTTP_400_BAD_REQUEST)
            if not data.get('from_bal') and data.get('to_bal'):
                res = self.queryset.filter(balance__lte=data.get('to_bal')).all()
                serializer = AccountSerializer(res, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            if data.get('from_bal') and not data.get('to_bal'):
                res = self.queryset.filter(
                    balance__gte=data.get('from_bal')).all()
                serializer = AccountSerializer(res, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            res = self.queryset.filter(balance__gte=data.get('from_bal'),
                                       balance__lte=data.get('to_bal')).all()
            serializer = AccountSerializer(res, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong, try again!"},
                            status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=["POST"], url_path='s-acc-ctm', url_name='s_acc_ctm')
    def account_by_customer(self, request):
        try:
            data = request.data
            res = self.queryset.filter(customer_phone_number=data.get('phone_number')).first()
            if res:
                serializer = AccountSerializer(res)
                return Response(serializer.data)
            return Response({"message": "Enter correct Phone number"})
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong, try again!"},
                            status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=["POST"], url_path='acc-btn', url_name='acc_btn')
    def opened_btn_date(self, request):
        try:
            data = request.data
            if data.keys not in ['from_date', 'to_date']:
                return Response({"errors": "Please provide correct query params"},
                            status=status.HTTP_400_BAD_REQUEST)
            if not data.get('from_date') and data.get('to_date'):
                res = self.queryset.filter(date_opened__lte=data.get('to_date')).all()
                serializer = AccountSerializer(res, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            if data.get('from_date') and not data.get('to_date'):
                res = self.queryset.filter(
                    date_opened__gte=data.get('from_date')).all()
                serializer = AccountSerializer(res, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            res = self.queryset.filter(date_opened__gte=data.get('from_date'),
                                        date_opened__lte=data.get('to_date')).all()
            serializer = AccountSerializer(res, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong, try again!"}, 
                            status=status.HTTP_400_BAD_REQUEST)
