from django.urls import path

from .views import (
    BookReviewListCreateView,
    ReviewDetailView,
)

urlpatterns = [

    path(
        "books/<int:book_id>/reviews/",
        BookReviewListCreateView.as_view()
    ),

    path(
        "reviews/<int:pk>/",
        ReviewDetailView.as_view()
    ),
]
