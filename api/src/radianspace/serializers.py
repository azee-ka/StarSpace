from rest_framework import serializers
from .models import Flare, Comment, MediaFile

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'text',
            'author',
            'created_at',
        ]

    def get_author(self, obj):
        author = obj.author
        return {
            'username': author.username,
            'profile_image': author.profile_image.url if author.profile_image else None,
        }
        
class MediaFileSerializer(serializers.ModelSerializer):
    media_type = serializers.CharField()
    
    class Meta:
        model = MediaFile
        fields = ['file', 'media_type']
        
class FlareSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    profile_image = serializers.ImageField(source='user.profile_image', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    media_files = MediaFileSerializer(many=True, read_only=False, required=False)

    class Meta:
        model = Flare
        fields = [
            'text',
            'media_files',
            'id',
            'author',
            'profile_image',
            'created_at',
            'likes',
            'dislikes',
            'comments',
        ]

    def get_author(self, obj):
        author = obj.author
        custom_user = {
            'username': author.username,
            'profile_image': author.profile_image.url if author.profile_image else None,
        }
        return custom_user

    def get_likes(self, obj):
        return [
            {
                'username': like.username,
                'profile_image': like.profile_image.url if like.profile_image else None,
            }
            for like in obj.likes.all()
        ]

    # Add the following method if you want to get the count of likes directly
    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_dislikes(self, obj):
        return [
            {
                'username': dislike.username,
                'profile_image': dislike.profile_image.url if dislike.profile_image else None,
            }
            for dislike in obj.dislikes.all()
        ]

    def get_dislikes_count(self, obj):
        return obj.dislikes.count()




class MinimalFlareSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Flare
        fields = [
            'thumbnail',
            'uuid',
        ]

    def get_thumbnail(self, obj):
        # Assuming 'media_files' is a related manager on the Flare model
        thumbnail_media_file = obj.media_files.first()

        if thumbnail_media_file:
            return {
                'file': thumbnail_media_file.file.url,
                'media_type': thumbnail_media_file.media_type,
            }

        return None
    
class TimelineFlareSerializer(serializers.ModelSerializer):

    class Meta:
        model = Flare
        fields = ['uuid']