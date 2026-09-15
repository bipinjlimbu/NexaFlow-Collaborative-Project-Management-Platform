from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Project
from ..serializers import ProjectSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def projects_view(request):
    if request.method == 'GET':
        try:
            projects = Project.objects.filter(workspace__members__user=request.user).distinct()
            serializer = ProjectSerializer(projects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            return Response({"error": "Projects not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)