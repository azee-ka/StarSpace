from rest_framework import serializers
from .models import User

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username_anon', 'username_pro', 'password', 'full_name', 'bio', 'profile_image']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'bio', 'profile_image', 'username_anon', 'username_pro', 'role']

    def update(self, instance, validated_data):
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.profile_image = validated_data.get('profile_image', instance.profile_image)
        instance.username_anon = validated_data.get('username_anon', instance.username_anon)
        instance.username_pro = validated_data.get('username_pro', instance.username_pro)
        instance.role = validated_data.get('role', instance.role)
        instance.save()
        return instance


class UserProfilePictureUpdateSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField()
    