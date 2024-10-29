
import React, { useState, useEffect, useRef } from 'react';
import "./styles/chat_user.css";
import { IoSearchSharp } from "react-icons/io5";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

function Chat() {
  const [chatData, setChatData] = useState([
    { "user": "me", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "come stai?", "timestamp": new Date() },
    { "user": "andrea", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "come stai?", "timestamp": new Date() },
    { "user": "andrea", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "come stai?", "timestamp": new Date() },
    { "user": "andrea", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "come stai?", "timestamp": new Date() },
    { "user": "andrea", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "come stai?", "timestamp": new Date() },
    { "user": "andrea", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "come stai?", "timestamp": new Date() },
    { "user": "andrea", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "come stai?", "timestamp": new Date() },
    { "user": "andrea", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "ciao", "timestamp": new Date() },
    { "user": "me", "message": "come stai?", "timestamp": new Date() },
    { "user": "andrea", "message": "ciao", "timestamp": new Date() },
  ]);

  const [randomEmoji, setRandomEmoji] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [emojiSelectVisible, setEmojiSelectVisible] = useState(false);

  const emojis = [
    '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😏'
  ];

  function getRandomEmoji() {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
  }

  useEffect(() => {
    // Imposta l'emoji iniziale dopo il montaggio del componente
    setRandomEmoji(getRandomEmoji());
  }, []);

  // Funzione per gestire il cambio del file selezionato
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Salva il file selezionato
    // Qui puoi aggiungere logica per gestire il file caricato, ad esempio inviarlo a un server
    console.log("File selected:", event.target.files[0]);
  };

  const [message, setMessage] = useState('');
  const [filteredData, setFilteredData] = useState(chatData);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }, 2);
  }, []);

  useEffect(() => {
    setFilteredData(chatData);
  }, [chatData]);

  // Modifica la funzione sendMessage per includere la data nel nuovo messaggio
  const sendMessage = () => {
    if (message.trim() !== '') {
      const now = new Date();
      setChatData([...chatData, { "user": "me", "message": message, "timestamp": now }]);
      setMessage('');
      setEmojiSelectVisible(false)

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", inline: "nearest" });
      }, 2); // Ritardo di 500ms prima dello scorrimento
    }
  };

  const extratData = (time) => {
    if (time) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const timestamp = `${hours}:${minutes}`;

      return timestamp
    }
  };


  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setFilteredData(
      chatData.filter(item => item.message.toLowerCase().includes(event.target.value.toLowerCase()))
    );
  };

  return (
    <div className="contact-sfodno">

      {/* zona superiore della chat */}
      <Box id="chat-container">
        <Box id="chat-header" display="flex" justifyContent="space-between" alignItems="center">
          <h2>Chat con Andrea</h2>
          <div className="search-box">
            <button className="btn-search" onClick={() => {
              const searchInput = document.getElementById('search-bar');
              if (searchInput) {
                searchInput.focus();
              }
            }}>
              <IoSearchSharp className='iconSearch' />
            </button>
            <input
              type="text"
              id="search-bar"
              className={`input-search ${searchTerm ? 'searchProgress' : ''}`}
              placeholder="Cerca..."
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
        </Box>

        {/* zona centrale della chat */}
        <Box id="message-list">
          {filteredData.map((item, index) => (
            <Box key={index} className={`message_chat ${item.user}`} display="flex" alignItems="center" ref={messagesEndRef}>
              {item.message}
              <p>{extratData(item.timestamp)}</p> {/* Visualizza l'ora di invio */}
            </Box>
          ))}
        </Box>
        {emojiSelectVisible && (
          <Box
            style={{
              position: 'absolute', // Usa posizione assoluta
              top: 'calc(99% - 535px)', // Aumenta il 100% per coprire l'intera altezza dell'input-area e aggiungi un margine extra
              left: '16px', // Allinea a sinistra

              backgroundColor: 'transparent',
            }}
          >
            <Picker
              data={data}
              onEmojiSelect={(emoji) => setMessage(message + emoji.native)}
            />
          </Box>

        )}

        {/* zona inferiore della chat */}
        <Box id="input-area" display="flex" alignItems="center" bgcolor="black" p={1} m={2} borderRadius={4} justifyContent="space-between">

          <TextField
            id="message-input"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Evita il comportamento di invio predefinito
                sendMessage(); // Chiama la funzione sendMessage
              }
            }}
            fullWidth
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <>
                  <IconButton component="span" onClick={() => document.getElementById('hidden-file-input').click()}>
                    <AttachFileIcon sx={{ color: 'white', fontSize: 24 }} />
                  </IconButton>

                  {/* Icona dell'emoji */}
                  <IconButton onClick={() => setEmojiSelectVisible(!emojiSelectVisible)} onMouseEnter={() => setRandomEmoji(getRandomEmoji())}>
                    <span role="img" aria-label="random emoji">{randomEmoji || '🙂'}</span>
                  </IconButton>
                </>
              ),
              endAdornment: (
                <IconButton onClick={sendMessage} sx={{ padding: 1 }}>
                  <SendIcon sx={{ color: '#8C52FF', fontSize: 30 }} />
                </IconButton>
              ),
            }}
            margin="dense"
          />
          {/* Campo nascosto per il caricamento del file */}
          <input
            type="file"
            id="hidden-file-input"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

        </Box>
      </Box>
    </div>

  );
}

export default Chat;
