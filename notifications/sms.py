def send_sms(phone_number, message):
    """
    Mock SMS gateway - no real provider credentials are configured,
    so messages are logged instead of dispatched.
    """
    print(f"[SMS to {phone_number}]: {message}")
