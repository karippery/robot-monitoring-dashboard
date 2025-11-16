from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import Prefetch
from .models import Robot, RobotData
from .serializers import (
    RobotSerializer,
    RobotDetailSerializer,
    RobotDataSerializer,
)


class RobotViewSet(viewsets.ModelViewSet):
    queryset = Robot.objects.all()

    def get_queryset(self):
        # Optimize query by prefetching only the latest sensor data
        queryset = Robot.objects.all()

        if self.action == 'list':
            # For list view, prefetch only the latest sensor data
            latest_data_prefetch = Prefetch(
                'sensor_data',
                queryset=RobotData.objects.order_by('-timestamp')[:1],
                to_attr='prefetched_sensor_data'
            )
            queryset = queryset.prefetch_related(latest_data_prefetch)
        elif self.action == 'retrieve':
            # For detail view, prefetch all sensor data
            queryset = queryset.prefetch_related('sensor_data')

        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RobotDetailSerializer
        return RobotSerializer

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        robot = self.get_object()

        # Get time range from query parameters
        hours = int(request.query_params.get('hours', 24))
        since = timezone.now() - timedelta(hours=hours)

        data = robot.sensor_data.filter(
            timestamp__gte=since
        ).order_by('-timestamp')

        page = self.paginate_queryset(data)

        if page is not None:
            serializer = RobotDataSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = RobotDataSerializer(data, many=True)
        return Response(serializer.data)


class RobotDataViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RobotDataSerializer

    def get_queryset(self):
        queryset = RobotData.objects.all().select_related('robot')
        robot_id = self.request.query_params.get('robot_id')
        if robot_id:
            queryset = queryset.filter(robot_id=robot_id)
        return queryset.order_by('-timestamp')
