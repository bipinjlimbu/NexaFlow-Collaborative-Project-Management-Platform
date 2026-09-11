from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import User
from ..serializers import UserSerializer

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    try:
        user = User.objects.get(pk=request.user.pk)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    errors = {}
    if request.method == 'PUT':
        username = request.data.get('username')
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')
        address = request.data.get('address')
        profile_picture = request.FILES.get('profile_picture')
        
        if not username:
            errors['username'] = 'This field is required.'
        elif User.objects.filter(username=username).exclude(pk=user.pk).exists():
            errors['username'] = 'A user with that username already exists.'
            
        if not email:
            errors['email'] = 'This field is required.'
        elif User.objects.filter(email=email).exclude(pk=user.pk).exists():
            errors['email'] = 'A user with that email already exists.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            
        user.username = username
        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.phone_number = phone_number
        user.address = address
        if profile_picture:
            user.profile_picture = profile_picture
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        user.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)