from rest_framework import serializers
from .models import User, Workspaces

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspaces
        fields = '__all__'