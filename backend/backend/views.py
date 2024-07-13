from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Work,Skill,SoftSkill
from .serializers import WorkSerializer,SkillSerializer,SoftSkillSerializer

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMultiAlternatives
import json

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
        feedback = data.get('feedback', '')
        subject = 'Hai ricevuto un nuovo feedback'
        message = f'Hai ricevuto un nuovo feedback ecco il contenuto:\n\n{feedback}'
        from_email = 'andrea.pesce.lavoro@gmail.com'
        recipient_list = ['andrea.pesce.lavoro@gmail.com']

        email = EmailMultiAlternatives(subject, message, from_email, recipient_list)
        email.send()

        return JsonResponse({'status': 'ok'})
    else:
        return JsonResponse({'status': 'invalid'}, status=400)
