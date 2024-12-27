from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PageLayout

DEFAULT_CONFIGS = {
    "partial_profile": {
        "layout": [
            {
                "i": "profile-info",
                "x": 12,
                "y": 2,
                "w": 13,
                "h": 12,
                "className": "profile-info",
                "componentType": "ProfileInfoWidget"
            }
        ],
        "style": """
        .profile-info {
            background-color: rgba(0, 110, 99, 0.182);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            border: 0px solid gray;
            color: rgb(188, 188, 188);
            text-align: center;
            border-radius: 8px;
        }
        """
    }
}


@api_view(['GET'])
def get_page_config(request):
    page_name = request.query_params.get('page_name')
    user = request.user

    if page_name not in DEFAULT_CONFIGS:
        return Response({"error": f"Invalid page name: {page_name}"}, status=400)

    default_config = DEFAULT_CONFIGS[page_name]
    try:
        user_config = PageLayout.objects.get(user=user, page_name=page_name)
        merged_layout = user_config.layout_data or default_config["layout"]
        merged_style = user_config.style_data or default_config["style"]
    except PageLayout.DoesNotExist:
        merged_layout = default_config["layout"]
        merged_style = default_config["style"]

    return Response({"layout": merged_layout, "style": merged_style}, status=200)


@api_view(['POST'])
def save_page_config(request):
    user = request.user
    page_name = request.data.get('page_name')
    layout_data = request.data.get('layout_data')
    style_data = request.data.get('style_data')

    if page_name not in DEFAULT_CONFIGS:
        return Response({"error": "Invalid page name"}, status=400)

    customization, _ = PageLayout.objects.update_or_create(
        user=user,
        page_name=page_name,
        defaults={
            "layout_data": layout_data,
            "style_data": style_data
        }
    )
    return Response({"message": "Customization saved successfully"}, status=200)
