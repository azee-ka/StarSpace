from django.db import models
from ..user.models import BaseUser

class PageLayout(models.Model):
    user = models.ForeignKey(BaseUser, on_delete=models.CASCADE, related_name="page_layouts")
    page_name = models.CharField(max_length=255)  # e.g., "profile", "dashboard", etc.
    layout_data = models.JSONField(default=dict)  # Stores layout as JSON
    style_data = models.TextField(blank=True)

    class Meta:
        unique_together = ('user', 'page_name')
    
    def __str__(self):
        return f"{self.user.username} - {self.page_name} layout"
