import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import Home from './pages/home.js';
import Work from './pages/work.js';



function App() {

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
    const handleScroll = (e) => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // Controlla se lo scorrimento è oltre il limite della pagina
      if (scrollTop === 0 || scrollTop === scrollHeight) {
        // Controlla se lo scorrimento è verso l'alto o verso il basso
        const isScrollingUp = e.deltaY < 0;
        if (isScrollingUp && scrollTop === 0) {
          if(page.indexOf(currentPage)-1>=0){
            setCurrentPage(page[page.indexOf(currentPage)-1])
          }
          setSupertato(true);
        } else if (!isScrollingUp && scrollTop === scrollHeight) {
          if (page.indexOf(currentPage)+1 < page.length) {
            setCurrentPage(page[page.indexOf(currentPage) + 1]);
          }
          setSupertato(true);
        }
      }
    };

    window.addEventListener('wheel', handleScroll);


 }, [superato]);

  return (
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
      </div>
 );
}

export default App;
