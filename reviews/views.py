from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions

from books.models import Book
from .models import Review
from .serializers import ReviewSerializer


class BookReviewListCreateView(generics.ListCreateAPIView):
    """
    List reviews for a book, or submit/update the current user's
    own rating and comment for it.
    """

    serializer_class = ReviewSerializer

    def get_permissions(self):

        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def get_queryset(self):
        return Review.objects.filter(
            book_id=self.kwargs["book_id"]
        )

    def perform_create(self, serializer):

        book = get_object_or_404(
            Book,
            id=self.kwargs["book_id"]
        )

        review, _ = Review.objects.update_or_create(
            book=book,
            user=self.request.user,
            defaults={
                "rating": serializer.validated_data["rating"],
                "comment": serializer.validated_data.get("comment", ""),
            },
        )

        serializer.instance = review


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Allows a member to update or delete their own review.
    """

    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(
            user=self.request.user
        )
