# manage_services.py
import subprocess

# Lista per memorizzare i processi avviati
processes = []

def run_in_background(command):
    process = subprocess.Popen(command, shell=True)
    processes.append(process)
    return process

def terminate_all_processes():
    for process in processes:
        process.terminate()
    processes.clear()

if __name__ == "__main__":
    run_in_background("python backend/CCAT/caricaMemory.py")
    run_in_background("python backend/manage.py runserver 0.0.0.0:8000")
