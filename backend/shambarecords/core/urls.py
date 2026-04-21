from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AgentListView, DashboardView, FieldViewSet, MeView, RegisterView

router = DefaultRouter()
router.register(r'fields', FieldViewSet, basename='field')

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('me/', MeView.as_view()),
    path('agents/', AgentListView.as_view()),
    path('dashboard/', DashboardView.as_view()),
    path('', include(router.urls)),
]
