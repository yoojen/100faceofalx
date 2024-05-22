from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from api.serializers import (AccountSerializer,
                             CreateUserLeavePasswordSerializer,
                             UserSerializer, TransactionsSerializer,
                             PasswordSerializer, PhoneNumberSerializer)
from profiles.models import Profile, User
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
    
    
    def create(self, request):
        serializer = CreateUserLeavePasswordSerializer(data = request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response({"message": f"User {instance.first_name} was created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def update(self, request, pk=None):
        try:
            user = self.queryset.get(pk=pk)
            serializer = UserSerializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Updated successfully", "updated_fields": serializer.validated_data}, status=status.HTTP_201_CREATED)
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


    @action(detail=False, methods=["POST"])
    def find_user(self, request):
        serializer = PhoneNumberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(telephone=serializer.validated_data["telephone"]).first()
        if user:
            return Response({"user_id": user.id, "message": "User found"}, status=status.HTTP_200_OK)
        return Response({"message": "No uer found"}, status=status.HTTP_404_NOT_FOUND)
    

    @action(detail=True, methods=["POST"])
    def set_password(self, request, pk=None):
        serializer = PasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(pk=pk)
        if user.password:
            return Response({"message": "Password already set"}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data["password"])
        user.save()
        return Response({"message": "Password has been set"}, status=status.HTTP_202_ACCEPTED)
    


class UserProfileViewSet(ViewSet):
    querset = Profile.objects.all()

    def list(self, request):
        pass

    def create(self, request):
        pass
    
    def retrieve(self, request):
        pass

    def update(self, request, pk=None):
        pass

    def delete(self, request, pk=None):
        pass

    @action(detail=True, methods=["GET"])
    def user_birth(self, request):
        """Return user based on year of birth"""
        pass

    @action(detail=True, methods=['GET'])
    def user_age_gt(self, request):
        """Select users with age gt requested age"""
        pass

    @action(detail=True, methods=['GET'])
    def user_age_lt(self, request):
        """Select users with age lt requested age"""
        pass
    
    @action(detail=True, methods=['GET'])
    def user_provice_district(self, request):
        """Select users with age lt requested age"""
        pass
