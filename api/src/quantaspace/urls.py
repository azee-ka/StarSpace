from django.urls import path, include
from . import views

urlpatterns = [
    # Packet views
    path('packet/create-packet/', views.create_packet, name='create-packet' ),
    path('packet/<uuid:packet_id>/', views.get_packet, name='get-packet'),
    
    # Timeline
    path('timeline/', include('src.quantaspace.timeline.urls'))
]