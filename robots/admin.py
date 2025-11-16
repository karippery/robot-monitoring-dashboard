from django.contrib import admin
from .models import Robot, RobotData


@admin.register(Robot)
class RobotAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'robot_type', 'status',
        'location', 'total_units_produced'
        ]
    list_filter = ['status', 'robot_type', 'location']
    search_fields = ['name', 'location']


@admin.register(RobotData)
class RobotDataAdmin(admin.ModelAdmin):
    list_display = ['robot', 'timestamp',
                    'temperature', 'vibration', 'efficiency']
    list_filter = ['robot', 'timestamp']
    readonly_fields = ['timestamp']