from rest_framework import serializers

from profiles.models import User
from transactions.models import Account, Transactions


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class TransactionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = "__all__"


class AccountSerializer(serializers.ModelSerializer):
    Transactions = TransactionsSerializer(read_only=True)
    class Meta:
        model = Account
        fields = "__all__"

class CreateUserLeavePasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["telephone", "email", "first_name", "last_name"]


class PhoneNumberSerializer(serializers.Serializer):
    telephone = serializers.CharField(max_length=13)
    class Meta:
        model = User
        fields = ["telephone"]


class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=18)
    class Meta:
        model = User
        fields = ["password"]