from django.conf import settings
from django.db import models


class Notification(models.Model):
    """
    An in-app notification/reminder record for a user.
    """

    TYPE_CHOICES = (
        ("reminder", "Due Date Reminder"),
        ("overdue", "Overdue Notice"),
        ("reservation", "Reservation Available"),
        ("fine", "Fine Incurred"),
        ("payment", "Payment Confirmation"),
        ("system", "System"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    message = models.TextField()

    notif_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default="system"
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.notif_type}"
