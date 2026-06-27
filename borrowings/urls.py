from django.urls import path

from .views import (
    BorrowBookView,
    ReturnBookView,
    ReserveBookView
)

urlpatterns = [

    path(
        "borrow/<int:book_id>/",
        BorrowBookView.as_view()
    ),

    path(
        "return/<int:borrowing_id>/",
        ReturnBookView.as_view()
    ),

    path(
        "reserve/<int:book_id>/",
        ReserveBookView.as_view()
    ),
]