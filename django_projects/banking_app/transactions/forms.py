from django import forms
from .models import BillInfo

class BillForm(forms.ModelForm):
    payee_acc = forms.CharField(max_length=13, required=True, label="Payee Account Number")

    class Meta:
        model = BillInfo
        fields = ["payee_acc", "payee_name", "amount"]