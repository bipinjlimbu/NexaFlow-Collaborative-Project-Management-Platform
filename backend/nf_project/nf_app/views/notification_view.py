from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Notification
from ..serializers import NotificationSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications_view(request):
    try:
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Notification.DoesNotExist:
        return Response({"error": "Notifications not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def notification_detail_view(request, pk):
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PATCH':
        notification.is_read = True
        notification.save()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)