import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CatChat from "./cat-chat.js";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import "./styles/widget_CCAT.css";

const Widget_CCAT = () => {
  const lightTheme = createTheme({
    palette: {
      mode: "light", // Set theme to light mode
      // Customize colors here if necessary
    },
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [canAnimate, setCanAnimate] = useState(true); // New state to control animation

  useEffect(() => {
    if (!isOpenChat) {
      setCanAnimate(false); // Disabilita l'animazione
      const timer = setTimeout(() => {
        setCanAnimate(true); // Abilita l'animazione dopo 2 secondi
      }, 2000);
      return () => clearTimeout(timer); // Pulisce il timer se il componente viene smontato
    }
  }, [isOpenChat]);

  return (
    <motion.div
      className={!isOpenChat ? "cat-icon" : "cat-chat"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ overflow: "hidden" }} // Aggiungi questo stile
      animate={{
        rotate:
          canAnimate && isHovered && !isOpenChat ? [0, 30, -30, 10, -10, 0] : 0,
        scale: canAnimate && isHovered && !isOpenChat ? 1.2 : 1,
      }}
      onClick={
        !isOpenChat
          ? () => {
              // Assicurati che questa funzione sia sincrona
              setIsOpenChat(true);
            }
          : null
      }
    >
      <div className="rectangle">
        {isOpenChat ? (
          <div
            className="close-icon"
            onClick={() => {
              setIsOpenChat(false);
            }}
          >
            X
          </div>
        ) : (
          ""
        )}
        <img
          src={
            "https://cheshire-cat-ai.github.io/docs/assets/img/cheshire-cat-logo.svg"
          }
          alt="cat Icon"
        />
        {isOpenChat ? (
          <ThemeProvider theme={lightTheme}>
            <CatChat />
          </ThemeProvider>
        ) : (
          ""
        )}
      </div>
    </motion.div>
  );
};

export default Widget_CCAT;
