from rest_framework import serializers
from .models import BaseUser
from rest_framework import serializers

class MinimalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = ['first_name', 'last_name', 'username', 'email']
        
class BaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'display_name', 'date_of_birth', 'profile_image', 'is_private_profile']



class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(write_only=True)  # Frontend sends 'username'

    class Meta:
        model = BaseUser
        fields = ['email', 'password', 'username', 'first_name', 'last_name']

    def create(self, validated_data):
        # Extract 'username' from validated data
        username = validated_data.pop('username', None)

        # Create the user using the other validated data
        user = BaseUser.objects.create_user(**validated_data)

        # Store the username in the 'username_general' field
        user.username_general = username

        # Save and return the user
        user.save()
        return user







class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = ['display_name', 'bio', 'username_anon', 'username_pro', 'role', 'profile_image']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance




class UserProfilePictureUpdateSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField()
    