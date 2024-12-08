from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('profile/<int:user_id>/', views.get_user_profile, name='get_user_profile'),
    path('profile/update/<int:user_id>/', views.update_user_profile, name='update_user_profile'),
    path('profile/picture/update/', views.update_profile_picture, name='update_profile_picture'),  # Profile picture update route
    path('switch_role/', views.switch_user_role, name='switch_user_role'),
]
