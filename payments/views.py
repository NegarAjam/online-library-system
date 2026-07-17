import uuid

from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from borrowings.models import Borrowing
from notifications.services import notify_user
from .models import Payment
from .serializers import PaymentSerializer


# =========================================================
# PAY FINE (mock online payment gateway)
# =========================================================
class PayFineView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, borrowing_id):

        borrowing = get_object_or_404(
            Borrowing,
            id=borrowing_id,
            user=request.user
        )

        if borrowing.status != "returned":
            return Response(
                {"error": "Fine can only be paid after the book is returned"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if borrowing.is_fine_paid:
            return Response(
                {"error": "Fine already paid"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if borrowing.fine_amount <= 0:
            return Response(
                {"error": "No fine to pay"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mock payment gateway: transaction is approved instantly.
        payment = Payment.objects.create(
            user=request.user,
            borrowing=borrowing,
            amount=borrowing.fine_amount,
            transaction_id=uuid.uuid4().hex,
            status="completed",
            paid_at=timezone.now(),
        )

        borrowing.is_fine_paid = True
        borrowing.save(update_fields=["is_fine_paid"])

        notify_user(
            request.user,
            (
                f"Your fine payment of {payment.amount} for "
                f"'{borrowing.book.title}' was completed successfully."
            ),
            notif_type="payment",
            subject="Fine Payment Confirmation",
        )

        return Response(
            {
                "message": "Payment completed successfully",
                "transaction_id": payment.transaction_id,
                "amount": payment.amount,
            }
        )


# =========================================================
# MY PAYMENTS
# =========================================================
class MyPaymentsView(ListAPIView):

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(
            user=self.request.user
        )
