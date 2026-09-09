from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import Workspaces
from ..serializers import WorkspacesSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def workspaces_view(request):
    if request.method == 'GET':
        try:
            workspaces = Workspaces.objects.filter(user=request.user)
            serializer = WorkspacesSerializer(workspaces, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Workspaces.DoesNotExist:
            return Response({"error": "Workspaces not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    errors = {}
    if request.method == 'POST':
        name = request.data.get('name')
        description = request.data.get('description')
        created_by = request.user
        
        if not name:
            errors['name'] = 'This field is required.'
        elif Workspaces.objects.filter(name=name, created_by=created_by).exists():
            errors['name'] = 'A workspace with this name already exists.'
            
        if not description:
            errors['description'] = 'This field is required.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        workspace = Workspaces(name=name, description=description, created_by=created_by)
        
        try:
            workspace.save()
            serializer = WorkspacesSerializer(workspace)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)