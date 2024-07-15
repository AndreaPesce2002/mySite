import React, { useState, useEffect } from "react";
import "./styles/home.css";
import { SocialIcon } from "react-social-icons";

const TypingText = () => {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true); // Inizia con il cursore visibile
  const fullText = "I Am A Web Developer. ";

  useEffect(() => {
    setText("<p>");
    let index = 0;
    const typingTimer = setInterval(() => {
      const nextChar = fullText.charAt(index);
      setText((prevText) => {
        if (index === 5) {
          return prevText + " <b>";
        } else if (index >= fullText.length) {
          clearInterval(typingTimer); // Ferma il ciclo di digitazione
          return prevText + "</b></p>";
        }
        return prevText + nextChar;
      });
      index++;
    }, 150);

    return () => clearInterval(typingTimer); // Cleanup per evitare effetti indesiderati
  }, []);

  useEffect(() => {
    if (text.endsWith("</b></p>")) {
      // Quando la digitazione è finita, inizia l'animazione del cursore
      const cursorTimer = setInterval(() => {
        setShowCursor((prevShowCursor) => !prevShowCursor);
      }, 800);
      return () => clearInterval(cursorTimer); // Cleanup per il timer del cursore
    }
  }, [text]); // Aggiungi 'text' come dipendenza per far partire questo effetto solo quando il testo cambia

  return (
    <div className="home-container">
      <div className="welcome-text">Hello & Welcome</div>
      <div className="typing-text">
        <span
          className={showCursor ? "typing-cursor show-cursor" : "typing-cursor"}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
      <div className="social-links">
        {/* Aggiungi i SocialIcon con gli URL dei tuoi profili social */}
        <SocialIcon
          className="custom-class"
          url="https://github.com/AndreaPesce2002"
          bgColor="white"
          fgColor="black"
          target="_blank"
          rel="noopener noreferrer"
        />
        <SocialIcon
          className="custom-class"
          url="https://www.linkedin.com/in/andrea-pesce-080542202/"
          bgColor="white"
          fgColor="black"
          target="_blank"
          rel="noopener noreferrer"
        />
        <SocialIcon
          className="custom-class"
          url="https://codepen.io/Andrea-Pesce-002"
          bgColor="white"
          fgColor="black"
          target="_blank"
          rel="noopener noreferrer"
        />
        {/* E così via per gli altri network */}
      </div>
    </div>
  );
};

export default TypingText;
