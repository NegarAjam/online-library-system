from django.conf import settings
from django.db import models

from borrowings.models import Borrowing


class Payment(models.Model):
    """
    A record of an online fine payment for a borrowing.
    """

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    borrowing = models.ForeignKey(
        Borrowing,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    transaction_id = models.CharField(
        max_length=64,
        unique=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    paid_at = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.amount} ({self.status})"
