from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("user", "borrowing", "amount", "status", "created_at", "paid_at")
    list_filter = ("status",)
    search_fields = ("user__username", "transaction_id")
