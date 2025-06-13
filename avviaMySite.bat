@echo off

:: Check if the virtual environment exists, create if not
if not exist ".venv" (
    python -m venv .venv
    .venv\Scripts\activate
    pip install -r requirements.txt
)

:: Activate the virtual environment
call .venv\Scripts\activate

:: Update the repository
git pull origin main

:: Uncomment if needed
python backend\manage.py makemigrations backend --empty
python backend\manage.py migrate

::pip freeze > requirements.txt

:: Copy requirements.txt to frontend and backend folders
copy requirements.txt frontend\
copy requirements.txt backend\

:: Start Django server in a new command prompt
start cmd /k "python backend/manage.py runserver"

:: Navigate to frontend and start npm server in another command prompt
start cmd /k "cd frontend && npm start"

:: Navigate to backend/CCAT and run the Python script in a new command prompt
cd backend\CCAT
start cmd /k "python caricaMemory.py"

:: Stop and remove dangling Docker images
docker-compose down
docker rmi -f $(docker images -f "dangling=true" -q)

:: Start Docker containers
docker-compose up
