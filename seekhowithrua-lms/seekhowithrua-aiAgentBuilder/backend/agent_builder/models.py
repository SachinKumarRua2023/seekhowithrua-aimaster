from django.db import models
from django.contrib.auth import get_user_model
import json

User = get_user_model()

class Workflow(models.Model):
    """
    A workflow is a collection of nodes and connections
    Similar to n8n workflow
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workflows')
    
    # Workflow settings
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)
    
    # Execution settings
    timeout_seconds = models.IntegerField(default=300)  # 5 minutes default
    max_retries = models.IntegerField(default=3)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_executed_at = models.DateTimeField(null=True, blank=True)
    execution_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.user.username})"


class Node(models.Model):
    """
    A single node in the workflow
    Can be trigger, action, or data node
    """
    NODE_TYPES = [
        # Triggers
        ('trigger_schedule', 'Schedule Trigger'),
        ('trigger_webhook', 'Webhook Trigger'),
        ('trigger_manual', 'Manual Trigger'),
        ('trigger_email', 'Email Trigger'),
        ('trigger_telegram', 'Telegram Trigger'),
        
        # AI Nodes
        ('ai_llm', 'LLM Prompt'),
        ('ai_chat', 'Chat Agent'),
        ('ai_rag', 'RAG Search'),
        ('ai_embedding', 'Generate Embedding'),
        ('ai_image', 'Image Generation'),
        
        # Data Nodes
        ('data_http', 'HTTP Request'),
        ('data_postgres', 'PostgreSQL Query'),
        ('data_transform', 'Data Transform'),
        ('data_filter', 'Filter'),
        ('data_merge', 'Merge'),
        ('data_split', 'Split'),
        
        # Action Nodes
        ('action_email', 'Send Email'),
        ('action_sms', 'Send SMS'),
        ('action_telegram', 'Send Telegram'),
        ('action_webhook', 'Webhook Call'),
        ('action_file', 'File Operation'),
        ('action_delay', 'Wait/Delay'),
    ]
    
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='nodes')
    node_id = models.CharField(max_length=50)  # Unique within workflow (e.g., "node_1")
    node_type = models.CharField(max_length=50, choices=NODE_TYPES)
    name = models.CharField(max_length=255)
    
    # Position in visual editor
    position_x = models.FloatField(default=0)
    position_y = models.FloatField(default=0)
    
    # Node configuration (JSON)
    config = models.JSONField(default=dict)
    
    # Execution state
    last_execution_result = models.JSONField(null=True, blank=True)
    last_executed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['workflow', 'node_id']
    
    def __str__(self):
        return f"{self.name} ({self.node_type})"


class Connection(models.Model):
    """
    Connects two nodes in a workflow
    """
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='connections')
    
    # Source node
    source_node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='outputs')
    source_output = models.CharField(max_length=50, default='main')  # Output port name
    
    # Target node
    target_node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='inputs')
    target_input = models.CharField(max_length=50, default='main')  # Input port name
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['workflow', 'source_node', 'target_node', 'source_output', 'target_input']
    
    def __str__(self):
        return f"{self.source_node.name} → {self.target_node.name}"


class ExecutionLog(models.Model):
    """
    Log of workflow executions
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='executions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Execution details
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    duration_ms = models.IntegerField(null=True, blank=True)
    
    # Results
    input_data = models.JSONField(null=True, blank=True)
    output_data = models.JSONField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    
    # Node execution logs
    node_logs = models.JSONField(default=list)  # List of node execution results
    
    # Trigger info
    trigger_type = models.CharField(max_length=50, blank=True)
    trigger_data = models.JSONField(null=True, blank=True)
    
    class Meta:
        ordering = ['-started_at']
    
    def __str__(self):
        return f"{self.workflow.name} - {self.status} ({self.started_at})"


class WebhookEndpoint(models.Model):
    """
    Webhook endpoints for trigger_webhook nodes
    """
    workflow = models.OneToOneField(Workflow, on_delete=models.CASCADE, related_name='webhook')
    path = models.CharField(max_length=100, unique=True)  # e.g., "webhook_abc123"
    is_active = models.BooleanField(default=True)
    secret_key = models.CharField(max_length=100)  # For verification
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Webhook for {self.workflow.name}"


class Schedule(models.Model):
    """
    Cron schedules for trigger_schedule nodes
    """
    workflow = models.OneToOneField(Workflow, on_delete=models.CASCADE, related_name='schedule')
    
    # Cron expression or simplified format
    cron_expression = models.CharField(max_length=100)  # "0 9 * * *" = 9am daily
    timezone = models.CharField(max_length=50, default='Asia/Kolkata')
    
    is_active = models.BooleanField(default=True)
    last_run_at = models.DateTimeField(null=True, blank=True)
    next_run_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Schedule for {self.workflow.name} ({self.cron_expression})"
