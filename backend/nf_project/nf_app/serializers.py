from rest_framework import serializers
from .models import User, Workspace, WorkspaceMember, Project, ProjectMember, Task, Label, TaskLabel, Comment, Attachment, WorkspaceInvitation, Notification, Activity

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
class WorkspaceSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()
    projects_count = serializers.SerializerMethodField()
    
    def get_members(self, obj):
        members = WorkspaceMember.objects.filter(workspace=obj)
        return WorkspaceMemberSerializer(members, many=True).data
    
    def get_members_count(self, obj):
        return WorkspaceMember.objects.filter(workspace=obj).count()
    
    def get_projects_count(self, obj):
        return Project.objects.filter(workspace=obj).count()

    class Meta:
        model = Workspace
        fields = '__all__'
        
class WorkspaceMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceMember
        fields = '__all__'
        
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        
class ProjectMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMember
        fields = '__all__'
        
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        
class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = '__all__'
        
class TaskLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskLabel
        fields = '__all__'
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        
class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = '__all__'
        
class WorkspaceInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceInvitation
        fields = '__all__'
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        
class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'