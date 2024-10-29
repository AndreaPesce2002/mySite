from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from .views import WorkListView, SkillListView,SoftSkillListView, send_feedback_email, ChatView

router = DefaultRouter()

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
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

