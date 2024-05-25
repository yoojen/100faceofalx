from transactions.models import Account
from rest_framework import serializers

class AccountSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Account
        fields = "__all__"