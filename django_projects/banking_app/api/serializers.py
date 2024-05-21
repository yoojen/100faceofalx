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
        fields = ["transactions"]



