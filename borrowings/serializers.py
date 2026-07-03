from rest_framework import serializers
from .models import Borrowing, Reservation


class BorrowingSerializer(serializers.ModelSerializer):

    # Book title (read-only)
    book_title = serializers.CharField(source="book.title", read_only=True)

    # Book live fine (real-time calculation)
    live_fine = serializers.SerializerMethodField()

    class Meta:
        model = Borrowing
        fields = [
            "id",
            "book",
            "book_title",
            "borrow_date",
            "due_date",
            "return_date",
            "fine_amount",
            "status",
            "live_fine",   # 🔥 added
        ]

    def get_live_fine(self, obj):
        """
        Returns real-time fine using model method
        """
        if hasattr(obj, "calculate_fine"):
            return obj.calculate_fine()
        return 0


class ReservationSerializer(serializers.ModelSerializer):

    book_title = serializers.CharField(source="book.title", read_only=True)

    class Meta:
        model = Reservation
        fields = [
            "id",
            "book",
            "book_title",
            "reservation_date",
            "is_active",
        ]