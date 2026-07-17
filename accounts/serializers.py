from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    role = serializers.ChoiceField(
        choices=User.ROLE_CHOICES,
        default="member"
    )

    class Meta:
        model = User

        fields = (
            "id",
            "username",
            "email",
            "password",
            "role",
        )

    def create(self, validated_data):

        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data.get("role", "member"),
        )


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
        )

        read_only_fields = (
            "id",
            "username",
            "role",
        )