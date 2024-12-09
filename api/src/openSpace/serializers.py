from rest_framework import serializers
from django.core.exceptions import ValidationError, ObjectDoesNotExist

from .models import Exchange, Entry, Comment, Score, Flag, ImpactScore
from ..user.models import BaseUser


class ExchangeSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(queryset=BaseUser.objects.all(), required=False)

    class Meta:
        model = Exchange
        fields = [
            'uuid', 'name', 'description', 'category', 'creator',  # Include uuid here
            'created_at', 'updated_at', 'score', 'rules', 'banner',
            'isPublic', 'allowAnonymous', 'primaryColor', 'secondaryColor'
        ]

    def create(self, validated_data):
        request_user = self.context['request'].user
        validated_data.pop('creator', None)
        validated_data['creator'] = request_user
        return Exchange.objects.create(**validated_data)




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
