from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    book_title = serializers.CharField(
        source="borrowing.book.title",
        read_only=True
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "borrowing",
            "book_title",
            "amount",
            "transaction_id",
            "status",
            "created_at",
            "paid_at",
        ]
