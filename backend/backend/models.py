import inspect
from io import BytesIO
import os
import secrets

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec

from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser, Group, Permission

# Remove these standalone fields - they should only be inside model classes
# groups = models.ManyToManyField(Group, related_name='chat_groups')
# user_permissions = models.ManyToManyField(Permission, related_name='chat_user_permissions')
# groups = models.ManyToManyField(Group, related_name='user_groups')
# user_permissions = models.ManyToManyField(Permission, related_name='user_user_permissions')

def get_upload_path(instance, filename):
    try:
        return f'chat_files/{slugify(instance.chat)}/{filename}'
    except AttributeError:
        return f'chat_files/{slugify(instance)}/{filename}'

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
    
class Chat(AbstractUser):
    email = models.EmailField(unique=True)
    _auth_token = models.CharField(max_length=44, null=True, blank=True)
    
    groups = models.ManyToManyField('auth.Group', related_name='chat_groups')
    user_permissions = models.ManyToManyField('auth.Permission', related_name='chat_user_permissions')
    
    _private_key = models.BinaryField(null=True, blank=True)
    
    temporanial_token = models.CharField(max_length=44, null=True, blank=True)
    
    def __getattribute__(self, name):
        if name in ['auth_token', '_auth_token', '_private_key']:
            frame = inspect.stack()[1]
            if frame[0].f_code.co_name in ['save', '_create_user', 'pre_save', 'sign_and_encrypt_message', 'decrypt_and_verify_message', 'sign_and_encrypt_file', 'decrypt_and_verify_file', 'sign_and_encrypt_message', 'create_message']:
                return super().__getattribute__(name)
            else:
                raise AttributeError("'Chat' object has no attribute '{}'".format(name))
        return super().__getattribute__(name)

    def __generate_auth_token(self):
        return Fernet.generate_key().decode()

    def save(self, *args, **kwargs):
        if not self._auth_token:
            self._auth_token = self.__generate_auth_token()
        if not self._private_key:
            self._private_key = self.__generate_key_pair()
        
        super().save(*args, **kwargs)
        
    def __generate_key_pair(self):
        _private_key = ec.generate_private_key(ec.SECP256R1())
        return _private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
            
    def get_messages(self, start=0, end=None):
        if end is None:
            end = self.messaggi.count() - 1
        return self.messaggi.all().order_by('-timestamp')[start:end+1]
    
    def create_message(self, message_text=None, file=None):
        if not message_text and not file:
            raise ValueError('Il messaggio o il file sono necessari')
        else:
            private_key_loaded = serialization.load_pem_private_key(
                self._private_key,
                password=None,
            )
            public_key = private_key_loaded.public_key()
            public_key = public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
            message = Messaggio(
                chat=self,
                message=message_text,
                file=file,
                public_key=public_key
            )
            message.save()
            return message

class Messaggio(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messaggi')
    message = models.TextField() 
    timestamp = models.DateTimeField(auto_now_add=True)
    file = models.FileField(get_upload_path, blank=True, null=True)
    _token = models.CharField(max_length=44, null=True, blank=True)
    signature = models.BinaryField(null=True)
    public_key = models.BinaryField(null=False, blank=True)
    
    def __getattribute__(self, name):
        if name in ['_token', '_token', 'signature','public_key']:
            frame = inspect.stack()[1]
            if frame[0].f_code.co_name in ['save', '_create_user', 'pre_save', 'sign_and_encrypt_message', 'decrypt_and_verify_message', 'sign_and_encrypt_file', 'decrypt_and_verify_file', 'sign_and_encrypt_message']:
                return super().__getattribute__(name)
            else:
                raise AttributeError("'Messaggio' object has no attribute '{}'".format(name))
        return super().__getattribute__(name)

    def __generate_token(self):
        return Fernet.generate_key().decode()

    def save(self, *args, **kwargs):
        if not self._token:
            self._token = self.__generate_token()
        if self.message and not self.signature:
            self.sign_and_encrypt_message()
        if self.file and not self.signature:
            self.sign_and_encrypt_file()
        super().save(*args, **kwargs)

    def sign_and_encrypt_message(self):
        original_message = self.message.encode()
        
        # Firma il messaggio
        private_key = serialization.load_pem_private_key(
            self.chat._private_key,
            password=None
        )
        signature = private_key.sign(
            original_message,
            ec.ECDSA(hashes.SHA256())
        )
        self.signature = signature

        # Cifra il messaggio come prima
        salt = secrets.token_bytes(16)
        f1 = Fernet(self.chat._auth_token)
        f2 = Fernet(self._token)
        encrypted_message = f1.encrypt(salt + original_message)
        encrypted_message = f2.encrypt(encrypted_message)
        
        self.message = encrypted_message.decode()

    def decrypt_and_verify_message(self):   
        #decripta il messaggio
        encrypted_message = self.message.encode()
        f2 = Fernet(self._token)
        f1 = Fernet(self.chat._auth_token)
        decrypted_message = f2.decrypt(encrypted_message)
        decrypted_message = f1.decrypt(decrypted_message)
        decrypted_message = decrypted_message[16:]
        
        # Verifica la firma
        try:
            public_key = serialization.load_pem_public_key(self.public_key)
            public_key.verify(
                self.signature,
                decrypted_message,
                ec.ECDSA(hashes.SHA256())
            )
            print('\u001b[92m'+"Firma verificata con successo!"+ '\u001b[0m')
            return decrypted_message.decode()
        except:
            print('\u001b[31m'+"Attenzione: la firma non è valida!"+ '\u001b[0m')
            #elimina il messaggio
            self.delete()
            


    def sign_and_encrypt_file(self):        
        if not self.file:
            return None
        
        # Firma il messaggio
        self.message=secrets.token_urlsafe(50)
        original_message = self.message.encode()
        
        private_key = serialization.load_pem_private_key(
            self.chat._private_key,
            password=None
        )
        signature = private_key.sign(
            original_message,
            ec.ECDSA(hashes.SHA256())
        )
        self.signature = signature
        
        # Cifra il messaggio come prima
        salt = secrets.token_bytes(16)
        f1 = Fernet(self.chat._auth_token)
        f2 = Fernet(self._token)
        encrypted_message = f1.encrypt(salt + original_message)
        encrypted_message = f2.encrypt(encrypted_message)
        
        self.message = encrypted_message.decode()
        
        with open(self.file.path, 'rb') as f:
            file_content = f.read()
        f1 = Fernet(self.chat._auth_token)
        f2 = Fernet(self._token)
        encrypted_content = f1.encrypt(file_content)
        encrypted_content = f2.encrypt(encrypted_content)
        with open(self.file.path, 'wb') as f:
            f.write(encrypted_content)
        return self.file

    def decrypt_and_verify_file(self):
        if not self.file:
            return None
        
        encrypted_message = self.message.encode()
        f2 = Fernet(self._token)
        f1 = Fernet(self.chat._auth_token)
        decrypted_message = f2.decrypt(encrypted_message)
        decrypted_message = f1.decrypt(decrypted_message)
        decrypted_message = decrypted_message[16:]
            
        try:

            public_key = serialization.load_pem_public_key(self.public_key)
            public_key.verify(
                self.signature,
                decrypted_message,
                ec.ECDSA(hashes.SHA256())
            )
            print('\u001b[92m'+"Firma verificata con successo!"+ '\u001b[0m')
            
            # decripta il file
            with open(self.file.path, 'rb') as f:
                encrypted_content = f.read()
            f1 = Fernet(self.chat._auth_token)
            f2 = Fernet(self._token)
            decrypted_content = f2.decrypt(encrypted_content)
            decrypted_content = f1.decrypt(decrypted_content)
            return BytesIO(decrypted_content)
        except:
            print('\u001b[31m' + "Attenzione: la firma non è valida!" + '\u001b[0m')
            self.delete()
    
    #### miglioramenti ###
    # Verifica l'autenticità dei messaggi: Quando cripti i messaggi, non stai verificando l'autenticità dei messaggi. Potresti considerare di utilizzare un algoritmo di firma digitale come ECDSA o RSA per verificare l'autenticità dei messaggi.