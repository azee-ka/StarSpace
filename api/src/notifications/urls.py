from django.urls import path
from .views import NotificationListView, MarkNotificationAsReadView

urlpatterns = [
    path('list/', NotificationListView.as_view(), name='notification-list'),
    path('mark-as-read/<int:notification_id>/', MarkNotificationAsReadView.as_view(), name='mark-as-read'),
]
