# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import BaseUser

from .serializers import BaseUserSerializer, UserProfilePictureUpdateSerializer
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework import status
import uuid
from django.core.files.base import ContentFile
import base64
import os


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    # Choose the appropriate model based on the 'role' field
    serializer = BaseUserSerializer(data=request.data)
        
    if serializer.is_valid():
        user = serializer.save()

        # Use set_password to handle password hashing
        user.set_password(request.data['password'])
        user.save()

        token, created = Token.objects.get_or_create(user=user)

        response_data = {'user': {'id': user.id, 'username': user.username, 'role': user.role}, 'token': token.key}
        return Response(response_data, status=201)
    else:
        print(f"Registration Failed. Errors: {serializer.errors}")
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


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user

    # Update the user profile with the data from the request
    serializer = BaseUserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    else:
        return Response(serializer.errors, status=400)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    base_user = request.user  # This gives you the authenticated user of type BaseUser
    serializer = BaseUserSerializer(base_user)
    return Response(serializer.data, status=200)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_profile_visibility(request):
    user = request.user

    # Toggle visibility
    user.is_private_profile = not user.is_private_profile
    user.save()

    visibility_status = 'private' if user.is_private_profile else 'public'

    return Response({"message": f"Profile visibility set to {visibility_status}"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_visibility(request):
    base_user = request.user
    
    serializer = BaseUserSerializer(base_user, context={'request': request})
    
    # Extract the visibility status from the serializer data
    visibility_status = 'private' if base_user.is_private_profile else 'public'

    return Response({"visibility": visibility_status})








from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile_picture(request):
    user = request.user

    profile_picture_data = request.data.get('profile_picture', None)

    if profile_picture_data:
        # Generate a unique filename using uuid
        unique_filename = f"{uuid.uuid4()}.jpg"

        # Decode the base64 string and create a ContentFile
        decoded_image = base64.b64decode(profile_picture_data.split(',')[1])
        content_file = ContentFile(decoded_image, name=unique_filename)

        # Save the profile picture
        user.profile_picture.save(unique_filename, content_file, save=True)
        user.save()

    # Use the new serializer for the response
    serializer = UserProfilePictureUpdateSerializer({'profile_picture': user.profile_picture.url})
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_user_profile_picture(request):
    user = request.user

    # Check if the user wants to remove the profile picture
    if user.profile_picture:
        # Remove the profile picture
        user.profile_picture.delete(save=True)
        user.save()

        return Response({'detail': 'Profile picture removed successfully.'})
    else:
        return Response({'detail': 'No profile picture to remove.'}, status=400)