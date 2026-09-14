from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import WorkspaceInvitation
from ..serializers import WorkspaceInvitationSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_invitations_view(request):
    try:
        invitations = WorkspaceInvitation.objects.filter(invited_user=request.user)
        serializer = WorkspaceInvitationSerializer(invitations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except WorkspaceInvitation.DoesNotExist:
        return Response({"error": "Invitations not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)