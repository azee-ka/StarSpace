from rest_framework import serializers
from .models import Exchange, Entry, Reaction

class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ['id', 'reaction_type', 'user', 'created_at']


class EntrySerializer(serializers.ModelSerializer):
    reactions = ReactionSerializer(many=True, read_only=True)  # Nested reactions

    class Meta:
        model = Entry
        fields = ['id', 'exchange', 'author', 'content', 'created_at', 'updated_at', 'upvotes', 'downvotes', 'reactions']


class ExchangeSerializer(serializers.ModelSerializer):
    entries = EntrySerializer(many=True, read_only=True)  # Nested entries

    class Meta:
        model = Exchange
        fields = ['id', 'title', 'description', 'created_by', 'created_at', 'updated_at', 'tags', 'entries']
