from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Workspace, WorkspaceMember, User, WorkspaceInvitation, Notification
from ..serializers import WorkspaceSerializer, UserSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def workspaces_view(request):
    if request.method == 'GET':
        try:
            workspaces = Workspace.objects.filter(created_by=request.user)
            serializer = WorkspaceSerializer(workspaces, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Workspace.DoesNotExist:
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
        elif Workspace.objects.filter(name=name, created_by=created_by).exists():
            errors['name'] = 'A workspace with this name already exists.'
            
        if not description:
            errors['description'] = 'This field is required.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        workspace = Workspace(name=name, description=description, created_by=created_by)
        workspace_member = WorkspaceMember(workspace=workspace, user=created_by, role=WorkspaceMember.Role.OWNER)
        
        try:
            workspace.save()
            workspace_member.save()
            serializer = WorkspaceSerializer(workspace)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def workspace_detail_view(request, pk):
    try:
        workspace = Workspace.objects.get(pk=pk, created_by=request.user)
    except Workspace.DoesNotExist:
        return Response({"error": "Workspace not found."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = WorkspaceSerializer(workspace)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    errors = {}
    if request.method == 'PUT':
        name = request.data.get('name')
        description = request.data.get('description')
        is_archived = request.data.get('is_archived') == True

        if not name:
            errors['name'] = 'This field is required.'
        elif Workspace.objects.filter(name=name, created_by=request.user).exclude(pk=pk).exists():
            errors['name'] = 'A workspace with this name already exists.'
            
        if not description:
            errors['description'] = 'This field is required.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        workspace.name = name
        workspace.description = description
        workspace.is_archived = is_archived
        workspace.save()
        serializer = WorkspaceSerializer(workspace)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        workspace.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_list(request):
    try:
        users = User.objects.exclude(pk=request.user.pk).order_by('username')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_workspace_invitation(request, workspace_id):
    try:
        workspace = Workspace.objects.get(pk=workspace_id, created_by=request.user)
    except Workspace.DoesNotExist:
        return Response({"error": "Workspace not found."}, status=status.HTTP_404_NOT_FOUND)

    errors = {}
    if request.method == 'POST':
        role = request.data.get('role')
        user_id = request.data.get('user_id')
        invited_user = User.objects.filter(pk=user_id).first()
                    
        if not role:
            errors['role'] = 'This field is required.'
        elif role not in [WorkspaceInvitation.Role.ADMIN, WorkspaceInvitation.Role.MEMBER]:
            errors['role'] = 'Invalid role. Must be either "admin" or "member".'
            
        if WorkspaceInvitation.objects.filter(workspace=workspace, invited_user=invited_user, status=WorkspaceInvitation.Status.PENDING).exists():
            errors['invitation'] = 'An invitation has already been sent to this user for this workspace.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        invitation = WorkspaceInvitation(workspace=workspace, invited_user=invited_user, invited_by=request.user, role=role, expires_at=timezone.now() + timezone.timedelta(days=7))
        notification = Notification(user=invited_user, type="INVITATION", title="Workspace Invitation", message=f"You have been invited to join the workspace '{workspace.name}'.")
        invitation.save()
        notification.save()
        return Response({"message": "Invitation sent successfully."}, status=status.HTTP_201_CREATED)