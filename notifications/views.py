from django.core.mail import send_mail

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from borrowings.models import Borrowing
from borrowings.models import Reservation


class SendReminderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, borrowing_id):

        borrowing = Borrowing.objects.get(
            id=borrowing_id
        )

        send_mail(
            subject="Book Return Reminder",
            message=(
                f"Reminder! "
                f"You must return "
                f"'{borrowing.book.title}' "
                f"before {borrowing.due_date}"
            ),
            from_email="library@example.com",
            recipient_list=[
                borrowing.user.email
            ],
            fail_silently=False,
        )

        return Response(
            {
                "message": "Reminder sent"
            }
        )
    



class ReservationNotificationView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, reservation_id):

        reservation = Reservation.objects.get(
            id=reservation_id
        )

        send_mail(
            subject="Reserved Book Available",
            message=(
                f"The book "
                f"'{reservation.book.title}' "
                f"is now available."
            ),
            from_email="library@example.com",
            recipient_list=[
                reservation.user.email
            ],
            fail_silently=False,
        )

        return Response(
            {
                "message": "Reservation notification sent"
            }
        )