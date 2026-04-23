from django.db.models import Case, CharField, Count, Q, Value, When
from django.utils import timezone
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
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
	lookup_field = 'public_id'
	lookup_value_regex = '[0-9a-fA-F-]{36}'

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

	def perform_update(self, serializer):
		if self.request.user.role != 'admin':
			raise PermissionDenied('Only admins can update fields.')
		serializer.save()

	def perform_destroy(self, instance):
		if self.request.user.role != 'admin':
			raise PermissionDenied('Only admins can delete fields.')
		instance.delete()

	@action(detail=True, methods=['post'], url_path='updates')
	def add_update(self, request, pk=None):
		field = self.get_object()
		user = request.user

		if user.role == 'agent' and field.assigned_agent != user:
			return Response({'detail': 'You are not assigned to this field.'}, status=403)

		previous_stage = field.stage
		new_stage = request.data.get('new_stage', field.stage)
		note = request.data.get('note', '')
		valid_stages = {choice for choice, _ in Field.STAGE_CHOICES}

		if new_stage not in valid_stages:
			raise ValidationError({'new_stage': 'Invalid stage value.'})

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
			queryset = Field.objects.all()
		else:
			queryset = Field.objects.filter(assigned_agent=user)

		today = timezone.localdate()
		status_annotated = queryset.annotate(
			status_bucket=Case(
				When(stage='harvested', then=Value('completed')),
				When(stage='planted', planting_date__lt=today - timezone.timedelta(days=14), then=Value('at_risk')),
				When(stage='growing', planting_date__lt=today - timezone.timedelta(days=90), then=Value('at_risk')),
				When(stage='ready', planting_date__lt=today - timezone.timedelta(days=120), then=Value('at_risk')),
				default=Value('active'),
				output_field=CharField(),
			)
		)

		aggregated = status_annotated.aggregate(
			total=Count('id'),
			active=Count('id', filter=Q(status_bucket='active')),
			at_risk=Count('id', filter=Q(status_bucket='at_risk')),
			completed=Count('id', filter=Q(status_bucket='completed')),
			planted=Count('id', filter=Q(stage='planted')),
			growing=Count('id', filter=Q(stage='growing')),
			ready=Count('id', filter=Q(stage='ready')),
			harvested=Count('id', filter=Q(stage='harvested')),
		)

		return Response(
			{
				'total': aggregated['total'],
				'by_status': {
					'active': aggregated['active'],
					'at_risk': aggregated['at_risk'],
					'completed': aggregated['completed'],
				},
				'by_stage': {
					'planted': aggregated['planted'],
					'growing': aggregated['growing'],
					'ready': aggregated['ready'],
					'harvested': aggregated['harvested'],
				},
			}
		)
