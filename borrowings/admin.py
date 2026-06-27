from django.contrib import admin

from .models import Borrowing, Reservation


admin.site.register(Borrowing)

admin.site.register(Reservation)