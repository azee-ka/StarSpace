from rest_framework import serializers
from .models import Flare

class FlareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flare
        fields = ['uuid', 'author', 'image', 'video', 'caption', 'created_at', 'updated_at', 'likes', 'comments_count', 'shares_count', 'location_tag', 'filters', 'collaborative', 'is_highlight', 'creativity_votes', 'aesthetics_votes', 'tags', 'uploaded_files']
