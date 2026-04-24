from rest_framework import serializers

from .models import Field, FieldUpdate, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        validated_data.pop('role', None)
        return User.objects.create_user(**validated_data, role='agent')


class FieldUpdateSerializer(serializers.ModelSerializer):
    agent_name = serializers.SerializerMethodField()

    def get_agent_name(self, obj):
        if not obj.agent:
            return None
        return obj.agent.get_full_name()

    class Meta:
        model = FieldUpdate
        fields = ['id', 'previous_stage', 'new_stage', 'note', 'agent_name', 'created_at']


class FieldSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True)
    status = serializers.ReadOnlyField()
    assigned_agent_name = serializers.SerializerMethodField()
    updates = FieldUpdateSerializer(many=True, read_only=True)

    def get_assigned_agent_name(self, obj):
        if not obj.assigned_agent:
            return None

        full_name = obj.assigned_agent.get_full_name().strip()
        return full_name or obj.assigned_agent.username

    class Meta:
        model = Field
        fields = [
            'id',
            'name',
            'crop_type',
            'planting_date',
            'stage',
            'status',
            'assigned_agent',
            'assigned_agent_name',
            'updates',
            'created_at',
            'updated_at',
        ]


class FieldListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views - no nested updates."""

    id = serializers.UUIDField(source='public_id', read_only=True)
    status = serializers.ReadOnlyField()
    assigned_agent_name = serializers.SerializerMethodField()

    def get_assigned_agent_name(self, obj):
        if not obj.assigned_agent:
            return None

        full_name = obj.assigned_agent.get_full_name().strip()
        return full_name or obj.assigned_agent.username

    class Meta:
        model = Field
        fields = [
            'id',
            'name',
            'crop_type',
            'planting_date',
            'stage',
            'status',
            'assigned_agent',
            'assigned_agent_name',
            'created_at',
        ]
