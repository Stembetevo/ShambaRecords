from datetime import date, timedelta

from django.core.management.base import BaseCommand

from core.models import Field, User


class Command(BaseCommand):
    help = 'Seed database with admin, agents, and sample fields'

    def handle(self, *args, **options):
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@shamba.local',
                'first_name': 'System',
                'last_name': 'Admin',
                'role': 'admin',
            },
        )
        admin_user.role = 'admin'
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.set_password('admin1234')
        admin_user.save()

        agent_specs = [
            ('agent1', 'agent1234', 'Amina', 'Njeri'),
            ('agent2', 'agent2234', 'Brian', 'Otieno'),
            ('agent3', 'agent3234', 'Cynthia', 'Kamau'),
        ]

        agents = []
        for username, password, first_name, last_name in agent_specs:
            agent, _ = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@shamba.local',
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'agent',
                },
            )
            agent.role = 'agent'
            agent.set_password(password)
            agent.save()
            agents.append(agent)

        field_specs = [
            ('North Plot A', 'Maize', 10, 'planted', agents[0]),
            ('River Bend', 'Tomatoes', 40, 'growing', agents[1]),
            ('Greenhouse 1', 'Capsicum', 95, 'growing', agents[2]),
            ('East Terrace', 'Beans', 118, 'ready', agents[0]),
            ('Lower Valley', 'Potatoes', 130, 'harvested', agents[1]),
            ('Hilltop Patch', 'Onions', 22, 'planted', agents[2]),
        ]

        for name, crop_type, days_ago, stage, assigned_agent in field_specs:
            Field.objects.get_or_create(
                name=name,
                defaults={
                    'crop_type': crop_type,
                    'planting_date': date.today() - timedelta(days=days_ago),
                    'stage': stage,
                    'assigned_agent': assigned_agent,
                    'created_by': admin_user,
                },
            )

        self.stdout.write(self.style.SUCCESS('Seed data created/updated successfully.'))
