# urls.py
from django.urls import path, include

urlpatterns = [
    path('', include('src.user.urls')),
    path('axionspace/', include('src.axionspace.urls')),
    path('radianspace/', include('src.radianspace.urls')),
    path('quantaspace/', include('src.quantaspace.urls')),

]