from django.urls import path

from .views import (
    PayFineView,
    MyPaymentsView,
)

urlpatterns = [

    path(
        "payments/pay/<int:borrowing_id>/",
        PayFineView.as_view()
    ),

    path(
        "payments/my-payments/",
        MyPaymentsView.as_view()
    ),
]
