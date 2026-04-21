from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
	ROLE_CHOICES = [
		('admin', 'Admin'),
		('agent', 'Agent'),
	]
	role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='agent')

	def is_admin(self):
		return self.role == 'admin'


class Field(models.Model):
	STAGE_CHOICES = [
		('planted', 'Planted'),
		('growing', 'Growing'),
		('ready', 'Ready'),
		('harvested', 'Harvested'),
	]

	name = models.CharField(max_length=255)
	crop_type = models.CharField(max_length=255)
	planting_date = models.DateField()
	stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='planted')
	assigned_agent = models.ForeignKey(
		User,
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name='assigned_fields',
		limit_choices_to={'role': 'agent'},
	)
	created_by = models.ForeignKey(
		User,
		on_delete=models.SET_NULL,
		null=True,
		related_name='created_fields',
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	@property
	def status(self):
		from datetime import date

		days_since_planting = (date.today() - self.planting_date).days

		if self.stage == 'harvested':
			return 'completed'

		if self.stage == 'planted' and days_since_planting > 14:
			return 'at_risk'

		if self.stage == 'growing' and days_since_planting > 90:
			return 'at_risk'

		if self.stage == 'ready' and days_since_planting > 120:
			return 'at_risk'

		return 'active'

	def __str__(self):
		return f'{self.name} ({self.crop_type})'


class FieldUpdate(models.Model):
	field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='updates')
	agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updates')
	previous_stage = models.CharField(max_length=20, blank=True)
	new_stage = models.CharField(max_length=20)
	note = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']
