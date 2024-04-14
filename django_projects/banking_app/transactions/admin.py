from django.contrib import admin
from .models import (Account,
                    Transactions,
                    Card,
                    BillInfo
                    )
admin.site.register([Account, Transactions, Card, BillInfo])
