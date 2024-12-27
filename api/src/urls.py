# urls.py
from django.urls import path, include

urlpatterns = [
    path('', include('src.user.urls')),
    path('page-layout/', include('src.page.urls')),
    path('openspace/', include('src.openspace.urls')),
]