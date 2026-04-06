from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Workflow, Node, Connection, ExecutionLog
from .serializers import (
    WorkflowSerializer, WorkflowCreateUpdateSerializer,
    NodeSerializer, ConnectionSerializer, ExecutionLogSerializer
)
from engine.executor import WorkflowExecutor


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def workflow_list_create(request):
    """List all workflows or create new workflow"""
    if request.method == 'GET':
        workflows = Workflow.objects.filter(user=request.user)
        serializer = WorkflowSerializer(workflows, many=True)
        return Response(serializer.data)
    
    # POST - Create workflow
    serializer = WorkflowCreateUpdateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def workflow_detail(request, pk):
    """Get, update or delete a specific workflow"""
    workflow = get_object_or_404(Workflow, pk=pk, user=request.user)
    
    if request.method == 'GET':
        serializer = WorkflowSerializer(workflow)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = WorkflowCreateUpdateSerializer(workflow, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        workflow.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def workflow_execute(request, pk):
    """Execute a workflow manually"""
    workflow = get_object_or_404(Workflow, pk=pk, user=request.user)
    
    input_data = request.data.get('input_data', {})
    
    # Create execution log
    execution = ExecutionLog.objects.create(
        workflow=workflow,
        status='running',
        input_data=input_data,
        trigger_type='manual'
    )
    
    # Execute workflow
    executor = WorkflowExecutor(workflow, execution)
    result = executor.run(input_data)
    
    return Response({
        'execution_id': execution.id,
        'status': execution.status,
        'output': result,
        'duration_ms': execution.duration_ms
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def workflow_executions(request, pk):
    """Get execution history for a workflow"""
    workflow = get_object_or_404(Workflow, pk=pk, user=request.user)
    executions = ExecutionLog.objects.filter(workflow=workflow)[:50]
    serializer = ExecutionLogSerializer(executions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def node_types_list(request):
    """Get all available node types with their configurations"""
    from .node_definitions import NODE_TYPES
    return Response(NODE_TYPES)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_node(request):
    """Test a single node execution"""
    node_type = request.data.get('node_type')
    config = request.data.get('config', {})
    input_data = request.data.get('input_data', {})
    
    from engine.node_runner import NodeRunner
    
    runner = NodeRunner(node_type, config)
    result = runner.execute(input_data)
    
    return Response({
        'success': result.get('success', False),
        'output': result.get('output'),
        'error': result.get('error'),
        'execution_time_ms': result.get('execution_time_ms')
    })
