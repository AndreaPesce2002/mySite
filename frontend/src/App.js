import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import CatChat from "./pages/Components/widget_CCAT.js";
import Home from "./pages/home.js";
import Work from "./pages/work.js";
import CV from "./pages/CVPage.js";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { gsap } from "gsap";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark", // Imposta il tema in modalità dark
      // Personalizza i colori qui se necessario
    },
  });


  gsap.fromTo(
    ".voceMenu",
    {
      x: 500, // Posizione iniziale fuori schermo
      ease: "back.out(1.7)",
      duration: 1,
      stagger: 0.1,
    },
    {
      x: 0, // Posizione finale dentro schermo
      opacity: 1, // Opacità finale 1 (completamente opaco)
      ease: "back.out(1.7)",
      duration: 1,
      stagger: 0.1,
    }
  );


  // Definisci i tuoi link del menu
  const menuItems = [
    { name: "Home", path: "/home", active: true },
    { name: "Work", path: "/work", active: true },
    { name: "CV", path: "/cv", active: true },
    { name: "Contact", path: "/contact", active: false },
  ];

  const [currentPage, setCurrentPage] = useState(menuItems[0].name);

  const handleMenuItemClick = (index) => {
    setCurrentPage(menuItems[index].name);
  };

  const [ultimoScrollY, setUltimoScrollY] = useState(0);
  const [nascondiHeader, setNascondiHeader] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const renderPage = () => {
    switch (currentPage) {
      case menuItems[0].name:
        return <Home />;
      case menuItems[1].name:
        return <Work />;
      case menuItems[2].name:
        return <CV />;
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
    window.addEventListener("scroll", controllaScroll);

    return () => {
      window.removeEventListener("scroll", controllaScroll);
    };
  }, [ultimoScrollY, nascondiHeader]);

  const handleToggleNav = () => {
    setNavOpen(!navOpen);
  };

  useEffect(() => {
    const checkWindowSize = () => {
      if (window.innerWidth > 768) {
        setNavOpen(false);
      }
    };

    window.addEventListener("resize", checkWindowSize);
    checkWindowSize();

    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  useEffect(() => {
    if (navOpen) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); // Scroll verso il basso
      // Dopo un breve ritardo, blocca lo scroll
      setTimeout(() => {
        document.body.style.overflow = "hidden"; // Blocca lo scroll
      }, 500); // Aspetta 500ms prima di bloccare lo scroll
    } else {
      document.body.style.overflow = "auto"; // Blocca lo scroll
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll verso l'alto
    }
  }, [navOpen]); // Assicurati che questo useEffect si attivi solo quando navOpen cambia

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <header className={`header ${nascondiHeader ? "nascondi" : ""}`}>
          <div className="brand">
            <img
              src={require("./logo.png")}
              className="logo"
              alt="Andrea Pesce"
            />
          </div>
          <nav className={`navMenu`}>
            <ul>
              {menuItems.map((item, index) => (
                <li
                  key={item.name}
                  onClick={
                    item.active ? () => handleMenuItemClick(index) : () => {}
                  }
                  className={item.active ? "" : "not-acrive"}
                >
                  {item.name}

                  {currentPage === item.name && (
                    <motion.div className="underline" layoutId="underline" />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="toggle-btn" onClick={handleToggleNav}>
            ☰
          </div>
        </header>

        {navOpen && (
          <nav className={`navMenu nav-open`} >
            <div className="toggle-btn closeMenu" onClick={handleToggleNav}>
              X
            </div>
            <ul>
              {menuItems.map((item, index) => (
                <li
                style={{opacity:0}}
                  key={item.name}
                  onClick={
                    item.active
                      ? () => {
                          handleMenuItemClick(index);
                          handleToggleNav();
                        }
                      : () => {}
                  }
                  className={`voceMenu ${item.active ? "" : "not-acrive"}`}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </nav>
        )}
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
              <div className="pageContent">{renderPage()}</div>
            </div>
          </motion.div>
        </AnimatePresence>

        <CatChat />
      </div>
    </ThemeProvider>
  );
}

export default App;
