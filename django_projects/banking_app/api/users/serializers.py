from rest_framework import serializers

from profiles.models import Profile, User
from transactions.models import Account, Transactions


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"



class AccountSerializer(serializers.ModelSerializer):
    # Transactions = TransactionsSerializer(read_only=True)
    class Meta:
        model = Account
        fields = "__all__"

class CreateUserLeavePasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["telephone", "email", "first_name", "last_name"]

    def validate_telephone(self, value):
        if len(value) != 13:
            raise ValueError("Phone number must be equal to 13")

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


