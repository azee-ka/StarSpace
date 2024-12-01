from django.db import models
from django.contrib.auth.models import User

class Exchange(models.Model):
    """
    Represents a discussion topic or 'Exchange'.
    """
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="exchanges")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.CharField(max_length=255, blank=True, null=True)  # Comma-separated tags

    def __str__(self):
        return self.title


class Entry(models.Model):
    """
    Represents a user-submitted post (or 'Entry') within an Exchange.
    """
    exchange = models.ForeignKey(Exchange, on_delete=models.CASCADE, related_name="entries")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="entries")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)

    def __str__(self):
        return f"Entry by {self.author.username} in {self.exchange.title}"


class Reaction(models.Model):
    """
    Optional: Add reactions to entries (e.g., Agree, Disagree, Needs Evidence).
    """
    REACTION_CHOICES = [
        ("INSIGHTFUL", "Insightful"),
        ("AGREE", "Agree"),
        ("NEEDS_EVIDENCE", "Needs Evidence"),
    ]
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name="reactions")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reactions")
    reaction_type = models.CharField(max_length=20, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reaction_type} by {self.user.username}"
