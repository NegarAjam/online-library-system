from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta

from books.models import Book
from notifications.services import notify_user
from .models import Reservation, Borrowing


@receiver(post_save, sender=Book)
def handle_book_availability(sender, instance, **kwargs):
    """
    Automatically convert reservations to borrowings
    when copies become available.
    """

    book = instance

    while book.available_copies > 0:

        reservation = Reservation.objects.filter(
            book=book,
            is_active=True
        ).order_by("reservation_date").first()

        if not reservation:
            break

        borrow_days = getattr(
            reservation,
            "borrow_days",
            14
        )

        due_date = (
            timezone.now().date() +
            timedelta(days=borrow_days)
        )

        Borrowing.objects.create(
            user=reservation.user,
            book=book,
            due_date=due_date,
            status="borrowed"
        )

        reservation.is_active = False
        reservation.save(update_fields=["is_active"])

        notify_user(
            reservation.user,
            (
                f"Your reservation for '{book.title}' is now available "
                f"and has been borrowed for you until {due_date}."
            ),
            notif_type="reservation",
            subject="Reserved Book Available",
        )

        book.available_copies -= 1

    Book.objects.filter(
        id=book.id
    ).update(
        available_copies=book.available_copies
    )