from datetime import date, timedelta

from django.core.management.base import BaseCommand

from borrowings.models import Borrowing
from notifications.services import notify_user


class Command(BaseCommand):
    """
    Sends due-date reminders and overdue notices for active borrowings.
    Intended to be run once a day (cron / Windows Task Scheduler).
    """

    help = "Send due-date reminders and overdue notices for active borrowings"

    def handle(self, *args, **options):

        today = date.today()
        upcoming_threshold = today + timedelta(days=2)

        borrowings = Borrowing.objects.filter(
            status="borrowed",
            due_date__lte=upcoming_threshold,
        ).exclude(
            last_reminder_sent=today
        )

        sent_count = 0

        for borrowing in borrowings:

            days_left = (borrowing.due_date - today).days

            if days_left < 0:
                message = (
                    f"Your borrowed book '{borrowing.book.title}' is "
                    f"{abs(days_left)} day(s) overdue. Current fine: "
                    f"{borrowing.calculate_fine()}"
                )
                notif_type = "overdue"
            else:
                message = (
                    f"Reminder: '{borrowing.book.title}' is due on "
                    f"{borrowing.due_date}."
                )
                notif_type = "reminder"

            notify_user(
                borrowing.user,
                message,
                notif_type=notif_type,
                subject="Book Return Reminder",
            )

            borrowing.last_reminder_sent = today
            borrowing.save(update_fields=["last_reminder_sent"])

            sent_count += 1

        self.stdout.write(
            self.style.SUCCESS(f"Sent {sent_count} reminder(s).")
        )
