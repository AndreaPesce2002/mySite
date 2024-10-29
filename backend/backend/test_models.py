# tests/test_models.py

from itertools import chain
import os
from django.test import TestCase
from .models import Chat, Messaggio, get_upload_path
from cryptography.fernet import Fernet
import hashlib
from django.utils import timezone
from datetime import timedelta


class TestModels(TestCase):
    
    def generte_file(self, cartella, file_name, messaggio):
        # Genera il percorso del file
        file = get_upload_path(cartella, file_name+'.txt')

        # Crea la directory se non esiste
        dir_path = os.path.dirname('media/'+file)
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)

        # Crea un file con il testo 'Test file content'
        with open('media/'+file, 'w') as f:
            f.write(messaggio)
            
        return file
    
    def setUp(self):
        self.chat1 = Chat.objects.create_user(
            username='testuser1',
            email='test@example1.com',
            password='password123'
        )
        
        self.chat2 = Chat.objects.create_user(
            username='testuser2',
            email='test@example2.com',
            password='password123'
        )
                
        self.chat1.create_message('buongirono signor martin')
        self.chat1.create_message('le invio il contratto')
        self.chat1.create_message(file = self.generte_file('test', 'test', 'test'))
        
        self.chat2.create_message('grazie mille')
        self.chat1.create_message('mi serve firmato entro stasera')
        self.chat2.create_message('certo nessun problema eccolo qui')
        self.chat2.create_message(file = self.generte_file('test2', 'test2', 'test2'))
        
        # messaggio=Messaggio(chat=self.chat2,message='Test message no primary key')
        # messaggio.save()
    
       
    
    def test_contenuto(self):
        print('=================== CONTENUTO CRIPTATO ===================')
        print('username:',self.chat1.username)
        print('email:',self.chat1.email)
        print('password: ',self.chat1.password)
        #print('auth token:',self.chat1.auth_token)
        print('messaggi:')
        for mess in self.chat1.get_messages():
            if mess.message:
                print('messaggio:', mess.message, mess.timestamp)
            elif mess.file:
                with open(mess.file.path, 'r') as f:
                    print(f'file: ({mess.file})', f.read())
                

    # def test_messaggi_0_1(self):
    #     print('=================== MESSAGGI DECRITATI (0-1) ===================')
    #     messaggi = self.chat1.get_messages(0)
    #     for mess in messaggi:
    #         if mess.file:
    #             print(f'file: ({mess.file})', mess.decrypt_and_verify_file().read().decode())
    #         elif mess.message:
    #             print('messaggio:', mess.decrypt_and_verify_message(), mess.timestamp)

    #connesione tra due chat
    def test_connesione(self):
        print('=================== CONNESSIONE ===================')
        
        # Estrai i messaggi di chat1 e chat2
        messaggi_chat1 = self.chat1.get_messages()
        messaggi_chat2 = self.chat2.get_messages()
        
        tutti_messaggi = (messaggi_chat1 | messaggi_chat2).order_by('timestamp')
        
        # Stampa i messaggi ordinati
        print('Messaggi ordinati:')
        for mess in tutti_messaggi:
            if mess.file:
                print(mess.timestamp, f'file di {mess.chat.username}: ({mess.file})', mess.decrypt_and_verify_file().read().decode())
            elif mess.message:
                print(mess.timestamp, f'messaggio di {mess.chat.username}:', mess.decrypt_and_verify_message())