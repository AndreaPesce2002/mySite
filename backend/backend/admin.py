from django.contrib import admin
from .models import Work

@admin.register(Work)
class WorkAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'image')  # Ad esempio
    search_fields = ('title', 'description')  # Ad esempio