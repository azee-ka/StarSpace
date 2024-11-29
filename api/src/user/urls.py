# urls.py
from django.urls import path, include
from .views import login_view, register_view, get_user_info, update_user_profile_picture, remove_user_profile_picture, toggle_profile_visibility, get_profile_visibility, update_user_profile

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('profile/get-user-info/', get_user_info, name='get-user-info'),
    
    path('update-user-profile/', update_user_profile, name='update-user-profile'),

    path('update-profile-picture/', update_user_profile_picture, name='update-user-profile'),
    path('remove-profile-picture/', remove_user_profile_picture, name='remove-user-profile'),

    path('toggle-profile-visibility/', toggle_profile_visibility, name='toggle_profile_visibility'),
    path('get-profile-visibility/', get_profile_visibility, name='get_profile_visibility'),

]
