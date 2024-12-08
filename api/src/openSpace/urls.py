from django.urls import path
from . import views

urlpatterns = [
    # Exchange URLs
    path('exchanges/', views.exchange_list, name='exchange-list'),
    path('exchanges/<int:pk>/', views.exchange_detail, name='exchange-detail'),

    # Entry URLs
    path('exchanges/<int:exchange_id>/entries/', views.entry_list, name='entry-list'),
    path('exchanges/<int:exchange_id>/entries/<int:entry_id>/', views.entry_detail, name='entry-detail'),

    # Comment URLs
    path('entries/<int:entry_id>/comments/', views.comment_list, name='comment-list'),

    # Score URLs
    path('entries/<int:entry_id>/score/', views.score_entry, name='score-entry'),

    # Flag URLs
    path('entries/<int:entry_id>/flag/', views.flag_entry, name='flag-entry'),

    # Impact Score URLs
    path('entries/<int:entry_id>/impact/', views.impact_score_entry, name='impact-score-entry'),
]
