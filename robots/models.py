from django.db import models
from django.utils import timezone


class Robot(models.Model):
    STATUS_CHOICES = [
        ("online", "Online"),
        ("offline", "Offline"),
        ("maintenance", "Maintenance"),
        ("error", "Error"),
    ]

    ROBOT_TYPES = [
        ("welding", "Welding Robot"),
        ("assembly", "Assembly Robot"),
        ("painting", "Painting Robot"),
        ("packaging", "Packaging Robot"),
        ("inspection", "Inspection Robot"),
    ]

    name = models.CharField(max_length=100, unique=True)
    robot_type = models.CharField(
        max_length=20, choices=ROBOT_TYPES, default="assembly"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="offline")
    location = models.CharField(max_length=100, default="Production Line A")
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    last_maintenance = models.DateTimeField(default=timezone.now)
    total_operational_hours = models.FloatField(default=0.0)
    total_units_produced = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_robot_type_display()})"


class RobotData(models.Model):
    robot = models.ForeignKey(
        Robot, on_delete=models.CASCADE, related_name="sensor_data"
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    # Sensor readings
    temperature = models.FloatField(help_text="Temperature in °C")
    vibration = models.FloatField(help_text="Vibration level in mm/s")
    power_consumption = models.FloatField(help_text="Power consumption in kW")
    efficiency = models.FloatField(help_text="Efficiency percentage 0-100%")

    # Production metrics (per snapshot)
    units_produced = models.IntegerField(default=0)
    operational_hours = models.FloatField(default=0.0)

    # Error information
    error_code = models.CharField(max_length=50, blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["robot", "timestamp"]),
            models.Index(fields=["timestamp"]),
        ]

    def __str__(self):
        return f"{self.robot.name} - {self.timestamp}"
