from django.core.management.base import BaseCommand
from robots.models import Robot


class Command(BaseCommand):
    help = "Seed the database with initial robots"

    def handle(self, *args, **options):
        robots_data = [
            {
                "name": "Welder-001",
                "robot_type": "welding",
                "status": "online",
                "location": "Assembly Line A",
                "ip_address": "192.168.1.101",
            },
            {
                "name": "Assembler-001",
                "robot_type": "assembly",
                "status": "online",
                "location": "Assembly Line B",
                "ip_address": "192.168.1.102",
            },
            {
                "name": "Painter-001",
                "robot_type": "painting",
                "status": "online",
                "location": "Paint Station 1",
                "ip_address": "192.168.1.103",
            },
            {
                "name": "Packager-001",
                "robot_type": "packaging",
                "status": "online",
                "location": "Packaging Line A",
                "ip_address": "192.168.1.104",
            },
            {
                "name": "Inspector-001",
                "robot_type": "inspection",
                "status": "online",
                "location": "Quality Control",
                "ip_address": "192.168.1.105",
            },
            {
                "name": "Welder-002",
                "robot_type": "welding",
                "status": "maintenance",
                "location": "Assembly Line C",
                "ip_address": "192.168.1.106",
            },
            {
                "name": "Assembler-002",
                "robot_type": "assembly",
                "status": "offline",
                "location": "Assembly Line D",
                "ip_address": "192.168.1.107",
            },
        ]

        created_count = 0
        for robot_data in robots_data:
            robot, created = Robot.objects.get_or_create(
                name=robot_data["name"], defaults=robot_data
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {created_count} robots. Total robots: {Robot.objects.count()}"
            )
        )
