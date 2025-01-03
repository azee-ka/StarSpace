from rest_framework import serializers
from .models import BaseUser
from rest_framework import serializers
# from ..axionspace.serializers import EntrySerializer


def build_category_representation(instance, representation, categories):
    data = {}
    
    for category, fields in categories.items():
        if category == 'stats':
            # Dynamically calculate the counts based on which fields are specified
            count_data = {}
            if 'following_count' in fields:
                count_data['following_count'] = instance.following.count()
            if 'followers_count' in fields:
                count_data['followers_count'] = instance.followers.count()
            if 'entries_count' in fields:
                count_data['entries_count'] = instance.authored_entries.count()  # Ensure we use 'authored_entries'
            data[category] = count_data
        else:
            # For other categories, just include the relevant fields
            data[category] = {field: representation[field] for field in fields}
    
    return data





class EntriesCountMixin:
    """
    Mixin that adds the 'entries_count' field to any serializer.
    """
    entries_count = serializers.SerializerMethodField()
    entries = serializers.SerializerMethodField()

    def get_entries_count(self, obj):
        # Assuming 'authored_entries' is the reverse relationship on BaseUser for the entries they authored
        return obj.authored_entries.count()
    def get_entries(self, obj):
        # Serialize the authored entries using a dedicated serializer
        from ..axionspace.serializers import EntrySerializer  # Import EntrySerializer if needed
        authored_entries = obj.authored_entries.all()  # Fetch related entries
        return EntrySerializer(authored_entries, many=True).data






class PartialProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = [ 'username', 'profile_image', 'about_me',
                  'is_private_profile',
                  ]
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        categories = {
            'basicInfo': ['username', 'profile_image'],
            'stats': ['following_count', 'followers_count'],
            'privacy': ['is_private_profile'],
        }
        return build_category_representation(instance, representation, categories)


class FullProfileSerializer(EntriesCountMixin, serializers.ModelSerializer):
    entries = serializers.SerializerMethodField() #EntrySerializer(many=True, read_only=True, source='authored_entries')
    class Meta:
        model = BaseUser
        fields =  [ 'username', 'profile_image', 'date_joined',
                   'is_private_profile',
                   'entries'
                   ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        categories = {
            'basicInfo': ['username', 'profile_image', 'date_joined'],
            'stats': ['following_count', 'followers_count', 'entries_count'],
            'privacy': ['is_private_profile'],
            'data': [
                'entries'
                ],
        }
        return build_category_representation(instance, representation, categories)


class MyProfileSerializer(EntriesCountMixin, serializers.ModelSerializer):
    entries = serializers.SerializerMethodField() #EntrySerializer(many=True, read_only=True, source='authored_entries')
    class Meta:
        model = BaseUser
        fields = ['first_name', 'last_name', 'username', 'email', 'profile_image', 'date_joined', 
                  'is_private_profile',
                  'entries'
                  ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        categories = {
            'basicInfo': ['first_name', 'last_name', 'username', 'email', 'profile_image', 'date_joined'],
            'stats': ['following_count', 'followers_count', 'entries_count'],
            'privacy': ['is_private_profile'],
            'data': [
                'entries'
                ],
        }
        return build_category_representation(instance, representation, categories)



class EditUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = ['first_name', 'last_name', 'username', 'email', 'display_name', 'profile_image', 'about_me', 'gender']



class EssentialUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = ['id', 'username', 'profile_image']
        
        
class MinimalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = ['first_name', 'last_name', 'username', 'email', 'profile_image']
        
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
        user.username = username

        # Save and return the user
        user.save()
        return user







class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = ['display_name', 'about_me', 'username_anon', 'username_pro', 'role', 'profile_image']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance




class UserProfilePictureUpdateSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField()
    
    
    