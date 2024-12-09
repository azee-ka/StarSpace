from django.db import models
from django.utils import timezone
from ..user.models import BaseUser
import uuid

def upload_to(instance, filename):
    return f'banner/{instance.name}/{filename}'

class Exchange(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=255, default='Uncategorized')
    creator = models.ForeignKey(BaseUser, on_delete=models.CASCADE, related_name='created_exchanges', null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    members = models.ManyToManyField(BaseUser, related_name='joined_exchanges', through='ExchangeMember')
    score = models.IntegerField(default=0)
    rules = models.TextField(blank=True, null=True)  # Optional rules for the exchange
    moderators = models.ManyToManyField(BaseUser, related_name='moderating_exchanges', blank=True)  # Moderators for the exchange
    banner = models.ImageField(upload_to='exchange_banners/', blank=True, null=True)
    isPublic = models.BooleanField(default=True)  # Whether the exchange is public
    allowAnonymous = models.BooleanField(default=False)  # Whether anonymous posts are allowed
    primaryColor = models.CharField(max_length=7, blank=True, null=True)  # Primary color (Hex code)
    secondaryColor = models.CharField(max_length=7, blank=True, null=True)  # Secondary color (Hex code)

    def __str__(self):
        return self.name


class ExchangeMember(models.Model):
    user = models.ForeignKey(BaseUser, on_delete=models.CASCADE)
    exchange = models.ForeignKey(Exchange, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'exchange')

class Entry(models.Model):
    exchange = models.ForeignKey(Exchange, on_delete=models.CASCADE, related_name='entries')
    author = models.ForeignKey(BaseUser, on_delete=models.CASCADE, related_name='entries')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.IntegerField(default=0)
    impact_score = models.OneToOneField('ImpactScore', on_delete=models.CASCADE, related_name='entry_impact_score', blank=True, null=True)
    flags = models.ManyToManyField('Flag', related_name='flagged_entries', blank=True)
    
    def __str__(self):
        return self.title

class Comment(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(BaseUser, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f'Comment by {self.author.get_current_username()} on {self.entry.title}'

class Score(models.Model):
    SCORE_CHOICES = [
        ('upvote', 'Upvote'),
        ('downvote', 'Downvote'),
    ]
    content_type = models.CharField(max_length=50)
    content_id = models.IntegerField()
    score_type = models.CharField(max_length=10, choices=SCORE_CHOICES)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.score_type} for {self.content_type} with ID {self.content_id}'

class Flag(models.Model):
    FLAG_CHOICES = [
        ('spam', 'Spam'),
        ('inappropriate', 'Inappropriate'),
        ('offensive', 'Offensive'),
        ('other', 'Other'),
    ]
    content_type = models.CharField(max_length=50)
    content_id = models.IntegerField()
    reason = models.CharField(max_length=50, choices=FLAG_CHOICES)
    user = models.ForeignKey(BaseUser, on_delete=models.CASCADE, related_name='flags')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Flag for {self.content_type} {self.content_id} by {self.user.get_current_username()}'

class ImpactScore(models.Model):
    entry = models.OneToOneField(Entry, on_delete=models.CASCADE, related_name='impact_score_detail')  # changed related_name
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    engagement_score = models.IntegerField(default=0)

    def calculate_engagement(self):
        self.engagement_score = self.upvotes * 3 + self.comments * 2 + self.shares * 5
        self.save()

    def __str__(self):
        return f'Impact score for entry {self.entry.title}'