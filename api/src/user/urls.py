from django.urls import path, include
from . import views

urlpatterns = [
    # Auth
    path('', include('src.user.auth.urls')),
    
    # Profile
    path('profile/get-user-info/', views.get_user_info, name='get-user-info'),
    path('profile/<str:username>/', views.user_profile_view, name='profile_view'),
    
    # Interact
    path('', include('src.user.interact.urls')),
    
    # Settings
    path('settings/toggle-profile-visibility/', views.toggle_profile_visibility, name='toggle-profile-visibility'),
    path('settings/edit-basic-info/', views.edit_basic_info, name='edit-basic-info'),
]
