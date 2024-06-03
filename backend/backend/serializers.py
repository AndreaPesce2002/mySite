from rest_framework import serializers
from .models import Work, Skill

class WorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = '__all__'  # oppure elenca i campi che desideri esporre


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'  # oppure elenca i campi che desideri esporre