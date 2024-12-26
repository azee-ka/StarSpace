from django.urls import path
from . import views

urlpatterns = [
    path('profile/follow-toggle/<str:username>/', views.toggle_follow, name='toggle_follow'),
]
