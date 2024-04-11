# MySite

## Panoramica

MySite è un progetto web che combina un backend e un frontend. Utilizza Docker per semplificare l'ambiente di sviluppo e la distribuzione. Questo documento fornisce una guida su come configurare e avviare il progetto.

#### avvertimento

il codice è ancora in fase di progettazione e questa è solo una beta e un gioco per mettermi alla prova

## Prerequisiti

- Docker
- Docker Compose

## Configurazione e Avvio

1. **Clona il Repository**
    git clone https://github.com/AndreaPesce2002/mySite.git

2. **Naviga nella Cartella del Progetto**
    cd mySite

3. **Avvia il Progetto con Docker Compose**
    docker-compose up --build


   Questo comando costruirà le immagini Docker per il backend e il frontend (se necessario) e avvierà i servizi. Il backend sarà accessibile su `http://localhost:8000` e il frontend su `http://localhost:5000`.

## Componenti Principali
