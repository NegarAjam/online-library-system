from django.urls import path

from .views import (
    SendReminderView,
    ReservationNotificationView,
)

urlpatterns = [

    path(
        "reminder/<int:borrowing_id>/",
        SendReminderView.as_view()
    ),

    path(
        "reservation-notification/<int:reservation_id>/",
        ReservationNotificationView.as_view()
    ),
]