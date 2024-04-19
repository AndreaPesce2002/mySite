from django.db import models

class Work(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='work_images/')
    # Aggiungi altri campi se necessario

    def __str__(self):
        return self.title