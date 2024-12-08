from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserCreateSerializer, UserUpdateSerializer, UserProfilePictureUpdateSerializer

@api_view(['POST'])
def register_user(request):
    """Register a new user with basic info (username, email, etc.)."""
    if request.method == 'POST':
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserUpdateSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_user_profile(request, user_id):
    """Get user profile data (full name, username, etc.)."""
    user = User.objects.get(id=user_id)
    serializer = UserUpdateSerializer(user)
    return Response(serializer.data)

@api_view(['PUT'])
def update_user_profile(request, user_id):
    """Update user profile (name, bio, username, etc.)."""
    user = User.objects.get(id=user_id)
    if request.user != user:
        return Response({"detail": "You cannot edit someone else's profile."}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def switch_user_role(request):
    """Allow the user to switch between anonymous and professional identities."""
    user = request.user
    user.switch_role()
    return Response({
        'current_role': user.role,
        'current_username': user.get_current_username()
    })


@api_view(['PUT'])
def update_profile_picture(request):
    """Update the user's profile picture."""
    if request.method == 'PUT':
        user = request.user  # Get the currently authenticated user
        serializer = UserProfilePictureUpdateSerializer(user, data=request.data)
        
        if serializer.is_valid():
            user.profile_image = serializer.validated_data['profile_picture']
            user.save()
            return Response({
                'message': 'Profile picture updated successfully.',
                'profile_image_url': user.profile_image.url  # You can return the image URL after saving it
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)