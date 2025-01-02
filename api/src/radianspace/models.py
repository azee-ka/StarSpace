from django.db import models
from django.utils import timezone
from ..user.models import BaseUser
import uuid


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    flare = models.ForeignKey('Flare', related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(BaseUser, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username}"


class MediaFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to='post_media/')
    media_type = models.CharField(max_length=10, default="default")
    order = models.IntegerField(default=0)

class Flare(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    author = models.ForeignKey(BaseUser, on_delete=models.SET_NULL, null=True, related_name='flares')
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    text = models.TextField(blank=True)  # Make the text field optional
    media_files = models.ManyToManyField(MediaFile, related_name='post_media', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes_count = models.PositiveIntegerField(default=0)  # Field for the number of likes
    comments_count = models.PositiveIntegerField(default=0)  # Field for the number of comments
    likes = models.ManyToManyField(BaseUser, related_name='liked_posts', blank=True)
    dislikes_count = models.PositiveIntegerField(default=0)  # Field for the number of dislikes
    dislikes = models.ManyToManyField(BaseUser, related_name='disliked_posts', blank=True)

    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Post by {self.user.username}"