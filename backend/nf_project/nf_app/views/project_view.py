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
        
    errors = {}
    if request.method == 'POST':
        name = request.data.get('name')
        description = request.data.get('description')
        workspace_id = request.data.get('workspace_id')
        start_date = request.data.get('start_date')
        due_date = request.data.get('due_date')
        
        if not name:
            errors['name'] = 'This field is required.'
        elif Project.objects.filter(name=name, workspace_id=workspace_id).exists():
            errors['name'] = 'A project with this name already exists in this workspace.'
            
        if not description:
            errors['description'] = 'This field is required.'
            
        if not workspace_id:
            errors['workspace_id'] = 'This field is required.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            workspace = Project.objects.get(pk=workspace_id, members__user=request.user)
            project = Project(name=name, description=description, workspace=workspace, start_date=start_date, due_date=due_date)
            project.save()
            serializer = ProjectSerializer(project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Project.DoesNotExist:
            return Response({"error": "Workspace not found or you do not have permission to create a project in this workspace."}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def project_detail_view(request, pk):
    try:
        project = Project.objects.get(pk=pk, workspace__members__user=request.user)
    except Project.DoesNotExist:
        return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)