from django.urls import path
from .views.auth_view import register_view, login_view, logout_view
from .views.workspaces_view import workspaces_view, workspace_detail_view, get_users_list, send_workspace_invitation
from .views.profile_view import profile_view
from .views.notification_view import get_notifications_view, notification_detail_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('workspaces/', workspaces_view, name='workspaces'),
    path('workspaces/<int:pk>/', workspace_detail_view, name='workspace_detail'),
    path('users/', get_users_list, name='get_users_list'),
    path('workspaces/<int:workspace_id>/invite/', send_workspace_invitation, name='send_workspace_invitation'),
    path('profile/', profile_view, name='profile'),
    path('notifications/', get_notifications_view, name='get_notifications'),
    path('notifications/<int:pk>/', notification_detail_view, name='notification_detail'),
]