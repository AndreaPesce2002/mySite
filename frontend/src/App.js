import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import CatChat from './pages/Components/cat-chat.js'
import Home from './pages/home.js';
import Work from './pages/work.js';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';



function App() {

  const lightTheme = createTheme({
    palette: {
       mode: 'light', // Imposta il tema in modalità chiaro
       // Personalizza i colori qui se necessario
    },
   });

   const darkTheme = createTheme({
    palette: {
       mode: 'dark', // Imposta il tema in modalità dark
       // Personalizza i colori qui se necessario
    },
   });

  // Definisci i tuoi link del menu
  const menuItems = [
    { name: 'Home', path: '/home', active: true},
    { name: 'Work', path: '/work', active:true},
    { name: 'CV', path: '/cv',active:false},
    { name: 'Contact', path: '/contact',active:false},
  ];

  const page=['home','work']

  const [currentPage, setCurrentPage] = useState(page[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMenuItemClick = (index) => {
    setCurrentIndex(index);
    setCurrentPage(page[index]);
  };
  const [ultimoScrollY, setUltimoScrollY] = useState(0);
  const [nascondiHeader, setNascondiHeader] = useState(false);
  const [superato, setSupertato]=useState(false);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [canAnimate, setCanAnimate] = useState(true); // Nuovo stato per controllare l'animazione

  const pageVariants = {
     initial: { opacity: 0 },
     in: { opacity: 1 },
     out: { opacity: 0 },
  };
 
  const pageTransition = {
     type: 'tween',
     ease: 'anticipate',
     duration: 0.5,
  };
 
  const renderPage = () => {
     switch (currentPage) {
       case page[0]:
         return <Home />;
       case page[1]:
         return <Work />;
       default:
         return <Home />;
     }
  };

  const controllaScroll = () => {
    const scrollYCorrente = window.scrollY;
    if (scrollYCorrente < ultimoScrollY) {
      setNascondiHeader(false); // Scrolling verso l'alto, mostra l'header
    } else if (scrollYCorrente > ultimoScrollY) {
      setNascondiHeader(true); // Scrolling verso il basso, nascondi l'header
    }
    setUltimoScrollY(scrollYCorrente); // Aggiorna l'ultimo scroll Y

  };

  useEffect(() => {
    window.addEventListener('scroll', controllaScroll);

    return () => {
      window.removeEventListener('scroll', controllaScroll);
    };
  }, [ultimoScrollY, nascondiHeader]);

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
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <header className={`header ${nascondiHeader ? 'nascondi' : ''}`}>
          <div className="brand">Andrea Pesce</div>
          <nav>
          <ul>
            {menuItems.map((item, index) => (
              <li
                  key={item.name}
                  onClick={item.active ? () => handleMenuItemClick(index): ()=>{}}
                  className={item.active ? '' : 'not-acrive'}
              >
              {item.name}
              {currentPage === item.path.substring(1) && (
                <motion.div className="underline" layoutId="underline" />
              )}
              </li>
            ))}
            </ul>
          </nav>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
          <div className="container">
            <div className="pageContent">
              {renderPage()}
            </div>
          </div>

          </motion.div>
        </AnimatePresence>

        
        <motion.div
          className={!isOpenChat ? "cat-icon" : "cat-chat"}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          style={{ overflow: 'hidden' }} // Aggiungi questo stile
          animate={{
              rotate: canAnimate && isHovered && !isOpenChat ? [0, 30, -30, 10, -10, 0] : 0,
              scale: canAnimate && isHovered && !isOpenChat ? 1.2 : 1,
          }}
          onClick={!isOpenChat ? () => {
              // Assicurati che questa funzione sia sincrona
              setIsOpenChat(true);
          } : null}
          >
          <div className="rectangle">
            {isOpenChat ? <div className="close-icon" onClick={() => { setIsOpenChat(false);}}>X</div>:""}
            <img src={'https://cheshire-cat-ai.github.io/docs/assets/img/cheshire-cat-logo.svg'} alt="cat Icon" />
            {isOpenChat ? <ThemeProvider theme={lightTheme}><CatChat/></ThemeProvider>:""}
          </div>
          </motion.div>

      </div>  
    </ThemeProvider>
 );
}

export default App;
