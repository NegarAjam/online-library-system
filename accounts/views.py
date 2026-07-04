from rest_framework.generics import CreateAPIView

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import RegisterSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import UserProfileSerializer

from rest_framework import status

class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):

        data = super().validate(attrs)

        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "role": self.user.role,
        }

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserProfileSerializer(
            request.user
        )

        return Response(serializer.data)

    def put(self, request):

        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(serializer.data)
    
class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        current_password = request.data.get(
            "current_password"
        )

        new_password = request.data.get(
            "new_password"
        )

        confirm_password = request.data.get(
            "confirm_password"
        )

        if not request.user.check_password(
            current_password
        ):
            return Response(
                {
                    "error": "Current password is incorrect"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
            return Response(
                {
                    "error": "Passwords do not match"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {
                    "error": "Password must be at least 8 characters"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.set_password(
            new_password
        )

        request.user.save()

        return Response(
            {
                "message": "Password updated successfully"
            }
        )