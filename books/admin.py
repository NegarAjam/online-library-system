from django.contrib import admin

from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "title",
        "author",
        "genre",
        "publication_year",
        "available_copies",
    )

    search_fields = (
        "title",
        "author",
    )

    list_filter = (
        "genre",
        "publication_year",
    )