from django.core.mail import send_mail

from .models import Notification
from .sms import send_sms


def notify_user(user, message, notif_type="system", subject="Library Notification"):
    """
    Persists an in-app notification and best-effort dispatches it
    over email and SMS.
    """

    Notification.objects.create(
        user=user,
        message=message,
        notif_type=notif_type,
    )

    if user.email:
        send_mail(
            subject=subject,
            message=message,
            from_email="library@example.com",
            recipient_list=[user.email],
            fail_silently=True,
        )

    phone_number = getattr(user, "phone_number", "")

    if phone_number:
        send_sms(phone_number, message)
