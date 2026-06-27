from datetime import timedelta
from django.utils import timezone

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from books.models import Book
from .models import Borrowing

from datetime import date

from .models import Reservation

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from .serializers import BorrowingSerializer
from .serializers import ReservationSerializer
from .models import Borrowing  

class BorrowBookView(APIView):

    def post(self, request, book_id):

        book = Book.objects.get(id=book_id)

        if book.available_copies <= 0:

            return Response(
                {"error": "No copies available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        due_date = timezone.now().date() + timedelta(days=14)

        borrowing = Borrowing.objects.create(
            user=request.user,
            book=book,
            due_date=due_date
        )

        book.available_copies -= 1
        book.save()

        return Response(
            {
                "message": "Book borrowed successfully",
                "due_date": due_date
            }
        )
    


class ReturnBookView(APIView):

    def post(self, request, borrowing_id):

        borrowing = Borrowing.objects.get(
            id=borrowing_id
        )

        borrowing.status = "returned"

        borrowing.return_date = date.today()

        days_late = (
            borrowing.return_date -
            borrowing.due_date
        ).days

        if days_late > 0:

            borrowing.fine_amount = days_late * 5000

        borrowing.save()

        book = borrowing.book

        book.available_copies += 1

        book.save()

        return Response(
            {
                "message": "Book returned",
                "fine": borrowing.fine_amount
            }
        )
    
class ReserveBookView(APIView):

    def post(self, request, book_id):

        book = Book.objects.get(id=book_id)

        if book.available_copies > 0:

            return Response(
                {
                    "error": "Book available. No need to reserve."
                },
                status=400
            )

        Reservation.objects.create(
            user=request.user,
            book=book
        )

        return Response(
            {
                "message": "Reservation created"
            }
        )
    
class MyBorrowingsView(ListAPIView):

    serializer_class = BorrowingSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Borrowing.objects.filter(
            user=self.request.user
        ).order_by("-borrow_date")
    
class MyReservationsView(ListAPIView):

    serializer_class = ReservationSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Reservation.objects.filter(
            user=self.request.user
        ).order_by("-reservation_date")