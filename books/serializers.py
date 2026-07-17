from django.db.models import Avg

from rest_framework import serializers

from .models import Book


class BookSerializer(serializers.ModelSerializer):

    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "genre",
            "publication_year",
            "available_copies",
            "created_at",
            "updated_at",
            "average_rating",
            "review_count",
        ]

    def get_average_rating(self, obj):

        average = obj.reviews.aggregate(
            average=Avg("rating")
        )["average"]

        return round(average, 1) if average else 0

    def get_review_count(self, obj):
        return obj.reviews.count()