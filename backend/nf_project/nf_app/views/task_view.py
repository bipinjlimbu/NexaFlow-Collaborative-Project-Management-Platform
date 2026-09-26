from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Task, Project, User
from ..serializers import TaskSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def tasks_view(request):
    if request.method == 'GET':
        try:
            tasks = Task.objects.filter(project__workspace__members__user=request.user)
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response({"error": "Tasks not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    errors = {}
    if request.method == 'POST':
        title = request.data.get('title')
        description = request.data.get('description')
        task_status = request.data.get('status', Task.Status.BACKLOG)
        priority = request.data.get('priority', Task.Priority.MEDIUM)
        project_id = request.data.get('project')
        due_date = request.data.get('due_date')
        created_by = request.user
        assigned_to_id = request.data.get('assigned_to')
        
        project = Project.objects.filter(id=project_id).first()
        assigned_to = User.objects.filter(id=assigned_to_id).first() if assigned_to_id else None
        
        if not title:
            errors['title'] = 'This field is required.'
            
        if not description:
            errors['description'] = 'This field is required.'
            
        if not project:
            errors['project'] = 'This field is required.'
            
        if not due_date:
            errors['due_date'] = 'This field is required.'
            
        if not assigned_to:
            errors['assigned_to'] = 'This field is required.'
        elif assigned_to and not project.members.filter(user=assigned_to).exists():
            errors['assigned_to'] = 'The assigned user is not a member of the project.'
            
        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            task = Task.objects.create(
                title=title,
                description=description,
                project=project,
                status=task_status,
                priority=priority,
                due_date=due_date,
                assigned_to=assigned_to,
                created_by=created_by
            )
            serializer = TaskSerializer(task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated])
def task_detail_view(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    errors = {}
    if request.method == 'PUT':
        title = request.data.get('title')
        description = request.data.get('description')
        task_status = request.data.get('status', task.status)
        priority = request.data.get('priority', task.priority)
        due_date = request.data.get('due_date', task.due_date)
        assigned_to_id = request.data.get('assigned_to', task.assigned_to.id if task.assigned_to else None)
        assigned_to = User.objects.filter(id=assigned_to_id).first() if assigned_to_id else None
        
        if not title:
            errors['title'] = 'This field is required.'
            
        if not description:
            errors['description'] = 'This field is required.'
            
        if not due_date:
            errors['due_date'] = 'This field is required.'
            
        if not assigned_to:
            errors['assigned_to'] = 'This field is required.'
        elif assigned_to and not task.project.members.filter(user=assigned_to).exists():
            errors['assigned_to'] = 'The assigned user is not a member of the project.'
            
        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        
        task.title = title
        task.description = description
        task.status = task_status
        task.priority = priority
        task.due_date = due_date
        task.assigned_to = assigned_to
        task.save()
        serializer = TaskSerializer(task)    
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    if request.method == 'DELETE':
        task.delete()
        return Response({"message": "Task deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_task_status_view(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if new_status not in dict(Task.Status.choices):
        return Response({"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)
        
    task.status = new_status
    if new_status == Task.Status.DONE:
        task.completed_at = task.updated_at
    else:
        task.completed_at = None
    task.save()
    return Response({"message": "Task status updated successfully."}, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_task_priority_view(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

    new_priority = request.data.get('priority')
    if new_priority not in dict(Task.Priority.choices):
        return Response({"error": "Invalid priority value."}, status=status.HTTP_400_BAD_REQUEST)

    task.priority = new_priority
    task.save()
    return Response({"message": "Task priority updated successfully."}, status=status.HTTP_200_OK)