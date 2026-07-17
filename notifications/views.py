from django.shortcuts import get_object_or_404

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from borrowings.models import Borrowing
from borrowings.models import Reservation

from .models import Notification
from .permissions import IsAdminRole
from .serializers import NotificationSerializer
from .services import notify_user


class SendReminderView(APIView):

    permission_classes = [IsAdminRole]

    def post(self, request, borrowing_id):

        borrowing = get_object_or_404(
            Borrowing,
            id=borrowing_id
        )

        notify_user(
            borrowing.user,
            (
                f"Reminder! "
                f"You must return "
                f"'{borrowing.book.title}' "
                f"before {borrowing.due_date}"
            ),
            notif_type="reminder",
            subject="Book Return Reminder",
        )

        return Response(
            {
                "message": "Reminder sent"
            }
        )


class ReservationNotificationView(APIView):

    permission_classes = [IsAdminRole]

    def post(self, request, reservation_id):

        reservation = get_object_or_404(
            Reservation,
            id=reservation_id
        )

        notify_user(
            reservation.user,
            (
                f"The book "
                f"'{reservation.book.title}' "
                f"is now available."
            ),
            notif_type="reservation",
            subject="Reserved Book Available",
        )

        return Response(
            {
                "message": "Reservation notification sent"
            }
        )


class NotificationListView(ListAPIView):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        )


class MarkNotificationReadView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):

        notification = get_object_or_404(
            Notification,
            id=notification_id,
            user=request.user
        )

        notification.is_read = True
        notification.save(update_fields=["is_read"])

        return Response(
            {
                "message": "Notification marked as read"
            }
        )
