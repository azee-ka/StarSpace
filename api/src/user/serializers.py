from rest_framework import serializers
from django.db import models
from .models import BaseUser

class BaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'display_name', 'date_of_birth', 'date_joined', 'is_active', 'role', 'profile_picture', 'is_private_profile']


class UserProfilePictureUpdateSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField()
    