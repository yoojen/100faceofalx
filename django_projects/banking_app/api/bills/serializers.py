from rest_framework import serializers

from transactions.models import Account, BillInfo


class BillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillInfo
        fields = "__all__"
        read_only_fields = ['customer']

    def validate(self, data):
        if data['payee_account'] == Account.objects.filter(customer_id=data['customer']).first():
            print("reaches here")
            raise serializers.ValidationError("You can't sent to same account")

        return data

