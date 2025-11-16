from django.apps import AppConfig


class RobotsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'robots'

    def ready(self):
        from .tasks import create_initial_robots
        try:
            create_initial_robots.delay()
        except Exception:
            pass
