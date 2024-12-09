from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Exchange, Entry, Comment, Score, Flag, ImpactScore
from .serializers import ExchangeSerializer, EntrySerializer, CommentSerializer, ScoreSerializer, FlagSerializer, ImpactScoreSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from .models import Exchange
from .serializers import ExchangeSerializer
from ..user.models import BaseUser

@api_view(['POST'])
def create_exchange(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        # Pass the request context to the serializer
        serializer = ExchangeSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            exchange = serializer.save()  # The creator is set based on the request.user type
            return Response({"uuid": exchange.uuid}, status=status.HTTP_201_CREATED)
        
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Exchange Views
@api_view(['GET', 'POST'])
def exchange_list(request):
    if request.method == 'GET':
        exchanges = Exchange.objects.all()
        serializer = ExchangeSerializer(exchanges, many=True)
        return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
def exchange_detail(request, uuid):
    exchange = get_object_or_404(Exchange, uuid=uuid)  # Use UUID instead of pk

    if request.method == 'GET':
        serializer = ExchangeSerializer(exchange)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ExchangeSerializer(exchange, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        exchange.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def entry_list(request, uuid):
    exchange = get_object_or_404(Exchange, uuid=uuid)  # Use UUID instead of pk

    if request.method == 'GET':
        entries = Entry.objects.filter(exchange=exchange)
        serializer = EntrySerializer(entries, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(exchange=exchange, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def entry_detail(request, exchange_id, entry_id):
    exchange = get_object_or_404(Exchange, pk=exchange_id)
    entry = get_object_or_404(Entry, pk=entry_id)

    if request.method == 'GET':
        serializer = EntrySerializer(entry)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = EntrySerializer(entry, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



# Comment Views
@api_view(['GET', 'POST'])
def comment_list(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)

    if request.method == 'GET':
        comments = Comment.objects.filter(entry=entry)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(entry=entry)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Score Views
@api_view(['POST'])
def score_entry(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)
    score_type = request.data.get('score_type')

    if score_type not in ['upvote', 'downvote']:
        return Response({'error': 'Invalid score type'}, status=status.HTTP_400_BAD_REQUEST)

    score = Score.objects.create(content_type='entry', content_id=entry.id, score_type=score_type)
    # Recalculate the score for the entry
    entry.score += 1 if score_type == 'upvote' else -1
    entry.save()

    return Response(ScoreSerializer(score).data, status=status.HTTP_201_CREATED)

# Flag Views
@api_view(['POST'])
def flag_entry(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)
    reason = request.data.get('reason')

    if reason not in ['spam', 'inappropriate', 'offensive', 'other']:
        return Response({'error': 'Invalid flag reason'}, status=status.HTTP_400_BAD_REQUEST)

    flag = Flag.objects.create(content_type='entry', content_id=entry.id, reason=reason, user=request.user)
    return Response(FlagSerializer(flag).data, status=status.HTTP_201_CREATED)

# Impact Score Views
@api_view(['GET'])
def impact_score_entry(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)
    impact_score = ImpactScore.objects.filter(entry=entry).first()

    if impact_score is None:
        return Response({'error': 'Impact score not calculated yet'}, status=status.HTTP_404_NOT_FOUND)

    return Response(ImpactScoreSerializer(impact_score).data)





@api_view(['POST'])
def add_members(request, exchange_id):
    exchange = get_object_or_404(Exchange, pk=exchange_id)

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    if not request.data.get('members'):
        return Response({"detail": "No members provided."}, status=status.HTTP_400_BAD_REQUEST)

    member_ids = request.data.get('members', [])
    members = BaseUser.objects.filter(id__in=member_ids)

    if not members.exists():
        return Response({"detail": "One or more users do not exist."}, status=status.HTTP_404_NOT_FOUND)

    exchange.members.add(*members)  # Add members to the ManyToMany relationship
    return Response({"detail": "Members added successfully."}, status=status.HTTP_200_OK)



@api_view(['POST'])
def add_moderators(request, exchange_id):
    exchange = get_object_or_404(Exchange, pk=exchange_id)

    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    if not request.data.get('moderators'):
        return Response({"detail": "No moderators provided."}, status=status.HTTP_400_BAD_REQUEST)

    moderator_ids = request.data.get('moderators', [])
    moderators = BaseUser.objects.filter(id__in=moderator_ids)

    if not moderators.exists():
        return Response({"detail": "One or more users do not exist."}, status=status.HTTP_404_NOT_FOUND)

    exchange.moderators.add(*moderators)  # Add moderators to the ManyToMany relationship
    return Response({"detail": "Moderators added successfully."}, status=status.HTTP_200_OK)
