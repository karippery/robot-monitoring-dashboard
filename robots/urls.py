from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"robots", views.RobotViewSet)
router.register(r"robot-data", views.RobotDataViewSet, basename="robotdata")

urlpatterns = [
    path("", include(router.urls)),
]
