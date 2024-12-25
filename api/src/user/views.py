from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .models import BaseUser
from .serializers import BaseUserSerializer, UserUpdateSerializer, UserProfilePictureUpdateSerializer, UserCreateSerializer, MinimalUserSerializer, MyProfilelProfileSerializer

from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
import uuid
from django.core.files.base import ContentFile
import base64
import os

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                'user': {
                    'id': user.id,
                    'username': user.username
                },
                'token': token.key,
            },
            status=201
        )
    return Response(serializer.errors, status=400)





@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        # Login the user and generate a new token
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        response_data = {'user': {'id': user.id, 'username': user.username, 'role': user.role}, 'token': token.key}
        return Response(response_data, status=200)
    else:
        return Response({"message": "Invalid credentials"}, status=401)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    base_user = request.user  # This gives you the authenticated user of type BaseUser
    serializer = MyProfilelProfileSerializer(base_user)
    return Response(serializer.data, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def assign_usernames(request):
    """
    Allow users to assign their general username to a role
    (either 'anonymous' or 'professional') and optionally specify the other username.
    """
    user = request.user

    # Get the target role and the new username from the request
    target_role = request.data.get('role')
    new_username = request.data.get('new_username')

    if target_role not in ['anonymous', 'professional']:
        return Response({"message": "Invalid role. Choose either 'anonymous' or 'professional'."}, status=400)

    # Assign the general username to the selected role
    if target_role == 'anonymous':
        user.username_anon = user.username_general
        user.username_pro = new_username
    elif target_role == 'professional':
        user.username_pro = user.username_general
        user.username_anon = new_username

    # Nullify the general username after assignment
    user.username_general = None
    user.save()

    return Response({
        "message": f"General username assigned to '{target_role}' role successfully.",
        "username_anon": user.username_anon,
        "username_pro": user.username_pro
    }, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request, user_id):
    """Update user profile (name, bio, username, etc.)."""
    user = BaseUser.objects.get(id=user_id)
    if request.user != user:
        return Response({"detail": "You cannot edit someone else's profile."}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_username(request):
    user = request.user
    if not user.role:
        return Response({"message": "Please set your role first."}, status=400)

    username = request.data.get('username')
    user.assign_username(username)
    return Response({'message': 'Username updated successfully.', 'current_username': user.get_current_username()})



@api_view(['POST'])
def switch_user_role(request):
    """Allow the user to switch between anonymous and professional identities."""
    user = request.user
    user.switch_role()  # This method already updates the role
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
