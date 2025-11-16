from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Set the default Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("config")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# Periodic tasks
app.conf.beat_schedule = {
    "generate-robot-data-every-5-seconds": {
        "task": "robots.tasks.generate_robot_data",
        "schedule": 5.0,  # Every 5 seconds
    },
    "broadcast-robot-updates-every-5-seconds": {
        "task": "robots.tasks.broadcast_robot_updates",
        "schedule": 5.0,  # Every 5 seconds
    },
}

app.conf.timezone = "UTC"
