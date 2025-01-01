from django.urls import path
from . import views

urlpatterns = [
    # Flare views
    path('flares/', views.flare_list, name='flare-list'),
    path('flares/<int:pk>/', views.flare_detail, name='flare-detail'),
]
