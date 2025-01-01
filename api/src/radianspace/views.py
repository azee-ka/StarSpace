from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Flare
from .serializers import FlareSerializer
from rest_framework.exceptions import NotFound


@api_view(['GET', 'POST'])
def flare_list(request):
    """
    List all flares, or create a new flare.
    """
    if request.method == 'GET':
        flares = Flare.objects.all()
        serializer = FlareSerializer(flares, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = FlareSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def flare_detail(request, pk):
    """
    Retrieve, update or delete a flare.
    """
    try:
        flare = Flare.objects.get(pk=pk)
    except Flare.DoesNotExist:
        raise NotFound(detail="Flare not found.")
    
    if request.method == 'GET':
        serializer = FlareSerializer(flare)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = FlareSerializer(flare, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        flare.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
