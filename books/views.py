from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets
from rest_framework.filters import SearchFilter

from .models import Book
from .serializers import BookSerializer
from .permissions import IsAdminRole


class BookViewSet(viewsets.ModelViewSet):

    queryset = Book.objects.all()

    serializer_class = BookSerializer

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
    ]

    filterset_fields = [
        "author",
        "genre",
        "publication_year",
    ]

    search_fields = [
        "title",
        "author",
    ]

    def get_permissions(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
            "destroy",
        ]:
            return [IsAdminRole()]

        return []