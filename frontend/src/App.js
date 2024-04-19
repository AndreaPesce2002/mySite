import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/home.js';
import Work from './pages/work.js';


function App() {

  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'work':
        return <Work />
      default:
        return <Home />;
    }
  };

  const [ultimoScrollY, setUltimoScrollY] = useState(0);
  const [nascondiHeader, setNascondiHeader] = useState(false);

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

  return (
    <div className="App">
      <header className={`header ${nascondiHeader ? 'nascondi' : ''}`}>
        <div className="brand">Andrea Pesce</div>
        <nav>
          <a href="#home" onClick={() => setCurrentPage('home')}>Home</a>
          <a href="#work" onClick={() => setCurrentPage('work')}>Work</a>
          <a href="#cv">CV</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <div className="container">
        <div className="pageContent">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;