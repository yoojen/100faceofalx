from rest_framework import serializers
from transactions.models import Transactions, Account


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = "__all__"
        read_only_fields = ['account']

    def validate(self, data):
        acc_num = data.get('account_num', None)
        account = Account.objects.filter(
            account_num=acc_num).first()
        if not account:
            raise serializers.ValidationError("No associated account found")
        data['account_id'] = account.id
        return data

    
