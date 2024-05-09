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

activate .venv/bin/activate

git fetch
git pull origin main

#python backend/manage.py makemigrations backend --empty
#python backend/manage.py migrate

pip freeze > requirements.txt

# Copia il file requirements.txt nella cartella ./frontend e ./backend
cp requirements.txt ./frontend/
cp requirements.txt ./backend/

# libera le porte
terminate_process_on_port 8000
terminate_process_on_port 3000

# 11. Esegui il server Django in un nuovo terminale
gnome-terminal -- /bin/sh -c 'python backend/manage.py runserver; exec bash'

# 12. Naviga nella cartella del frontend e avvia il server npm in un altro nuovo terminale
gnome-terminal -- /bin/sh -c 'cd frontend; npm start; exec bash'

# avvia catto
cd ./backend/CCAT

docker-compose down
# Remove dangling images (optional)
docker rmi -f $(docker images -f "dangling=true" -q)
docker-compose up

