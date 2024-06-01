from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from profiles.models import User
from transactions.models import Account, BillInfo
from .serializers import BillsSerializer
from api.accounts.helpers import IsManagerOrTeller, IsOwner
from rest_framework.serializers import ValidationError


class BillViewSet(ModelViewSet):
    queryset=BillInfo.objects.all()
    serializer_class = BillsSerializer

    def get_permissions(self):
        if self.action in ['destroy']:
            self.permission_classes = [IsAdminUser]
        if self.action in ['retrieve']:
            self.permission_classes = [IsAdminUser | IsManagerOrTeller | IsOwner]
        return [permission() for permission in self.permission_classes]
    
    def get_object(self):
        """Return single object from queryset"""
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        print(self.check_object_permissions(self.request, obj))
        return obj
    
    def list(self, request):
        if request.user.type == 'CUSTOMER':
            self.queryset = self.queryset.filter(customer=request.user).all()
        serializer = BillsSerializer(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def retrieve(self, request, pk=None):
        bill = self.get_object()
        serializer = BillsSerializer(bill, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request):
        data = request.data.copy()
        try:
            customer = request.user.telephone
            user = User.objects.filter(telephone=customer).first()
            data['customer'] = user.id

            payer = Account.objects.filter(
                customer_phone_number=customer).first()
            if not payer:
                return Response({"errors":"User has no account"}, status=status.HTTP_400_BAD_REQUEST)
            payee_account = Account.objects.filter(account_num=data.get('payee_account')).first()
            if not payee_account:
                return Response({"errors":"No account found"}, status=status.HTTP_400_BAD_REQUEST)

            data['payee_account'] = payee_account.id

            serializer = BillsSerializer(data=data)
            serializer.is_valid(raise_exception=True)

            # Update on account balances
            if payer.balance >= data.get('amount'):
                payer.balance = payer.balance - data.get('amount')
                payee_account.balance = payee_account.balance + data.get('amount')
                payer.save()
                payee_account.save()
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"errors": "Insuffiecient funds"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError:
            return Response({})
        except Exception as e:
            return Response({"erros": str(e), "message":"Something went wrong"},
                             status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self, request, pk=None):
        try:
            bill = self.get_object()
            bill.delete()

            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"errors": str(e)})

    @action(detail=False, methods=["GET"], url_path="bill-amt", url_name="bill_amount")
    def transactions_by_amount(self, request):
        """Returns bill transaction based on amount query param"""
        try:
            data = request.query_params
            for k in data.keys():
                if k not in ['from_amt', 'to_amt']:
                    return Response({"errors": "Please provide correct query params"},
                                    status=status.HTTP_400_BAD_REQUEST)
            if not data.get('from_amt') and data.get('to_amt'):
                res = self.queryset.filter(
                    amount__lte=data.get('to_amt')).all()
                serializer = BillsSerializer(res, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            if data.get('from_amt') and not data.get('to_amt'):
                res = self.queryset.filter(
                    amount__gte=data.get('from_amt')).all()
                serializer = BillsSerializer(res, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            res = self.queryset.filter(amount__gte=data.get('from_amt'),
                                       amount__lte=data.get('to_amt')).all()
            serializer = BillsSerializer(res, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong, try again!"},
                            status=status.HTTP_400_BAD_REQUEST)
