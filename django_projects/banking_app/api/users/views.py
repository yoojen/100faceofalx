from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, IsAdminUser, IsAuthenticated
from api.accounts.helpers import IsManagerOrTeller
from transactions.models import Account
from .serializers import (AccountSerializer,
                             CreateUserLeavePasswordSerializer,
                             UserSerializer,
                             PasswordSerializer, PhoneNumberSerializer,
                             )
from api.transaction.serializers import TransactionSerializer
from profiles.models import User


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if request.user != obj:
            return False
        return True

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return True


class IsNotLoggedIn(BasePermission):

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return False
        return True
    
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()

    def get_serializer(self, *args, **kwargs):
        if self.action == 'list':
            return UserSerializer(*args, **kwargs)
        if self.action in ['set_password']:
            return PasswordSerializer(*args, **kwargs)
        if self.action == 'find_user':
            return PhoneNumberSerializer(*args, **kwargs)
        return CreateUserLeavePasswordSerializer(*args, **kwargs)
    
    def get_permissions(self):
        if self.action in ['create']:
            self.permission_classes = [IsAdminUser | IsManagerOrTeller]
        if self.action in ['destroy', 'update']:
            self.permission_classes = [IsAdminUser]
        if self.action in ['retrieve', 'list']:
            self.permission_classes = [IsAdminUser |
                                       IsManagerOrTeller | IsOwner]
        return [permission() for permission in self.permission_classes]

    def get_queryset(self):
        if self.request.user.type == 'CUSTOMER':
            qs = self.queryset.filter(id=self.request.user.id).all()
            UserViewSet.queryset = qs
            return self.queryset
        else:
            return self.queryset

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

    def list(self, request):
        serializer = self.get_serializer(
            self. queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        try:
            serializer = CreateUserLeavePasswordSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()
            return Response({"message": f"User {instance.first_name} was created successfully"},
                            status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            user = self.get_object()
            serializer = self.get_serializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Updated successfully", 
                                 "updated_fields": serializer.validated_data}, 
                                 status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response(status=status.http400)

    def destroy(self, request, pk=None):
        try:
            user = self.get_object()
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['GET'], url_path='user-acc', url_name='user_account',
            permission_classes=[IsAdminUser|IsManagerOrTeller|IsOwner])
    def user_accounts(self, request, pk=None):
        try:
            user = self.get_object()
            serializer = AccountSerializer(user.account)
            return Response({"status": "OK", "data": serializer.data})
        except User.account.RelatedObjectDoesNotExist:
            return Response({"message": "User has no account"})

        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["GET"], url_path='user-acc-trans', 
            url_name='user_account_transactions', permission_classes=[IsAdminUser | IsManagerOrTeller | IsOwner])
    def user_account_transactions(self, request, pk=None):
        try:
            user = self.get_object()
            account = user.account
            if account:
                queryset = account.transactions.all()
                serializer = TransactionSerializer(queryset, many=True)
                return Response({"status": "OK", "data": serializer.data})
            else:
                return Response({"message": f"There is no any transaction \
                                 for {user.first_name}'s account."})
        except User.account.RelatedObjectDoesNotExist:
            return Response({"message": "User has no account"})

        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["POST"], url_path='find-user', url_name='find_user', 
            permission_classes=[IsAdminUser | IsManagerOrTeller])
    def find_user(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(
            telephone=serializer.validated_data["telephone"]).first()
        if user:
            user_serializer = UserSerializer(user)
            return Response({"user": user_serializer.data, "message": "User found"},
                             status=status.HTTP_200_OK)
        return Response({"message": "No user found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["POST"], url_path='set-password', url_name='set_password',
            permission_classes=[IsNotLoggedIn])
    def set_password(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            return Response({"message": "Password has been set"},
                                status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong"}, 
                            status=status.HTTP_400_BAD_REQUEST)
