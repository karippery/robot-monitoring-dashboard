import random
import logging
from celery import shared_task
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db import transaction
from .models import Robot, RobotData
from .serializers import RobotSerializer

logger = logging.getLogger(__name__)


def _update_robot_status(robot: Robot) -> None:
    """Mutate *robot* in-place with realistic status transitions."""
    current = robot.status

    if current == "error":
        if random.random() < 0.30:  # 30% recover from error
            robot.status = "online"

    elif current == "maintenance":
        if random.random() < 0.20:  # 20% finish maintenance
            robot.status = "online"
            robot.last_maintenance = timezone.now()

    elif current == "online":
        r = random.random()
        if r < 0.02:  # 2% error
            robot.status = "error"
        elif r < 0.03:  # 1% maintenance (additional 1%)
            robot.status = "maintenance"
        elif r < 0.035:  # 0.5% offline (additional 0.5%)
            robot.status = "offline"

    elif current == "offline":
        if random.random() < 0.10:  # 10% come back online
            robot.status = "online"


def _generate_sensor_readings(robot: Robot) -> dict:
    """Return a dict ready to be **unpacked into RobotData.objects.create."""
    BASE_RANGES = {
        "welding": {"temp": (60, 120), "vib": (2, 8), "pow": (8, 15)},
        "assembly": {"temp": (25, 45), "vib": (1, 4), "pow": (3, 8)},
        "painting": {"temp": (20, 35), "vib": (0.5, 2), "pow": (2, 6)},
        "packaging": {"temp": (20, 40), "vib": (1, 5), "pow": (1, 4)},
        "inspection": {"temp": (20, 30), "vib": (0.1, 1), "pow": (0.5, 2)},
    }
    ranges = BASE_RANGES.get(robot.robot_type, BASE_RANGES["assembly"])

    # 5-second slice expressed in hours (updated from 3 to 5 seconds)
    HOURS_INC = 5 / 3600.0

    if robot.status == "online":
        # Add some realistic fluctuations
        temp_base = random.uniform(*ranges["temp"])
        vib_base = random.uniform(*ranges["vib"])
        pow_base = random.uniform(*ranges["pow"])

        data = {
            "temperature": round(temp_base + random.uniform(-2, 2), 2),
            "vibration": round(max(0, vib_base + random.uniform(-0.5, 0.5)), 2),
            "power_consumption": round(max(0, pow_base + random.uniform(-0.3, 0.3)), 2),
            "efficiency": round(random.uniform(85, 98), 2),
            "units_produced": random.randint(1, 8),
            "operational_hours": HOURS_INC,
            "error_code": None,
            "error_message": None,
        }

    elif robot.status == "error":
        err_codes = ["OVERHEAT", "VIBRATION_ALERT", "POWER_SURGE", "MOTOR_FAILURE"]
        err_msg = {
            "OVERHEAT": "Motor temperature critical",
            "VIBRATION_ALERT": "Excessive vibration detected",
            "POWER_SURGE": "Power consumption abnormal",
            "MOTOR_FAILURE": "Main motor malfunction",
        }
        code = random.choice(err_codes)

        data = {
            "temperature": round(
                random.uniform(ranges["temp"][1] + 10, ranges["temp"][1] + 50), 2
            ),
            "vibration": round(
                random.uniform(ranges["vib"][1] + 5, ranges["vib"][1] + 15), 2
            ),
            "power_consumption": round(
                random.uniform(ranges["pow"][1] + 5, ranges["pow"][1] + 20), 2
            ),
            "efficiency": round(random.uniform(0, 30), 2),
            "units_produced": 0,
            "operational_hours": HOURS_INC,
            "error_code": code,
            "error_message": err_msg[code],
        }

    elif robot.status == "maintenance":
        data = {
            "temperature": round(random.uniform(20, 30), 2),
            "vibration": round(random.uniform(0.1, 0.5), 2),
            "power_consumption": round(random.uniform(0.1, 1), 2),
            "efficiency": 0.0,
            "units_produced": 0,
            "operational_hours": 0.0,
            "error_code": None,
            "error_message": None,
        }

    else:  # offline
        data = {
            "temperature": round(random.uniform(18, 25), 2),
            "vibration": 0.0,
            "power_consumption": 0.0,
            "efficiency": 0.0,
            "units_produced": 0,
            "operational_hours": 0.0,
            "error_code": None,
            "error_message": None,
        }

    return data


@shared_task
def generate_robot_data() -> str:
    """Generate robot data every 5 seconds."""
    try:
        robots = list(Robot.objects.all())
        if not robots:
            logger.warning("No robots found in database")
            return "No robots found"

        with transaction.atomic():
            for robot in robots:
                _update_robot_status(robot)
                sensor_data = _generate_sensor_readings(robot)

                # Create new sensor data record
                RobotData.objects.create(robot=robot, **sensor_data)

                # Update cumulative counters
                robot.total_operational_hours += sensor_data["operational_hours"]
                robot.total_units_produced += sensor_data["units_produced"]

                # Save robot with updated fields
                robot.save(
                    update_fields=[
                        "status",
                        "last_maintenance",
                        "total_operational_hours",
                        "total_units_produced",
                        "updated_at",
                    ]
                )

        logger.info(f"Generated data for {len(robots)} robots")
        return f"Generated data for {len(robots)} robots"

    except Exception as e:
        logger.error(f"Error generating robot data: {e}")
        return f"Error: {str(e)}"


@shared_task
def broadcast_robot_updates() -> str:
    """Broadcast updates every 5 seconds."""
    try:
        channel_layer = get_channel_layer()

        # Optimized query with prefetch for latest data only
        from django.db.models import Prefetch

        # Prefetch only the latest sensor data for each robot
        latest_data_prefetch = Prefetch(
            "sensor_data",
            queryset=RobotData.objects.order_by("-timestamp")[:1],
            to_attr="prefetched_sensor_data",
        )

        robots = Robot.objects.prefetch_related(latest_data_prefetch).all()
        serializer = RobotSerializer(robots, many=True)

        payload = {
            "type": "robot_update",
            "update_type": "live_data",
            "robots": serializer.data,
            "timestamp": timezone.now().isoformat(),
            "total_robots": len(robots),
            "online_robots": robots.filter(status="online").count(),
            "offline_robots": robots.filter(status="offline").count(),
            "error_robots": robots.filter(status="error").count(),
            "maintenance_robots": robots.filter(status="maintenance").count(),
        }

        async_to_sync(channel_layer.group_send)("robot_updates", payload)
        return f"Broadcast sent for {len(robots)} robots"

    except Exception as e:
        logger.error(f"Broadcast failed: {str(e)}")
        return f"Broadcast failed: {str(e)}"


@shared_task
def create_initial_robots() -> str:
    """Create initial robots if none exist."""
    try:
        from django.core.management import call_command

        # Check if robots already exist
        if Robot.objects.count() == 0:
            call_command("seed_robots")
            return "Initial robots created successfully"
        else:
            return f"Robots already exist ({Robot.objects.count()} robots)"

    except Exception as e:
        logger.error(f"Error creating initial robots: {e}")
        return f"Error creating robots: {str(e)}"
