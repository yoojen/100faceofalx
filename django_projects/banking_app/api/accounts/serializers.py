from transactions.models import Account
from rest_framework import serializers
from dotenv import load_dotenv
from pathlib import Path
import os


BASE_DIR = Path(__file__).resolve().parent.parent
env_path = load_dotenv(os.path.join(BASE_DIR, '.env'))
load_dotenv(env_path)


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = "__all__"

    def validate_customer_phone_number(self, value):
        if not (os.environ.get('AIRTEL_1') == value[:3] or os.environ.get('AIRTEL_2')==value[:3]\
                or os.environ.get('MTN_1') == value[:3] or os.environ.get('MTN_2')==value[:3]):
            raise serializers.ValidationError("Phone number should begin with 078 | 072 | 073")