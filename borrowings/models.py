from django.db import models
from django.conf import settings

from books.models import Book


class Borrowing(models.Model):

    STATUS_CHOICES = (
        ("borrowed", "Borrowed"),
        ("returned", "Returned"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE
    )

    borrow_date = models.DateField(
        auto_now_add=True
    )

    due_date = models.DateField()

    return_date = models.DateField(
        null=True,
        blank=True
    )

    fine_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="borrowed"
    )

    def __str__(self):
        return f"{self.user} - {self.book}"
    

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