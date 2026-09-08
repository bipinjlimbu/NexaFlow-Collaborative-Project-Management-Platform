from rest_framework import serializers
from .models import User, Workspaces, WorkspaceMembers, Projects, ProjectMembers, Tasks, Labels, TaskLabels, Comments, attachments, WorkspaceInvitations, Notifications, Activities

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspaces
        fields = '__all__'
        
class WorkspaceMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceMembers
        fields = '__all__'
        
class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = '__all__'
        
class ProjectMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMembers
        fields = '__all__'
        
class TasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = '__all__'
        
class LabelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Labels
        fields = '__all__'
        
class TaskLabelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskLabels
        fields = '__all__'
        
class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = '__all__'
        
class AttachmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = attachments
        fields = '__all__'
        
class WorkspaceInvitationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceInvitations
        fields = '__all__'
        
class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = '__all__'
        
class ActivitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activities
        fields = '__all__'