from django.db.models import Count, Sum

from rest_framework.views import APIView
from rest_framework.response import Response

from .permissions import IsAdminRole

from books.models import Book
from borrowings.models import Borrowing


class AdminDashboardView(APIView):

    permission_classes = [IsAdminRole]

    def get(self, request):

        # =========================
        # General Book Stats
        # =========================
        total_books = Book.objects.count()

        borrowed_books = Borrowing.objects.filter(
            status="borrowed"
        ).count()

        available_books = (
            Book.objects.aggregate(
                total=Sum("available_copies")
            )["total"] or 0
        )

        # =========================
        # Most Popular Books
        # =========================
        popular_books = (
            Borrowing.objects.values(
                "book__title"
            )
            .annotate(
                borrow_count=Count("id")
            )
            .order_by("-borrow_count")[:5]
        )

        # =========================
        # Users With Fines
        # =========================
        users_with_fines = (
            Borrowing.objects.filter(
                fine_amount__gt=0
            )
            .values(
                "user__username"
            )
            .annotate(
                total_fine=Sum("fine_amount")
            )
            .order_by("-total_fine")
        )

        # =========================
        # Member Performance
        # =========================
        member_performance = (
            Borrowing.objects.values(
                "user__username"
            )
            .annotate(
                total_borrowed=Count("id"),
                total_fines=Sum("fine_amount")
            )
            .order_by("-total_borrowed")
        )

        return Response(
            {
                "total_books": total_books,
                "borrowed_books": borrowed_books,
                "available_books": available_books,
                "popular_books": popular_books,
                "users_with_fines": users_with_fines,
                "member_performance": member_performance,
            }
        )