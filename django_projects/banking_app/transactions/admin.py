from typing import Any
from django.contrib import admin
from .models import (Account,
                     Transactions,
                     Card,
                     BillInfo
                     )
from profiles.admin import CustomObjectAccessMixin


class AccountAdmin(CustomObjectAccessMixin, admin.ModelAdmin):
    model = Account
    search_fields = ["account_num__exact"]
    list_per_page = 10
    list_display = ["account_num", "balance", "date_opened"]


class TransactionsAdmin(admin.ModelAdmin):
    model = Transactions
    search_fields = ["account__exact"]
    list_display = ["account", "amount", "date_done", "description", "type"]
    list_per_page = 10
    CURRENT_OBJ_AMOUNT = 0.0
    CURRENT_OBJ_TYPE = ""

    def get_form(self, request: Any, obj: Any | None = ..., change: bool = ..., **kwargs: Any) -> Any:
        self.CURRENT_OBJ_AMOUNT = obj.amount
        self.CURRENT_OBJ_TYPE = obj.type
        return super().get_form(request, obj, change, **kwargs)
    

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        account = obj.account
        if change:
            if self.CURRENT_OBJ_TYPE == "Deposit" and obj.type == "Deposit":
                account.balance -= self.CURRENT_OBJ_AMOUNT
                account.balance += obj.amount
            elif self.CURRENT_OBJ_TYPE == "Deposit" and obj.type == "Withdraw":
                account.balance -= self.CURRENT_OBJ_AMOUNT
                account.balance -= obj.amount
            elif self.CURRENT_OBJ_TYPE == "Withdraw" and obj.type == "Deposit":
                account.balance += self.CURRENT_OBJ_AMOUNT
                account.balance += obj.amount
            else:
                account.balance += self.CURRENT_OBJ_AMOUNT
                account.balance -= obj.amount
        else:
            if obj.type == 'Deposit':
                account.balance += obj.amount
                print("reached here", obj.amount)
            else:
                if account.balance < obj.amount:
                    raise ValueError('Insufficient funds')
                account.balance -= obj.amount
        account.save()


class CardAdmin(admin.ModelAdmin):
    search_fields = ["card_number__exact"]
    list_display = ["customer", "card_type", "card_number",
                    "expiration_date", "is_active", "issue_date"]
    list_per_page = 10


@admin.register(BillInfo)
class BillInfoAdmin(admin.ModelAdmin):
    search_fields = ["payee_account__exact"]
    list_display = ["customer", "payee_name",
                    "payee_account", "payment_date"]
    list_per_page = 10


admin.site.register(Account, AccountAdmin)
admin.site.register(Transactions, TransactionsAdmin)
admin.site.register(Card, CardAdmin)
# admin.site.register(BillInfo, BillInfoAdmin)
