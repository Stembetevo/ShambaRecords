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
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class FieldUpdateSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source='agent.get_full_name', read_only=True)

    class Meta:
        model = FieldUpdate
        fields = ['id', 'previous_stage', 'new_stage', 'note', 'agent_name', 'created_at']


class FieldSerializer(serializers.ModelSerializer):
    status = serializers.ReadOnlyField()
    assigned_agent_name = serializers.CharField(source='assigned_agent.get_full_name', read_only=True)
    updates = FieldUpdateSerializer(many=True, read_only=True)

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

    status = serializers.ReadOnlyField()
    assigned_agent_name = serializers.CharField(source='assigned_agent.get_full_name', read_only=True)

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
