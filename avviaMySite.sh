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

# Controlla se l'ambiente virtuale .venv esiste, altrimenti lo crea
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    pip install -r 'requirements.txt'
fi

# Attiva l'ambiente virtuale
source .venv/bin/activate

# Aggiorna il repository
git pull origin main

# Decommentare se necessario
# python backend/manage.py makemigrations backend --empty
# python backend/manage.py migrate

pip freeze > requirements.txt

# Copia il file requirements.txt nella cartella ./frontend e ./backend
cp requirements.txt ./frontend/
cp requirements.txt ./backend/

# Libera le porte
terminate_process_on_port 8000
terminate_process_on_port 3000

# Avvia il server Django in un nuovo terminale
gnome-terminal -- /bin/sh -c 'python backend/manage.py runserver; exec bash'

# Naviga nella cartella del frontend e avvia il server npm in un altro nuovo terminale
gnome-terminal -- /bin/sh -c 'cd frontend; npm start; exec bash'

# Avvia catto
cd ./backend/CCAT

# Esegui lo script Python caricaMemory.py in un nuovo terminale
gnome-terminal -- /bin/sh -c 'python ./caricaMemory.py; exec bash'

docker-compose down

# Remove dangling images (optional)
docker rmi -f $(docker images -f "dangling=true" -q)

docker-compose up