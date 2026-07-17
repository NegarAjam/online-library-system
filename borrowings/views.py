from datetime import timedelta, date

from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from books.models import Book
from notifications.services import notify_user
from .models import Borrowing, Reservation
from .serializers import BorrowingSerializer, ReservationSerializer


# =========================================================
# BORROW BOOK
# =========================================================
class BorrowBookView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)

        # Prevent duplicate borrowing
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

        # Borrow duration (7, 14, 21 days only)
        try:
            days = int(request.data.get("days", 14))
        except (ValueError, TypeError):
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
            borrow_days=days,
            status="borrowed",
        )

        book.available_copies -= 1
        book.save()

        return Response({
            "message": "Book borrowed successfully",
            "borrow_days": days,
            "due_date": due_date
        })


# =========================================================
# RETURN BOOK
# =========================================================
class ReturnBookView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, borrowing_id):
        borrowing = get_object_or_404(Borrowing, id=borrowing_id)

        if borrowing.status == "returned":
            return Response(
                {"error": "Book already returned"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate fine using model method before flipping status,
        # since calculate_fine() short-circuits once status is "returned"
        borrowing.fine_amount = borrowing.calculate_fine()

        borrowing.status = "returned"
        borrowing.return_date = date.today()
        borrowing.save()

        # Restore inventory
        book = borrowing.book
        book.available_copies += 1
        book.save()

        if borrowing.fine_amount > 0:
            notify_user(
                borrowing.user,
                (
                    f"You have a fine of {borrowing.fine_amount} for "
                    f"returning '{book.title}' late. "
                    f"Please pay it online."
                ),
                notif_type="fine",
                subject="Overdue Fine Notice",
            )

        return Response({
            "message": "Book returned successfully",
            "fine": borrowing.fine_amount
        })


# =========================================================
# RESERVE BOOK (WITH AUTO BORROW SUPPORT)
# =========================================================
class ReserveBookView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)

        # Prevent duplicate reservation
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

        # If book is available → no need to reserve
        if book.available_copies > 0:
            return Response(
                {"error": "Book is available. No need to reserve."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Borrow days from reservation request (default 14)
        try:
            borrow_days = int(request.data.get("days", 14))
        except (ValueError, TypeError):
            borrow_days = 14

        if borrow_days not in [7, 14, 21]:
            borrow_days = 14

        with transaction.atomic():

            Reservation.objects.create(
                user=request.user,
                book=book,
                is_active=True,
                borrow_days=borrow_days
            )

        return Response({
            "message": "Reservation created successfully",
            "borrow_days": borrow_days
        })


# =========================================================
# MY BORROWINGS
# =========================================================
class MyBorrowingsView(ListAPIView):

    serializer_class = BorrowingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Borrowing.objects.filter(
            user=self.request.user
        ).order_by("-borrow_date")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        data = serializer.data

        # Add real-time fine calculation
        for i, obj in enumerate(queryset):
            data[i]["live_fine"] = obj.calculate_fine()

        return Response(data)


# =========================================================
# MY RESERVATIONS
# =========================================================
class MyReservationsView(ListAPIView):

    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(
            user=self.request.user
        ).order_by("-reservation_date")