from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from .views import WorkListView, SkillListView

router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('works/', WorkListView.as_view(), name='work_list'),
    path('skills/', SkillListView.as_view(), name='skill_list'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

