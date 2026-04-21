import os
import secrets
from datetime import date, timedelta

from django.conf import settings
from django.core.management.base import BaseCommand

from core.models import Field, User


class Command(BaseCommand):
    help = 'Seed database with admin, agents, and sample fields'

    def handle(self, *args, **options):
        django_env = os.getenv('DJANGO_ENV', '').strip().lower()
        can_set_passwords = settings.DEBUG and django_env != 'production'

        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@shamba.local',
                'first_name': 'System',
                'last_name': 'Admin',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            },
        )
        admin_user.role = 'admin'
        admin_user.is_staff = True
        admin_user.is_superuser = True

        if created:
            if can_set_passwords:
                generated_password = secrets.token_urlsafe(12)
                admin_user.set_password(generated_password)
                self.stdout.write(
                    self.style.WARNING(
                        f'Created admin user "admin" with generated password: {generated_password}'
                    )
                )
            else:
                admin_user.set_unusable_password()
                self.stdout.write(
                    self.style.WARNING(
                        'Created admin user "admin" with unusable password because environment is production-like.'
                    )
                )

        admin_user.save()

        agent_specs = [
            ('agent1', 'Amina', 'Njeri'),
            ('agent2', 'Brian', 'Otieno'),
            ('agent3', 'Cynthia', 'Kamau'),
        ]

        agents = []
        for username, first_name, last_name in agent_specs:
            agent, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@shamba.local',
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'agent',
                },
            )

            if created:
                if can_set_passwords:
                    generated_password = secrets.token_urlsafe(12)
                    agent.set_password(generated_password)
                    self.stdout.write(
                        self.style.WARNING(
                            f'Created agent user "{username}" with generated password: {generated_password}'
                        )
                    )
                else:
                    agent.set_unusable_password()
                    self.stdout.write(
                        self.style.WARNING(
                            f'Created agent user "{username}" with unusable password because environment is production-like.'
                        )
                    )
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
