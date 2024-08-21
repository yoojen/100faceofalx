from api.transaction.serializers import TransactionSerializer
from profiles.models import User
from transactions.models import Account, Transactions
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from .serializers import AccountSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from .helpers import IsManagerOrTeller, IsOwner


    
class AccountViewSet(ModelViewSet):
    queryset = None
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
            self.permission_classes = [IsAdminUser | IsManagerOrTeller | IsOwner]
        elif self.action in ['update', 'destory', 'patch']:
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [IsManagerOrTeller | IsAdminUser]
        return [permission() for permission in self.permission_classes]
        
    def get_queryset(self):
        queryset = Account.objects.all()
        try:
            if self.request.user.type == 'CUSTOMER':
                AccountViewSet.queryset = queryset.filter(
                    account_num=self.request.user.account.account_num).all()
                queryset = AccountViewSet.queryset
            AccountViewSet.queryset = queryset

            return queryset
        except Exception as e:
            return Response({"errors": str(e), "message": "Something wrong happened"},
                            status=status.HTTP_400_BAD_REQUEST)
        return queryset

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj
    

    def list(self, request):
        serializer = AccountSerializer(Account.objects.all(), many=True)
        print()
        return Response(serializer.data,  status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        account = self.get_object()
        serialzer = AccountSerializer(account)
        return Response(serialzer.data, status=status.HTTP_200_OK)
        
    def create(self, request):
        data= request.data.copy()
        try:
            telephone = data.pop('telephone')
            user = User.objects.filter(telephone=telephone).first()
            if not user:
                raise ValueError("No user found")
            data['customer'] = user.id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"data": serializer.data, 
                             "message": f"Account created successfully with {serializer.data.get('balance')}"},
                            status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def destroy(self, request, pk=None):
        try:
            account = self.get_object()
            account.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Account.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


    @action(detail=False, methods=["GET"],url_path='gen-acc-num', 
            url_name='gen_acc_num', permission_classes = [IsAdminUser | IsManagerOrTeller])
    def generate_account_num(self, request):
        from datetime import datetime
        today = str(datetime.now()).replace(
            ":", "").replace("-", "").replace(".", "").replace(" ", "")
        today = today[:13]
        return Response({"data": today, 
                         "message": "Account number generated successfully"})

    @action(detail=True, methods=["GET"], url_path='acc-transactions',
            url_name='acc_transactions', permission_classes = [IsAdminUser | IsManagerOrTeller |IsOwner])
    def account_transactions(self, request, pk=None):
        account = self.get_object()
        trans = account.transactions.all()
        serializer = TransactionSerializer(trans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["GET"], url_path='acc-transactions-one/(?P<trans_id>\d+)',
            url_name="single_account_trans", permission_classes=[IsAdminUser | IsManagerOrTeller | IsOwner])
    def account_transactions_single(self, request, pk=None, trans_id=None):
        account = self.get_object()
        trans = account.transactions.filter(pk=trans_id).first()
        serializer = TransactionSerializer(trans)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=["GET"], url_path='acc-amt-range', url_name='acc_amt_range',
             permission_classes=[IsAdminUser | IsManagerOrTeller])
    def account_amount_range(self, request):
        res = {}
        try:
            data = request.query_params
            for k in data.keys():
                if k not in ['from_bal', 'to_bal']:
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
    
    @action(detail=False, methods=["POST"], url_path='s-acc-ctm', url_name='s_acc_ctm',
             permission_classes =[IsAdminUser | IsManagerOrTeller])
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
    
    @action(detail=False, methods=["GET"], url_path='acc-btn', url_name='acc_btn',
            permission_classes=[IsAdminUser | IsManagerOrTeller | IsOwner])
    def opened_btn_date(self, request):
        res = {}
        try:
            data = request.query_params
            for k in data.keys():
                if k not in ['from_date', 'to_date']:
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
