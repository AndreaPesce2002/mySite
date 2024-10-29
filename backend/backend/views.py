from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Work,Skill,SoftSkill, Chat
from .serializers import WorkSerializer,SkillSerializer,SoftSkillSerializer,ChatSerializer,MessaggioSerializer

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMultiAlternatives
import json

from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password

from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet

from functools import wraps
from rest_framework.response import Response
from rest_framework import status

import jwt
from datetime import datetime, timedelta
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Chat

from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from datetime import datetime
from django.conf import settings
from functools import wraps

class WorkListView(APIView):
    def get(self, request):
        works = Work.objects.all()
        serializer = WorkSerializer(works, many=True)
        return Response(serializer.data)
    
class SkillListView(APIView):
    def get(self, request):
        skill = Skill.objects.all()
        serializer = SkillSerializer(skill, many=True)
        return Response(serializer.data)

class SoftSkillListView(APIView):
    def get(self, request):
        Softskill = SoftSkill.objects.all()
        serializer = SoftSkillSerializer(Softskill, many=True)
        return Response(serializer.data)

@csrf_exempt
def send_feedback_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        message = data.get('message', '')
        subject = data.get('subject', '')
        from_email = 'andrea.pesce.lavoro@gmail.com'
        recipient_list = ['andrea.pesce.lavoro@gmail.com']

        email = EmailMultiAlternatives(subject, message, from_email, recipient_list)
        email.send()

        return JsonResponse({'status': 'ok'})
    else:
        return JsonResponse({'status': 'invalid'}, status=400)


### chat ####
class ChatView(ModelViewSet):
    
    def login_required(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            # Controlla se l'Authorization è presente nella richiesta
            if 'Authorization' not in request.headers:
                return Response({'status': 'invalid', 'message': 'Authorization mancante'}, status=status.HTTP_401_UNAUTHORIZED)

            # Estrae il token di autorizzazione
            token = request.headers['Authorization'].split()[0]

            # Verifica se il token è valido e non è scaduto
            try:
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                
                # Controllo della data di scadenza
                if decoded_token['exp'] <= datetime.utcnow().timestamp():
                    return Response({'status': 'invalid', 'message': 'Token scaduto'}, status=status.HTTP_401_UNAUTHORIZED)
                
                # Se il token è valido e non è scaduto, recupera l'utente associato al token
                user_id = decoded_token['user_id']
                user = Chat.objects.get(id=user_id)
                
                #controlla che il token sia quello salvato dall'user
                if user.temporanial_token != token:
                    return Response({'status': 'invalid', 'message': 'Token non valido'}, status=status.HTTP_401_UNAUTHORIZED)
                
                #controlla che il tempo sia meno di 3 minuti
                if datetime.utcnow().timestamp() - decoded_token['exp'] > 180:
                    # Restituisci un nuovo token JWT
                    payload = {
                        'user_id': user.id,
                        'exp': datetime.utcnow() + timedelta(hours=1)
                    }
                    new_code = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                    
                    #salva il nuovo token
                    user.temporanial_token = new_code
                    user.save()
                    
                    #invia la risposta al forntand
                    return Response({'status': 'updated', 'message': 'Token aggiornato', 'data': {'token': new_code}}, status=status.HTTP_200_OK)
                
                return func(request, *args, **kwargs)
            
            except jwt.ExpiredSignatureError:
                return Response({'status': 'invalid', 'message': 'Token scaduto'}, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError:
                return Response({'status': 'invalid', 'message': 'Token non valido'}, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                return Response({'status': 'invalid', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return wrapper

    @action(detail=False, methods=['post'], url_path='create-chat')
    def create(self, request):
        # Crea una nuova chat
        chat_data = request.data
        serializer = ChatSerializer(data=chat_data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response({'status': 'ok'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'status': 'invalid','message': 'errore durante il salvataggio', 'errors': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            errors = []
            for field, error in serializer.errors.items():
                if 'exist' in str(error).lower():
                    return Response({'status': 'element exist', 'message': f'Esiste già un utente con questo {field}', 'errors': serializer.errors}, status=status.HTTP_404_NOT_FOUND)
                else:
                    errors.append(f"{field}: {error[0]}")
            if errors:
                return Response({'status': 'invalid', 'message': 'errore durante la creazione', 'errors': errors}, status=status.HTTP_400_BAD_REQUEST)


    @method_decorator(login_required, name='dispatch')
    @permission_classes([IsAuthenticated])
    @action(detail=True, methods=['delete'])
    def delete(self, request, chat_id):
        # Elimina una chat
        try:
            chat = Chat.objects.get(id=chat_id)
            chat.delete()
            return Response({'status': 'ok'})
        except Chat.DoesNotExist:
            return Response({'status': 'not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = Chat.objects.get(email=email)
        except Chat.DoesNotExist:
            return Response({'status': 'invalid', 'message': 'Utente non trovato'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.check_password(password):
            return Response({'status': 'invalid', 'message': 'Credenziali non valide'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Genera un payload per il JWT
        payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(minutes=60)  # Token scade dopo 60 minuti
        }
        
        # Genera il token JWT
        encoded_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        
        #aggiungi il token all'user
        user.temporanial_token = encoded_token
        user.save()
        
        return Response({
            'status': 'ok',
            'message': 'Login effettuato con successo',
            'auth_token': encoded_token,
        })
        
    @method_decorator(login_required, name='dispatch')
    @permission_classes([IsAuthenticated])
    @action(detail=True, methods=['post'])
    def post_message(self, request, chat_id):
        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return Response({'status': 'not found'}, status=status.HTTP_404_NOT_FOUND)

        message_text = request.data.get('message_text')
        file = request.data.get('file')

        if message_text and file:
            return Response({'status': 'invalid', 'message': 'Puoi inviare solo un file o un messaggio'}, status=status.HTTP_400_BAD_REQUEST)
        elif not message_text and not file:
            return Response({'status': 'invalid', 'message': 'Devi inviare un file o un messaggio'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            messaggio = chat.create_message(message_text, file)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'status': 'ok', 'message': 'Messaggio inviato con successo', 'message_id': messaggio.id})
    
    @method_decorator(login_required, name='dispatch')
    @permission_classes([IsAuthenticated])
    @action(detail=True, url_path=r'connected-messages', methods=['get'])
    def get_messaggi_connessi(self, request, chat1_id, chat2_id):
        try:
            chat1 = Chat.objects.get(id=chat1_id)
            chat2 = Chat.objects.get(id=chat2_id)
        except Chat.DoesNotExist:
            return Response({'status': 'not found'}, status=status.HTTP_404_NOT_FOUND)

        #controlla che uno delle due chat sia un superuser
        if not (chat1.is_superuser or chat2.is_superuser):
            return Response({'status': 'not allowed'}, status=status.HTTP_403_FORBIDDEN)

        messaggi_chat1 = chat1.get_messages()
        messaggi_chat2 = chat2.get_messages()

        tutti_messaggi = (messaggi_chat1 | messaggi_chat2).order_by('timestamp')
        
        tutti_messaggi_decript=[]
        
        for mess in tutti_messaggi:
            if mess.file:
                tutti_messaggi_decript.append({'user:': mess.chat.username ,'message_id': mess.id, 'file': mess.decrypt_and_verify_file().read().decode(), 'timestamp': mess.timestamp})
            elif mess.message:
                tutti_messaggi_decript.append({'user:': mess.chat.username ,'message_id': mess.id, 'message': mess.decrypt_and_verify_message(), 'timestamp': mess.timestamp})

        return Response({'status': 'ok', 'messages': tutti_messaggi_decript})