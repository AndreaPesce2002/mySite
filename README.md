# MySite

## Panoramica

MySite è un progetto web che combina un backend e un frontend. Utilizza Docker per semplificare l'ambiente di sviluppo e la distribuzione. Questo documento fornisce una guida su come configurare e avviare il progetto.

#### avvertimento

il codice è ancora in fase di progettazione e questa è solo una beta ed un gioco per mettermi alla prova

## Prerequisiti

- Docker
- Docker Compose

## Configurazione e Avvio

1. **Clona il Repository**

    ```git clone https://github.com/AndreaPesce2002/mySite.git```

2. **Naviga nella Cartella del Progetto**

    ```cd mySite```

3. **Avvia il Progetto con Docker Compose**

    ```docker-compose up --build```


Questo comando costruirà le immagini Docker per il backend e il frontend (se necessario) e avvierà i servizi. Il backend sarà accessibile su `http://localhost:8000` e il frontend su `http://localhost:5000`.

## avvertimenti
attualemtne la funzione dell'assistente CCAT non è stabile avviando il programma tramite doker compose.
tuttavia se desidetrate testare la fuznioen potete utilizzare il comando ./avviMysite il quale vi permetterà di utilizzare senza probelmi anche la funione CCAT assistant

## screen
![alt text](img_README/imag_sito.png) 
![alt text](img_README/imag_sito_2.png) 
![alt text](img_README/imag_soito_3.png)
![alt text](img_README/imag_sito_4.png) 