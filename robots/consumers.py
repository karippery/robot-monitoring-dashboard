import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Robot
from .serializers import RobotSerializer

logger = logging.getLogger(__name__)


class RobotMonitorConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Load data first
        try:
            robots = await self.get_robots_with_latest_data()
        except Exception as e:
            logger.error(f"WebSocket connection error: {e}")
            await self.close(code=1011, reason="Server error")
            return

        # Accept connection
        await self.accept()

        # Join group
        await self.channel_layer.group_add("robot_updates", self.channel_name)

        # Send initial payload
        await self.send(
            text_data=json.dumps({"type": "initial_data", "robots": robots})
        )

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard("robot_updates", self.channel_name)
        except Exception as e:
            logger.error(f"WebSocket disconnect error: {e}")

    async def receive(self, text_data):
        # Optional – ignore incoming messages for now
        pass

    # Called by channel_layer.group_send
    async def robot_update(self, event):
        try:
            await self.send(text_data=json.dumps(event))
        except Exception as e:
            logger.error(f"WebSocket send error: {e}")

    @database_sync_to_async
    def get_robots_with_latest_data(self):
        try:
            robots = Robot.objects.all().prefetch_related("sensor_data")
            return RobotSerializer(robots, many=True).data
        except Exception as e:
            logger.error(f"Error fetching robots data: {e}")
            return []
