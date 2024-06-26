from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Work,Skill,SoftSkill
from .serializers import WorkSerializer,SkillSerializer,SoftSkillSerializer

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