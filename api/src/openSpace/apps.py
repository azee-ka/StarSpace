from django.apps import AppConfig

class OpenspaceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'src.openspace'

    def ready(self):
        import src.openspace.signals  # Load signals when the app is ready
