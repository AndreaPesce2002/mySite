import React, { useState, useEffect, useRef } from "react";
import "./styles/cat-chat.css";
import TextField from "@mui/material/TextField";
import { IoSend } from "react-icons/io5";
import Button from "@mui/material/Button";
import { CatClient } from "ccat-api";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesContainerRef = useRef(null);
  const [gatto_attivo, setGattoAttivo] = useState(false);

  // Modifica la configurazione di cat per gestire gli eventi di connessione
  const cat = new CatClient({
    baseUrl: "localhost",
    port: "1864",
  })
    .onConnected(() => {
      console.log("Socket connected");
      setGattoAttivo(true); // Imposta gatto_attivo a true quando la connessione è stabilita
    })
    .onError((err) => {
      console.log(err);
      setGattoAttivo(false); // Imposta gatto_attivo a false in caso di errore
    });

  // Simula l'invio di un messaggio
  const sendMessage = async () => {
    if (input !== "") {
      if (gatto_attivo) {
        setIsProcessing(true); // Inizia l'elaborazione
        setMessages([...messages, { text: input, sender: "user" }]);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "", sender: "bot_writing" },
        ]);
        setInput("");

        try {
          cat.send(input);
          cat
            .onConnected(() => {
              console.log("Socket connected");
            })
            .onMessage((msg) => {
              console.log(msg);

              // elimina l'ultimo elemento di messages se sender è 'bot_writing'
              setMessages((prevMessages) => {
                const lastMessage = prevMessages[prevMessages.length - 1];
                if (lastMessage && lastMessage.sender === "bot_writing") {
                  return prevMessages.slice(0, -1); // Rimuove l'ultimo elemento
                }
                return prevMessages; // Se l'ultimo messaggio non è 'bot_writing', mantiene l'array invariato
              });

              setMessages((prevMessages) => [
                ...prevMessages,
                { text: msg.content, sender: "bot" },
              ]);

              setIsProcessing(false); // Termina l'elaborazione
            })
            .onError((err) => {
              console.log(err);
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  text: "ops... il gatto ha avuto qualche problema",
                  sender: "bot",
                },
              ]);
            })
            .onDisconnected(() => {
              console.log("Socket disconnected");
            });
        } catch (error) {
          console.error("Errore nel ricevere la risposta del bot:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "ops... c'é stato un problema", sender: "bot" },
          ]);
        }
      }
    }
  };

  // Aggiungi un messaggio iniziale quando il componente viene montato
  useEffect(() => {
    async function restCCAT() {
      if(gatto_attivo){
        setMessages([
          {
            text: "Ciao Sono lo Stregatto, una intelligenza artificiale curiosa e cortese. Sono qui per aiutarti a conoscere meglio Andrea Pesce.",
            sender: "bot",
          },
        ]);
        cat.api.memory.wipeConversationHistory();
        console.log(cat.api);  
      }else{
        setMessages([
          {
            text: "ciao, scusami ma attualemnte non sono neancora attivo",
            sender: "bot",
          },
        ]);
      }
      
    }
    restCCAT();
  }, [gatto_attivo]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]); // Questo useEffect si attiva ogni volta che i messaggi vengono aggiornati

  return (
    <div className="chat-page">
      <div className="chat-messages" ref={messagesContainerRef}>
        {" "}
        {/* Aggiungi il riferimento qui */}
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === "bot_writing" ? (
              <div class="dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              message.text
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <TextField
          label="chiaccera con il CCAT"
          variant="standard"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          style={{ width: "100%" }}
          disabled={isProcessing || !gatto_attivo}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={isProcessing || !gatto_attivo}
        >
          <IoSend />
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
