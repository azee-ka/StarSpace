from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Exchange, Entry
from .serializers import ExchangeSerializer, EntrySerializer

@api_view(['GET'])
def get_exchange(request, exchange_id):
    """
    Fetch a single exchange by ID, including its entries.
    """
    try:
        exchange = Exchange.objects.get(id=exchange_id)
        serializer = ExchangeSerializer(exchange)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exchange.DoesNotExist:
        return Response({"error": "Exchange not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def create_exchange(request):
    """
    Create a new exchange.
    """
    serializer = ExchangeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)  # Assume user authentication
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_entries(request, exchange_id):
    """
    Fetch all entries for a specific exchange.
    """
    try:
        exchange = Exchange.objects.get(id=exchange_id)
        entries = exchange.entries.all()
        serializer = EntrySerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exchange.DoesNotExist:
        return Response({"error": "Exchange not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def create_entry(request, exchange_id):
    """
    Create a new entry in an exchange.
    """
    try:
        exchange = Exchange.objects.get(id=exchange_id)
        serializer = EntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, exchange=exchange)  # Assume user authentication
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exchange.DoesNotExist:
        return Response({"error": "Exchange not found"}, status=status.HTTP_404_NOT_FOUND)
