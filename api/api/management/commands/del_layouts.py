# your_app/management/commands/delete_all.py
from django.core.management.base import BaseCommand
from src.page.models import PageLayout

class Command(BaseCommand):
    help = 'Deletes all instances of the models'

    def handle(self, *args, **kwargs):
        # Deleting all instances of models
        deleted_layouts = PageLayout.objects.all().delete()

        self.stdout.write(self.style.SUCCESS(f'{deleted_layouts[0]} page layouts deleted.'))
