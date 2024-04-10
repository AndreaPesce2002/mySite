#!/bin/bash

# Funzione per terminare un processo che utilizza una determinata porta
terminate_process_on_port() {
    local port=$1
    local pid=$(lsof -t -i :$port)
    
    if [ -n "$pid" ]; then
        echo "Terminating process on port $port (PID: $pid)"
        kill -9 $pid
    fi
}

# Funzione per inserire una stringa dopo un determinato pattern in un file
inserisci_stringa_dopo() {
    local pattern="$1"
    local inserimento="$2"
    local file="$3"
    
    awk -v pattern="$pattern" -v o_inserimento="$inserimento" 'BEGIN{inserimento=o_inserimento"\n"} {
        print
        if ($0 ~ pattern && !fatto) {
            print inserimento; fatto=1
        }
    }' "$file" > temp_file && mv temp_file "$file"
}

# Controlla se l'ambiente virtuale esiste, altrimenti lo crea
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "Ambiente virtuale creato."
fi

# Entra nell'ambiente virtuale ".venv"
chmod +x .venv/bin/activate
source .venv/bin/activate

# Scarica Django, React e le librerie necessarie per il frontend
pip install django django-cors-headers
pip install djangorestframework
pip install asgiref
pip install backports.zoneinfo
pip install sqlparse
pip install typing-extensions
pip install django-webpack-loader

npm install axios
npm install react-router-dom

# Crea un progetto React chiamato "frontend"
npx create-react-app frontend

cd frontend
npm install axios
npm install react-router-dom

cd ..


# Crea un progetto Django chiamato "backend"
django-admin startproject backend

# Collega Django con React (aggiunge le righe necessarie al file views.py)
echo -e "from django.shortcuts import render\n\ndef index(request):\n    return render(request, 'frontend/build/index.html')" >> backend/backend/views.py

# Configura le URL nel file urls.py del progetto Django (backend)
inserisci_stringa_dopo "from django.urls import path" "from .views import index" "backend/backend/urls.py"
inserisci_stringa_dopo "urlpatterns = \[" "    path('', index)," "backend/backend/urls.py"

# Configura Django per servire i file statici in modalità di sviluppo
inserisci_stringa_dopo "from pathlib import Path" "import os\nfrom django.conf import settings" "backend/backend/settings.py"
echo -e "STATICFILES_DIRS = [\n    os.path.join(settings.BASE_DIR, 'frontend/build/static'),\n]" >> backend/backend/settings.py

# Configura Django per utilizzare il middleware CORS
inserisci_stringa_dopo "MIDDLEWARE = \[" "    'corsheaders.middleware.CorsMiddleware'," "backend/backend/settings.py"
inserisci_stringa_dopo "INSTALLED_APPS = \[" "    'rest_framework',    'rest_framework.authtoken',    'backend', " "backend/backend/settings.py"

# Configura le opzioni CORS nel file settings.py
echo -e "CORS_ORIGIN_ALLOW_ALL = True\n" >> backend/backend/settings.py


# Configura le opzioni CORS nel file settings.py
echo -e "REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    # Aggiungi altre configurazioni del REST framework se necessario
}" >> backend/backend/settings.py 

# Esegui le migrazioni del database Django
python backend/manage.py migrate

# Crea il file requirements.txt con le dipendenze del progetto
pip freeze > requirements.txt

# Libera le porte
terminate_process_on_port 8000
terminate_process_on_port 3000

# Esegui il server Django in un nuovo terminale
gnome-terminal -- /bin/sh -c 'python backend/manage.py runserver; exec bash'

# Naviga nella cartella del frontend e avvia il server npm in un altro nuovo terminale
gnome-terminal -- /bin/sh -c 'cd frontend; npm start; exec bash'
