from rest_framework import serializers
from .models import PageLayout

class PageLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageLayout
        fields = ['user', 'page_name', 'layout_data']
