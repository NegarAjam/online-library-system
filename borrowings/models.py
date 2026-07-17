from django.db import models
from django.conf import settings
from datetime import date

from books.models import Book


class Borrowing(models.Model):
    """
    Represents a book borrowing record.
    """

    STATUS_CHOICES = (
        ("borrowed", "Borrowed"),
        ("returned", "Returned"),
    )

    # ----------------------------
    # Relations
    # ----------------------------
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="borrowings"
    )

    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name="borrowings"
    )

    # ----------------------------
    # Dates
    # ----------------------------
    borrow_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)

    # ----------------------------
    # Borrow Settings
    # ----------------------------
    borrow_days = models.PositiveIntegerField(
        default=14
    )

    # ----------------------------
    # Financial
    # ----------------------------
    fine_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    is_fine_paid = models.BooleanField(
        default=False
    )

    # ----------------------------
    # Notifications
    # ----------------------------
    last_reminder_sent = models.DateField(
        null=True,
        blank=True
    )

    # ----------------------------
    # Status
    # ----------------------------
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="borrowed"
    )

    # ----------------------------
    # String representation
    # ----------------------------
    def __str__(self):
        return f"{self.user} - {self.book}"

    # ----------------------------
    # Fine calculation (real-time)
    # ----------------------------
    def calculate_fine(self):
        """
        Calculate current fine based on due_date.
        Works for both returned and not returned books.
        """

        today = date.today()

        # If already returned → return stored value
        if self.status == "returned" and self.return_date:
            return self.fine_amount

        # Not overdue yet
        if today <= self.due_date:
            return 0

        # Overdue calculation
        days_late = (today - self.due_date).days

        FINE_PER_DAY = 1  # can move to settings later

        return days_late * FINE_PER_DAY


class Reservation(models.Model):
    """
    Represents a reservation when a book is unavailable.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reservations"
    )

    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name="reservations"
    )

    reservation_date = models.DateTimeField(auto_now_add=True)

    # Whether reservation is still active
    is_active = models.BooleanField(default=True)

    # NEW: desired borrow duration when auto-converting to borrow
    borrow_days = models.PositiveIntegerField(default=14)

    def __str__(self):
        return f"{self.user} reserved {self.book}"