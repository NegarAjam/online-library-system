from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets
from rest_framework.filters import SearchFilter

from .models import Book
from .serializers import BookSerializer
from .permissions import IsAdminRole


class BookViewSet(viewsets.ModelViewSet):

    serializer_class = BookSerializer

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
    ]

    search_fields = [
        "title",
        "author",
    ]

    queryset = Book.objects.all()

    def get_queryset(self):

        queryset = Book.objects.all()

        author = self.request.query_params.get("author")
        genre = self.request.query_params.get("genre")
        year = self.request.query_params.get("publication_year")

        if author:
            queryset = queryset.filter(
                author__icontains=author
            )

        if genre:
            queryset = queryset.filter(
                genre__icontains=genre
            )

        if year:
            queryset = queryset.filter(
                publication_year=year
            )

        return queryset

    def get_permissions(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
            "destroy",
        ]:
            return [IsAdminRole()]

        return []