from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Field, FieldUpdate, User
from .permissions import IsAdmin
from .serializers import (
	FieldListSerializer,
	FieldSerializer,
	FieldUpdateSerializer,
	RegisterSerializer,
	UserSerializer,
)


class RegisterView(generics.CreateAPIView):
	queryset = User.objects.all()
	serializer_class = RegisterSerializer
	permission_classes = [AllowAny]


class MeView(generics.RetrieveAPIView):
	serializer_class = UserSerializer
	permission_classes = [IsAuthenticated]

	def get_object(self):
		return self.request.user


class AgentListView(generics.ListAPIView):
	serializer_class = UserSerializer
	permission_classes = [IsAdmin]

	def get_queryset(self):
		return User.objects.filter(role='agent')


class FieldViewSet(viewsets.ModelViewSet):
	permission_classes = [IsAuthenticated]

	def get_serializer_class(self):
		if self.action == 'list':
			return FieldListSerializer
		return FieldSerializer

	def get_queryset(self):
		user = self.request.user
		if user.role == 'admin':
			return Field.objects.all().select_related('assigned_agent')
		return Field.objects.filter(assigned_agent=user).select_related('assigned_agent')

	def perform_create(self, serializer):
		if self.request.user.role != 'admin':
			raise PermissionDenied('Only admins can create fields.')
		serializer.save(created_by=self.request.user)

	@action(detail=True, methods=['post'], url_path='updates')
	def add_update(self, request, pk=None):
		field = self.get_object()
		user = request.user

		if user.role == 'agent' and field.assigned_agent != user:
			return Response({'detail': 'You are not assigned to this field.'}, status=403)

		previous_stage = field.stage
		new_stage = request.data.get('new_stage', field.stage)
		note = request.data.get('note', '')

		field.stage = new_stage
		field.save()

		update = FieldUpdate.objects.create(
			field=field,
			agent=user,
			previous_stage=previous_stage,
			new_stage=new_stage,
			note=note,
		)

		return Response(FieldUpdateSerializer(update).data, status=201)


class DashboardView(generics.GenericAPIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
		if user.role == 'admin':
			fields = Field.objects.all()
		else:
			fields = Field.objects.filter(assigned_agent=user)

		statuses = [f.status for f in fields]
		stages = [f.stage for f in fields]

		return Response(
			{
				'total': len(fields),
				'by_status': {
					'active': statuses.count('active'),
					'at_risk': statuses.count('at_risk'),
					'completed': statuses.count('completed'),
				},
				'by_stage': {
					'planted': stages.count('planted'),
					'growing': stages.count('growing'),
					'ready': stages.count('ready'),
					'harvested': stages.count('harvested'),
				},
			}
		)
