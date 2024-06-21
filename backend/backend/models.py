from django.db import models

class Work(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='work_images/')
    url = models.TextField()

    def __str__(self):
        return self.title
    
class Skill(models.Model):
    name = models.CharField(max_length=50)
    icon = models.URLField()  # URL dell'immagine dell'icona
    description = models.TextField()
    level = models.CharField(max_length=20, choices=[
        ('Base', 'Base'),
        ('Medio-Basso', 'Medio-Basso'),
        ('Intermedio', 'Intermedio'),
        ('Medio-Alto', 'Medio-Alto'),
        ('Avanzato', 'Avanzato'),
    ])
    is_framework = models.BooleanField(default=False)  # True se è un framework, False se è un linguaggio

    def __str__(self):
        return self.name
    
class SoftSkill(models.Model):
    name = models.CharField(max_length=50)
    image = models.FileField(upload_to='softSkill_images/')
    description = models.TextField()

    def __str__(self):
        return self.name