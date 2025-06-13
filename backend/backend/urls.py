from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from .views import WorkListView, SkillListView,SoftSkillListView, send_feedback_email, ChatView

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

router = DefaultRouter()

# Configurazione di Swagger/OpenAPI
schema_view = get_schema_view(
    openapi.Info(
        title="Portfolio API",
        default_version='v1',
        description="API per il portfolio personale",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="andreapesce2002@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('works/', WorkListView.as_view(), name='work_list'),
    path('skills/', SkillListView.as_view(), name='skill_list'),
    path('softskills/', SoftSkillListView.as_view(), name='softSkill_list'),
    path('send-email/', send_feedback_email, name='send_feedback_email'),
    
    #chat
    # Crea una nuova chat
    path('chat/create/', ChatView.as_view({'post': 'create'}), name='create_chat'),

    # Elimina una chat
    path('chat/<int:chat_id>/delete/', ChatView.as_view({'delete': 'delete'}), name='delete_chat'),
    
    # Effettua il login
    path('chat/login/', ChatView.as_view({'post': 'login'}), name='chat_login'),
    
    # Invia un messaggio a una chat
    path('chat/<int:chat_id>/messages/', ChatView.as_view({'post': 'post_message'}), name='send_message'),
    
    # Ottiene i messaggi connessi tra due chat
    path('chat/conversations/<int:chat1_id>/<int:chat2_id>/', ChatView.as_view({'get': 'get_messaggi_connessi'}), name='connected_messages'),

]
# Aggiungi gli URL per la documentazione Swagger/OpenAPI
urlpatterns += [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

