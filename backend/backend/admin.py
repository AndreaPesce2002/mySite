from django.contrib import admin
from.models import Work, Skill, SoftSkill

# Registrare i modelli nell'amministratore
admin.site.register(Work)
admin.site.register(Skill)
admin.site.register(SoftSkill)