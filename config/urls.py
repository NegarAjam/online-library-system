from django.contrib import admin
from django.urls import path, include
from accounts.views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [

    path("admin/", admin.site.urls),

    path(
        "api/",
        include("accounts.urls")
    ),

    path(
        "api/login/",
        MyTokenObtainPairView.as_view(),
        name="token_obtain_pair"
    ),

    path(
        "api/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),

    path(
        "api/",
        include("books.urls")
    ),

    path(
        "api/",
        include("borrowings.urls")
    ),

    path(
        "api/",
        include("notifications.urls")
    ),
]