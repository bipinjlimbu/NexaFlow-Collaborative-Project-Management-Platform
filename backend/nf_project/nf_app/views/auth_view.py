from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    errors = {}
    if request.method == 'POST':
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        first_name = request.data.get('first_name','')
        last_name = request.data.get('last_name','')
        phone_number = request.data.get('phone_number','')
        address = request.data.get('address','')
        profile_picture = request.data.get('profile_picture','')
        
        if not username:
            errors['username'] = 'This field is required.'
        elif User.objects.filter(username=username).exists():
            errors['username'] = 'A user with that username already exists.'
            
        if not email:
            errors['email'] = 'This field is required.'
        elif User.objects.filter(email=email).exists():
            errors['email'] = 'A user with that email already exists.'
            
        if not password:
            errors['password'] = 'This field is required.'
        if password != confirm_password:
            errors['confirm_password'] = 'Passwords do not match.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            address=address,
            profile_picture=profile_picture
        )
        user.save()
        
        if user is not None:
            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response({'error': 'User registration failed.'}, status=status.HTTP_400_BAD_REQUEST)
    
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    errors = {}
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username:
            errors['username'] = 'This field is required.'
        if not password:
            errors['password'] = 'This field is required.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            tokens = get_tokens_for_user(user)
            return Response({'message': 'Login successful.', 'tokens': tokens}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)