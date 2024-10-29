from django.contrib.auth.models import Group, Permission
from rest_framework import serializers
from .models import Chat, Work, Skill, SoftSkill

class WorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = '__all__'  # oppure elenca i campi che desideri esporre

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'  # oppure elenca i campi che desideri esporre
class SoftSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftSkill
        fields = '__all__'
        
class ChatSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), required=False)
    user_permissions = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), required=False)
    class Meta:
        model = Chat
        fields = '__all__'
        
    def create(self, validated_data):
        return Chat.objects.create_user(**validated_data)

        
class MessaggioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'