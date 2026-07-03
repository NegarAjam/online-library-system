from datetime import timedelta, date

from django.utils import timezone
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from books.models import Book
from .models import Borrowing, Reservation
from .serializers import BorrowingSerializer, ReservationSerializer


# ----------------------------
# Borrow Book
# ----------------------------
class BorrowBookView(APIView):

    def post(self, request, book_id):

        book = get_object_or_404(Book, id=book_id)

        # جلوگیری از Borrow تکراری
        existing_borrow = Borrowing.objects.filter(
            user=request.user,
            book=book,
            status="borrowed"
        ).exists()

        if existing_borrow:
            return Response(
                {"error": "You already borrowed this book"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if book.available_copies <= 0:
            return Response(
                {"error": "No copies available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # مدت امانت
        try:
            days = int(request.data.get("days", 14))
        except ValueError:
            return Response(
                {"error": "Invalid borrow period"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if days not in [7, 14, 21]:
            return Response(
                {"error": "Borrow period must be 7, 14 or 21 days"},
                status=status.HTTP_400_BAD_REQUEST
            )

        due_date = timezone.now().date() + timedelta(days=days)

        Borrowing.objects.create(
            user=request.user,
            book=book,
            due_date=due_date,
            status="borrowed",
        )

        book.available_copies -= 1
        book.save()

        return Response(
            {
                "message": "Book borrowed successfully",
                "borrow_days": days,
                "due_date": due_date
            }
        )


# ----------------------------
# Return Book
# ----------------------------
class ReturnBookView(APIView):

    def post(self, request, borrowing_id):

        borrowing = get_object_or_404(
            Borrowing,
            id=borrowing_id
        )

        if borrowing.status == "returned":
            return Response(
                {"error": "Book already returned"},
                status=status.HTTP_400_BAD_REQUEST
            )

        borrowing.status = "returned"
        borrowing.return_date = date.today()

        # calculate_fine (clean & reusable)
        borrowing.fine_amount = borrowing.calculate_fine()

        borrowing.save()

        # return book to inventory
        book = borrowing.book
        book.available_copies += 1
        book.save()

        return Response({
            "message": "Book returned successfully",
            "fine": borrowing.fine_amount
        })

# ----------------------------
# Reserve Book
# ----------------------------
class ReserveBookView(APIView):

    def post(self, request, book_id):

        book = get_object_or_404(Book, id=book_id)

        existing_reservation = Reservation.objects.filter(
            user=request.user,
            book=book,
            is_active=True
        ).exists()

        if existing_reservation:
            return Response(
                {"error": "You already reserved this book"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if book.available_copies > 0:
            return Response(
                {"error": "Book available. No need to reserve."},
                status=status.HTTP_400_BAD_REQUEST
            )

        Reservation.objects.create(
            user=request.user,
            book=book,
            is_active=True
        )

        return Response(
            {
                "message": "Reservation created successfully"
            }
        )


# ----------------------------
# My Borrowings
# ----------------------------
class MyBorrowingsView(ListAPIView):

    serializer_class = BorrowingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Borrowing.objects.filter(
            user=self.request.user
        ).order_by("-borrow_date")

    # override response for real-time fine
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        data = serializer.data

        # add live fine for each borrowing
        for i, obj in enumerate(queryset):
            data[i]["live_fine"] = obj.calculate_fine()

        return Response(data)

# ----------------------------
# My Reservations
# ----------------------------
class MyReservationsView(ListAPIView):

    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(
            user=self.request.user
        ).order_by("-reservation_date")