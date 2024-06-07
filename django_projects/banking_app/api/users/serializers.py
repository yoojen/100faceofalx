from rest_framework import serializers
from django.contrib.auth.hashers import make_password
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
    account_num = serializers.CharField(max_length=13, required=False)
    telephone = serializers.CharField(max_length=13, required=False)
    password1 = serializers.CharField(max_length=18)
    password2 = serializers.CharField(max_length=18)

    class Meta:
        model = User
        fields = ["account_num","telephone","password1", "password2"]

    def validate(self, data):
        account_num = data.get('account_num')
        telephone = data.get('telephone')

        if len(data['telephone']) != 13:
            raise serializers.ValidationError(
                "Phone number must be equal to 13")
        if not data['telephone'].startswith("+250"):
            raise serializers.ValidationError(
                "Phone number must starts with +250")
        
        if (len(data['password1']) or len(data['password2'])) < 8:
            raise serializers.ValidationError("Password should be more than 8 characters")
        
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Password fields does not match")

        user = User.objects.filter(telephone=telephone).first()
        if user and user.password:
            raise serializers.ValidationError("Password already set")
        
        account = Account.objects.filter(account_num=account_num).first()
        if user.account != account:
            raise serializers.ValidationError("No account associated to this phone number")
        return data

    def save(self, **kwargs):
        password = self.validated_data['password1']
        self.user.password = make_password(password)
        self.user.save()
        return self.user
