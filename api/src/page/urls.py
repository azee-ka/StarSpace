from django.urls import path
from . import views

urlpatterns = [
    path('save_layout/', views.save_page_config, name='save_layout'),  # Save layout
    path('get_layout/', views.get_page_config, name='get_layout'),      # Fetch layout
]
