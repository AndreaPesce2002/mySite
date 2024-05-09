import time
import cheshire_cat_api as ccat
import requests
import os

def on_open():
    # This is triggered when the connection is opened
    print("Connection opened!")

def on_message(message: str):
    # This is triggered when a new message arrives 
    # and grabs the message
    print(message)

def on_error(exception: Exception):
    # This is triggered when a WebSocket error is raised
    print(str(exception))

def on_close(status_code: int, message: str):
    # This is triggered when the connection is closed
    print(f"Connection closed with code {status_code}: {message}")
    

# Connection settings with default values
config = ccat.Config(
    base_url="localhost",
    port=1864,
    user_id="user",
    auth_key="",
    secure_connection=False
)

# Cat Client
cat_client = ccat.CatClient(
    config=config,
    on_open=on_open,
    on_close=on_close,
    on_message=on_message,
    on_error=on_error
)

# Connect to the WebSocket API
cat_client.connect_ws()

while not cat_client.is_ws_connected: 
    # A better handling is strongly advised to avoid an infinite loop 
    cat_client.connect_ws()
    time.sleep(1)
    print('test riconnesione')

url = "http://localhost:1864/embedder/settings/EmbedderQdrantFastEmbedConfig"

payload = {
    "model_name": "BAAI/bge-base-en",
    "max_length": 512,
    "doc_embed_type": "passage",
    "cache_dir": "cat/data/models/fast_embed"
}
headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
}

print('inizio installazione memoria')
response = requests.put(url, json=payload, headers=headers)

if response.status_code == 200:
    print("Richiesta PUT avvenuta con successo!")
    print(response.json())
else:
    print(f"Errore nella richiesta PUT: {response.status_code}")
    print(response.text)

# Send the message
# Ottieni il percorso corrente del tuo script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Costruisci il percorso assoluto del file
file_path = os.path.join(current_dir, 'Recalled_Memories.json')

# Ora puoi utilizzare file_path per il tuo metodo upload_memory
cat_client.rabbit_hole.upload_memory(file_path)

# Close connection
cat_client.close()
cat_client.close()
