from django.urls import path,include
from django.http import JsonResponse

def health_check(request):
    """Health check endpoint for monitoring"""
    return JsonResponse({"status": "ok", "message": "CareerSense API is running"})

urlpatterns = [
    path('', health_check, name='health_check'),
    path('api/',include('prediction.urls')),   
    path('api/',include('chatapp.urls')),
    # path('api/',include('voiceapp.urls')),  # Disabled for production - requires speech packages
    
]
