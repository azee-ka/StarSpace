from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    
    path('profile/get-user-info/', views.get_user_info, name='get-user-info'),
    
    path('profile/assign-usernames/', views.assign_usernames, name='assign_usernames'),
    path('profile/update/<int:user_id>/', views.update_user_profile, name='update_user_profile'),
    path('profile/picture/update/', views.update_profile_picture, name='update_profile_picture'),  # Profile picture update route
    path('switch_role/', views.switch_user_role, name='switch_user_role'),
]
