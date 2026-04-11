from rest_framework import serializers
from .models import Workflow, Node, Connection, ExecutionLog, WebhookEndpoint, Schedule

class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = ['id', 'node_id', 'node_type', 'name', 'position_x', 'position_y', 'config', 'last_executed_at']


class ConnectionSerializer(serializers.ModelSerializer):
    source_node_id = serializers.CharField(source='source_node.node_id', read_only=True)
    target_node_id = serializers.CharField(source='target_node.node_id', read_only=True)
    
    class Meta:
        model = Connection
        fields = ['id', 'source_node_id', 'source_output', 'target_node_id', 'target_input']


class WorkflowSerializer(serializers.ModelSerializer):
    nodes = NodeSerializer(many=True, read_only=True)
    connections = ConnectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Workflow
        fields = [
            'id', 'name', 'description', 'is_active', 'is_public',
            'nodes', 'connections',
            'created_at', 'updated_at', 'last_executed_at', 'execution_count'
        ]
        read_only_fields = ['created_at', 'updated_at', 'last_executed_at', 'execution_count']


class WorkflowCreateUpdateSerializer(serializers.ModelSerializer):
    """For creating/updating workflows with nodes and connections"""
    nodes = NodeSerializer(many=True, required=False)
    connections = ConnectionSerializer(many=True, required=False)
    
    class Meta:
        model = Workflow
        fields = ['id', 'name', 'description', 'is_active', 'nodes', 'connections']
    
    def create(self, validated_data):
        nodes_data = validated_data.pop('nodes', [])
        connections_data = validated_data.pop('connections', [])
        
        workflow = Workflow.objects.create(**validated_data)
        
        # Create nodes
        node_map = {}  # Map node_id to Node instance
        for node_data in nodes_data:
            node_id = node_data.pop('node_id')
            node = Node.objects.create(workflow=workflow, node_id=node_id, **node_data)
            node_map[node_id] = node
        
        # Create connections
        for conn_data in connections_data:
            Connection.objects.create(
                workflow=workflow,
                source_node=node_map[conn_data['source_node_id']],
                source_output=conn_data.get('source_output', 'main'),
                target_node=node_map[conn_data['target_node_id']],
                target_input=conn_data.get('target_input', 'main')
            )
        
        return workflow


class ExecutionLogSerializer(serializers.ModelSerializer):
    workflow_name = serializers.CharField(source='workflow.name', read_only=True)
    
    class Meta:
        model = ExecutionLog
        fields = [
            'id', 'workflow_name', 'status',
            'started_at', 'finished_at', 'duration_ms',
            'input_data', 'output_data', 'error_message',
            'trigger_type', 'node_logs'
        ]


class WebhookEndpointSerializer(serializers.ModelSerializer):
    full_url = serializers.SerializerMethodField()
    
    class Meta:
        model = WebhookEndpoint
        fields = ['id', 'path', 'is_active', 'full_url', 'created_at']
    
    def get_full_url(self, obj):
        from django.conf import settings
        base_url = getattr(settings, 'WEBHOOK_BASE_URL', 'https://ai-builder.seekhowithrua.com')
        return f"{base_url}/api/webhooks/{obj.path}/"


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'cron_expression', 'timezone', 'is_active', 'last_run_at', 'next_run_at']
