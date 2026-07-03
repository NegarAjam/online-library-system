from django.db import models
from django.conf import settings

from books.models import Book


from django.db import models
from django.conf import settings
from datetime import date

from books.models import Book


class Borrowing(models.Model):

    STATUS_CHOICES = (
        ("borrowed", "Borrowed"),
        ("returned", "Returned"),
    )

    # The user who borrows the book
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    # The borrowed book
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE
    )

    # Date when the book was borrowed
    borrow_date = models.DateField(auto_now_add=True)

    # Deadline for returning the book
    due_date = models.DateField()

    # Actual return date (null if not returned yet)
    return_date = models.DateField(null=True, blank=True)

    # Fine amount for late return
    fine_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    # Status of borrowing (borrowed or returned)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="borrowed"
    )

    def __str__(self):
        return f"{self.user} - {self.book}"

    # --------------------------------------------------
    # Calculate real-time fine for overdue borrowing
    # --------------------------------------------------
    def calculate_fine(self):
        """
        Returns the current fine amount:
        - If returned: return stored fine_amount
        - If not returned: calculate based on today's date
        """

        today = date.today()

        # If book already returned, return stored fine
        if self.status == "returned" and self.return_date:
            return self.fine_amount

        # If not overdue yet, no fine
        if today <= self.due_date:
            return 0

        # Calculate overdue days
        days_late = (today - self.due_date).days

        # Fine per day (can be moved to settings later)
        FINE_PER_DAY = 1

        return days_late * FINE_PER_DAY
    

class Reservation(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE
    )

    reservation_date = models.DateTimeField(
        auto_now_add=True
    )

    is_active = models.BooleanField(
        default=True
    )

    def __str__(self):
        return f"{self.user} reserved {self.book}"