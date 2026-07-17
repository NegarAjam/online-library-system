from django.urls import path

from .views import (
    SendReminderView,
    ReservationNotificationView,
    NotificationListView,
    MarkNotificationReadView,
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

    path(
        "notifications/",
        NotificationListView.as_view()
    ),

    path(
        "notifications/<int:notification_id>/read/",
        MarkNotificationReadView.as_view()
    ),
]
