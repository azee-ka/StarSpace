from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..models import BaseUser
from django.shortcuts import get_object_or_404



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_follow(request, username):
    """
    Follow or unfollow a user. If the user is already following the target user,
    unfollow them, otherwise, follow the target user.
    """
    target_user = get_object_or_404(BaseUser, username=username)
    user = request.user
    
    # Ensure user is not trying to follow or unfollow themselves
    if user == target_user:
        return Response(
            {'detail': 'You cannot follow/unfollow yourself.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if the user is already following the target user
    if target_user in user.following.all():
        # If the user is following, unfollow them
        user.following.remove(target_user)
        target_user.followers.remove(user)
        return Response({'detail': f'unfollowed'}, status=status.HTTP_200_OK)
    else:
        # If the user is not following, follow the target user
        user.following.add(target_user)
        target_user.followers.add(user)
        return Response({'detail': f'following'}, status=status.HTTP_200_OK)