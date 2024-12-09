# urls.py
from django.urls import path, include

urlpatterns = [
    path('', include('src.user.urls')),
    path('openspace/', include('src.openspace.urls')),
]