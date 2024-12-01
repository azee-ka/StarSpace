from django.urls import path
from . import views

urlpatterns = [
    path('exchange/<int:exchange_id>/', views.get_exchange, name='get_exchange'),
    path('exchange/', views.create_exchange, name='create_exchange'),
    path('exchange/<int:exchange_id>/entries/', views.get_entries, name='get_entries'),
    path('exchange/<int:exchange_id>/entries/new/', views.create_entry, name='create_entry'),
]
