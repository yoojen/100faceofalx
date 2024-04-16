from django.contrib import admin
from .models import (Account,
                     Transactions,
                     Card,
                     BillInfo
                     )
from profiles.admin import CustomerProfileInline


class AccountAdmin(admin.ModelAdmin):
    search_fields = ["account_num__exact"]
    list_per_page = 10
    list_display = ["account_num", "customer", "balance", "date_opened"]


class TransactionsAdmin(admin.ModelAdmin):
    search_fields = ["account__exact"]
    list_display = ["account", "amount", "date_done", "description"]
    list_per_page = 10


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
