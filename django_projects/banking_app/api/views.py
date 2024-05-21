from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from api.serializers import AccountSerializer, UserSerializer, TransactionsSerializer
from profiles.models import User
from transactions.models import Account, Transactions


class UserViewSet(ViewSet):
    queryset = User.objects.all()
    
    def list(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(
            queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def retrieve(self, request, pk=None):
        user = get_object_or_404(self.queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        try:
            user = self.queryset.get(pk=pk)
            serializer = UserSerializer(user, data=request.data)

            if serializer.is_valid():
                print(serializer.data)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        try:
            user = self.queryset.get(pk=pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


    @action(detail=True, methods=['GET'])
    def user_accounts(self, request, pk=None):
        try:
            user = self.queryset.get(pk=pk)
            serializer = AccountSerializer(user.account)
            return Response({"status": "OK", "data": serializer.data})
        except User.account.RelatedObjectDoesNotExist:
            return Response({"message": "User has no account"})

        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=["GET"])
    def user_account_transactions(self, request, pk=None):
        try:
            user = self.queryset.get(pk=pk)
            account = user.account
            if account:
                queryset = account.transactions.all()
                serializer = TransactionsSerializer(queryset, many=True)
                return Response({"status": "OK", "data": serializer.data})
            else:
                return Response({"message": f"There is no any transaction for {user.first_name}'s account."})
        except User.account.RelatedObjectDoesNotExist:
            return Response({"message": "User has no account"})

        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
