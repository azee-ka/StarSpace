from rest_framework import serializers
from .models import Exchange, Entry, Comment, Score, Flag, ImpactScore, UserProfile

# Exchange Serializer
class ExchangeSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField()  # Reference to the custom User model
    members = serializers.StringRelatedField(many=True)

    class Meta:
        model = Exchange
        fields = ['id', 'name', 'description', 'creator', 'created_at', 'updated_at', 'score', 'members']

# Entry Serializer
class EntrySerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()  # Reference to the custom User model
    exchange_name = serializers.CharField(source='exchange.name', read_only=True)
    impact_score = serializers.IntegerField(read_only=True)

    class Meta:
        model = Entry
        fields = ['id', 'title', 'content', 'author', 'exchange', 'created_at', 'updated_at', 'score', 'impact_score', 'flags', 'exchange_name']

# Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()  # Reference to the custom User model

    class Meta:
        model = Comment
        fields = ['id', 'entry', 'author', 'content', 'created_at', 'updated_at', 'score']

# Score Serializer
class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ['id', 'content_type', 'content_id', 'score_type', 'created_at']

# Flag Serializer
class FlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flag
        fields = ['id', 'content_type', 'content_id', 'reason', 'user', 'created_at']

# Impact Score Serializer
class ImpactScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactScore
        fields = ['id', 'entry', 'upvotes', 'downvotes', 'comments', 'shares', 'engagement_score']

# UserProfile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Reference to the custom User model

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'avatar', 'following']
