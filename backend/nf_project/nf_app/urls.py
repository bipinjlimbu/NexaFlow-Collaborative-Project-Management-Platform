from django.urls import path
from .views.auth_view import register_view, login_view, logout_view
from .views.workspaces_view import workspaces_view, workspace_detail_view, get_users_list, send_workspace_invitation, promote_workspace_member, demote_workspace_member, remove_workspace_member
from .views.profile_view import profile_view
from .views.notification_view import get_notifications_view, notification_detail_view
from .views.invitation_view import get_invitations_view, accept_invitation_view, decline_invitation_view
from .views.project_view import projects_view

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
    path('invitations/', get_invitations_view, name='get_invitations'),
    path('invitations/<int:pk>/accept/', accept_invitation_view, name='accept_invitation'),
    path('invitations/<int:pk>/decline/', decline_invitation_view, name='decline_invitation'),
    path('workspaces/<int:workspace_id>/members/<int:user_id>/promote/', promote_workspace_member, name='promote_workspace_member'),
    path('workspaces/<int:workspace_id>/members/<int:user_id>/demote/', demote_workspace_member, name='demote_workspace_member'),
    path('workspaces/<int:workspace_id>/members/<int:user_id>/remove/', remove_workspace_member, name='remove_workspace_member'),
    path('projects/', projects_view, name='projects'),
]