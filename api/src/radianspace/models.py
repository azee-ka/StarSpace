from django.db import models
from django.utils import timezone
from ..user.models import BaseUser
import uuid

def upload_to(instance, filename):
    return f'flares/{instance.author.username}/{filename}'

class Flare(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    author = models.ForeignKey(BaseUser, on_delete=models.SET_NULL, null=True, related_name='flares')
    image = models.ImageField(upload_to='flares/', null=True, blank=True)
    video = models.FileField(upload_to='flares/', null=True, blank=True)
    caption = models.TextField(blank=True, null=True)  # Optional caption for the flare
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.PositiveIntegerField(default=0)  # Number of likes
    comments_count = models.PositiveIntegerField(default=0)  # Number of comments
    shares_count = models.PositiveIntegerField(default=0)  # Number of shares
    location_tag = models.CharField(max_length=255, blank=True, null=True)  # Geo-location tag

    # Flare Editing Features
    filters = models.JSONField(default=dict, blank=True)  # Filters applied to the flare
    collaborative = models.BooleanField(default=False)  # Whether the flare was created collaboratively

    # Story-related Features
    is_highlight = models.BooleanField(default=False)  # Is it added to highlights

    # Voting & Reactions
    creativity_votes = models.PositiveIntegerField(default=0)  # Votes on creativity
    aesthetics_votes = models.PositiveIntegerField(default=0)  # Votes on aesthetics

    # Related Files and Metadata
    tags = models.JSONField(default=list, blank=True)  # Product tags, virtual overlays, etc.
    uploaded_files = models.JSONField(default=list, blank=True)  # Additional media files

    def update_metrics(self):
        """Update metrics: likes, comments, shares, etc."""
        self.likes = self.likes
        self.comments_count = self.comments.count()
        self.shares_count = self.shares.count()
        self.save()

    def __str__(self):
        return f'Flare by {self.author.get_current_username()}'
