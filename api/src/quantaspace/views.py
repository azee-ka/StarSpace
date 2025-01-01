from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Packet
from .serializers import PacketSerializer, CreatePacketSerializer
from rest_framework.exceptions import NotFound


@api_view(['GET'])
def get_packet(request, packet_id):
    """
    Handles retrieving an existing packet.
    """
    if request.method == 'GET' and packet_id:
        # Retrieve a specific packet
        try:
            packet = Packet.objects.get(uuid=packet_id)
        except Packet.DoesNotExist:
            raise NotFound(detail="Packet not found.")
        serializer = PacketSerializer(packet)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_packet(request):
    """
    Handles creating a new packet
    """
    if request.method == 'POST':
        serializer = CreatePacketSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            packet = serializer.save()
            return Response({"uuid": packet.uuid}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)