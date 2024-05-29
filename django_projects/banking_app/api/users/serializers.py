from rest_framework import serializers

from profiles.models import Profile, User
from transactions.models import Account, Transactions


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['telephone', 'first_name', 'last_name', 'email',
                   'is_staff', 'is_active', 'is_superuser', 'type']



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
            raise serializers.ValidationError("Phone number must be equal to 13")
        if not value.startswith("+250"):
            raise serializers.ValidationError("Phone number must starts with +250")
        return value

class PhoneNumberSerializer(serializers.Serializer):
    telephone = serializers.CharField(max_length=13)
    class Meta:
        model = User
        fields = ["telephone"]
    

class PasswordSerializer(serializers.Serializer):
    telephone = serializers.CharField(max_length=13)
    password1 = serializers.CharField(max_length=18)
    password2 = serializers.CharField(max_length=18)

    class Meta:
        model = User
        fields = ["telephone","password1", "password2"]

    def validate(self, data):
        if (len(data['password1']) or len(data['password2'])) < 8:
            raise serializers.ValidationError("Password should be more than 8 characters")
        
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Password fields does not match")
        return data

    def validate_telephone(self, value):
        if len(value) != 13:
            raise serializers.ValidationError("Phone number must be equal to 13")
        if not value.startswith("+250"):
            raise serializers.ValidationError("Phone number must starts with +250")
        return value

