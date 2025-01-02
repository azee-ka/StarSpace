from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Flare, Comment, MediaFile
from .serializers import FlareSerializer, FlareSerializer, CommentSerializer
import uuid

class FlareListCreateView(generics.ListCreateAPIView):
    queryset = Flare.objects.all()
    serializer_class = FlareSerializer
    
class FlareRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Flare.objects.all()
    serializer_class = FlareSerializer

class CreateCommentView(CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_flare(request):
    serializer = FlareSerializer(data=request.data)
    user = request.user
    if serializer.is_valid():
        if user.is_authenticated:
            # Create a new Flare
            flare = serializer.save(author=user, uuid=uuid.uuid4())

            # Handle multiple media files
            media_files = request.FILES.getlist('media[]')
            for media_file in media_files:
                media_type = media_file.name.split('.')[-1]
                media = MediaFile.objects.create(file=media_file, media_type=media_type)
                flare.media_files.add(media)

            flare.save()

            return Response({'uuid': flare.uuid}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'User is not authenticated.'}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_flare_by_id(request, flare_id):

    try:
        flare = Flare.objects.get(uuid=flare_id)
        serializer = FlareSerializer(flare)
        return Response(serializer.data, status=status.HTTP_200_OK) # Use status.HTTP_200_OK
    except Flare.DoesNotExist:
        return Response({'message': 'Flare not found'}, status=status.HTTP_404_NOT_FOUND) # Use status.HTTP_404_NOT_FOUND


@api_view(['POST'])  # Use Flare method for creating comments
@permission_classes([IsAuthenticated])
def create_comment(request, flare_id):
    try:
        flare = Flare.objects.get(uuid=flare_id)
    except Flare.DoesNotExist:
        return Response({'message': 'Flare not found'}, status=status.HTTP_404_NOT_FOUND)

    # Assuming the 'text' for the comment is sent in the request data
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user, flare=flare)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def create_like(request, flare_id):
    try:
        flare = Flare.objects.get(uuid=flare_id)
    except Flare.DoesNotExist:
        return Response({'message': 'Flare not found'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if request.method == 'POST':
        # Check if the user has already disliked the Flare, and remove the dislike
        if user in flare.dislikes.all():
            flare.dislikes.remove(user)

        # Check if the user is already in the list of likers
        if user not in flare.likes.all():
            # Like the Flare
            flare.likes.add(user)

    elif request.method == 'DELETE':
        # Unlike the Flare
        flare.likes.remove(user)

    flare.save()

    serializer = FlareSerializer(flare)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def create_dislike(request, flare_id):
    try:
        flare = Flare.objects.get(uuid=flare_id)
    except Flare.DoesNotExist:
        return Response({'message': 'Flare not found'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if request.method == 'POST':
        # Check if the user has already liked the Flare, and remove the like
        if user in flare.likes.all():
            flare.likes.remove(user)

        # Check if the user is already in the list of dislikers
        if user not in flare.dislikes.all():
            # Dislike the Flare
            flare.dislikes.add(user)

    elif request.method == 'DELETE':
        # Remove the dislike
        flare.dislikes.remove(user)

    flare.save()

    serializer = FlareSerializer(flare)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_flare(request, flare_id):
    try:
        flare = Flare.objects.get(uuid=flare_id)
    except Flare.DoesNotExist:
        return Response({'error': 'Flare not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the current user is the owner of the Flare
    if request.user == flare.user:
        Flare.delete()
        return Response({'success': True, 'message': 'Flare deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({'error': 'You do not have permission to delete this Flare'}, status=status.HTTP_403_FORBIDDEN)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_like_status(request, flare_id):
    try:
        flare = Flare.objects.get(uuid=flare_id)
    except Flare.DoesNotExist:
        return Response({'message': 'Flare not found'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    # Check if the user has liked the Flare
    liked = user in flare.likes.all()

    # Check if the user has disliked the Flare
    disliked = user in flare.dislikes.all()

    # Return the like status
    return Response({'liked': liked, 'disliked': disliked}, status=status.HTTP_200_OK)