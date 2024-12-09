from django.urls import path
from . import views

urlpatterns = [
    # Exchange URLs
    path('exchanges/', views.exchange_list, name='exchange-list'),
    path('exchange/create/', views.create_exchange, name='create-exchange'),
    path('exchange/<uuid:uuid>/', views.exchange_detail, name='exchange-detail'),  # Use UUID here

    # Entry URLs
    path('exchange/<uuid:uuid>/entries/', views.entry_list, name='entry-list'),
    path('exchange/<uuid:uuid>/entries/<int:entry_id>/', views.entry_detail, name='entry-detail'),

    # Comment URLs
    path('entries/<int:entry_id>/comments/', views.comment_list, name='comment-list'),

    # Score URLs
    path('entries/<int:entry_id>/score/', views.score_entry, name='score-entry'),

    # Flag URLs
    path('entries/<int:entry_id>/flag/', views.flag_entry, name='flag-entry'),

    # Impact Score URLs
    path('entries/<int:entry_id>/impact/', views.impact_score_entry, name='impact-score-entry'),
]
