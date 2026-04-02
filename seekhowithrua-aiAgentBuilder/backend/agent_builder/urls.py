from django.urls import path
from . import views

urlpatterns = [
    # Workflow CRUD
    path('workflows/', views.workflow_list_create, name='workflow-list-create'),
    path('workflows/<int:pk>/', views.workflow_detail, name='workflow-detail'),
    
    # Workflow execution
    path('workflows/<int:pk>/execute/', views.workflow_execute, name='workflow-execute'),
    path('workflows/<int:pk>/executions/', views.workflow_executions, name='workflow-executions'),
    
    # Node types and testing
    path('node-types/', views.node_types_list, name='node-types'),
    path('nodes/test/', views.test_node, name='test-node'),
]
