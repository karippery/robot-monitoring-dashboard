from rest_framework import serializers
from .models import Robot, RobotData


class RobotDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = RobotData
        fields = "__all__"


class RobotSerializer(serializers.ModelSerializer):
    latest_data = serializers.SerializerMethodField()

    class Meta:
        model = Robot
        fields = "__all__"

    def get_latest_data(self, obj) -> dict | None:
        """
        Get the latest sensor data for the robot.

        Returns:
            dict | None: Serialized RobotData or None if no data exists
        """
        # Use prefetched data to avoid N+1 queries
        if hasattr(obj, "prefetched_sensor_data"):
            data = obj.prefetched_sensor_data
            latest = data[0] if data else None
        else:
            # Fallback: get first from related manager (should be prefetched)
            latest = obj.sensor_data.first()
        return RobotDataSerializer(latest).data if latest else None


class RobotDetailSerializer(RobotSerializer):
    sensor_data = RobotDataSerializer(many=True, read_only=True)

    class Meta(RobotSerializer.Meta):
        fields = [
            "id",
            "name",
            "robot_type",
            "status",
            "location",
            "ip_address",
            "last_maintenance",
            "total_operational_hours",
            "total_units_produced",
            "created_at",
            "updated_at",
            "latest_data",
            "sensor_data",
        ]
