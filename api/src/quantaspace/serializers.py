from rest_framework import serializers
from .models import Packet
from ..user.serializers import EssentialUserSerializer

class PacketSerializer(serializers.ModelSerializer):
    author = EssentialUserSerializer(read_only=True)
    class Meta:
        model = Packet
        fields = ['uuid', 'author', 'content', 'hashtags', 'mentions', 'created_at', 'updated_at', 'upvotes', 'downvotes', 'retweet_count', 'reply_count', 'is_sensitive', 'poll_options', 'poll_votes', 'mood', 'retweet_count', 'replies', 'flags', 'uploaded_files']


class CreatePacketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Packet
        fields = ['content', 'is_sensitive', 'uploaded_files', 'is_private', 'packet_type']
    
    def create(self, validated_data):
        # Automatically assign the current user as the author
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)