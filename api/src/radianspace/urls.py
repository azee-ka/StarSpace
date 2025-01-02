from django.urls import path, include
from . import views

urlpatterns = [
    # Flare views
    path('create-flare/', views.create_flare, name='create-post'),
    path('flare/<int:flare_id>/delete/', views.delete_flare, name='delete-post'),

    path('flare/<uuid:flare_id>/', views.get_flare_by_id, name='get_post_by_id'),
    
    path('flare/<uuid:flare_id>/comment/', views.create_comment, name='create-comment'),
    path('flare/<uuid:flare_id>/like/', views.create_like, name='like-post'),
    path('flare/<uuid:flare_id>/dislike/', views.create_dislike, name='dislike-post'),
    
    path('flare/<uuid:flare_id>/like-status/', views.get_like_status, name='get_like_status'),
    
    # Timeline
    path('timeline/', include('src.radianspace.timeline.urls')),
    
    # Explore
    path('explore/', include('src.radianspace.explore.urls')),
]
