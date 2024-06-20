import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Card,
  Button,
} from "@mui/material";

import Swal from "sweetalert2"; // Importa SweetAlert2

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import AOS from "aos";
import { gsap } from "gsap";

import fotoProfilo from "../fotoProfilo.jpg";

import "./styles/CVPage.css";

const CVPage = () => {
  const [skills, setSkills] = useState([]);
  const [imageHeights, setImageHeights] = useState([]);
  const [circleStyles, setCircleStyles] = useState([]);

  useEffect(() => {
    gsap.fromTo(
      ".card",
      {
        x: 100,
        ease: "back.out(1.7)",
        duration: 1,
        stagger: 0.1,
      },
      {
        x: 0,
        ease: "back.out(1.7)",
        duration: 1,
        stagger: 0.1,
      }
    );
  }, []);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/skills/")
      .then((response) => response.json())
      .then((data) => setSkills(data));
  }, []);

  useEffect(() => {
    const heights = skills.map((skill) => Math.random() * 150 + 50);
    setImageHeights(heights);

    // Genera stili CSS casuali per ogni cerchio
    const randomStyles = skills.map((_, index) => ({
      left: `${Math.random() * 90}%`,
      width: `${Math.random() * 60 + 30}px`,
      animationDelay: `-${
        ((Math.random() * 100) / 100) * (Math.random() * 20 + 15)
      }s`,
      animationDuration: `${Math.random() * 20 + 10}s`,
    }));
    setCircleStyles(randomStyles);
  }, [skills]);

  return (
    <Grid
      container
      sx={{
        height: "100%", // Occupa tutta l'altezza della viewport
        width: "100%", // Occupa tutta la larghezza della viewport
        marginTop: 0,
        position: "relative",
        overflow: "hidden",
        /* Se non vuoi scroll sul genitore */
      }}
      className="CVPage"
    >
      <ul className="circles">
        {skills.map((skill, index) => (
          <li
            key={skill.id}
            style={{
              ...circleStyles[index], // Applica gli stili CSS casuali
              position: "absolute",
            }}
          >
            <img
              alt={skill.name}
              src={skill.icon}
              style={{
                height: `${imageHeights[index]}px`,
                cursor: "pointer",
                width: "100%", // Immagine riempie il cerchio
                objectFit: "contain", // Mantiene le proporzioni dell'immagine
              }}
              onClick={() => {
                /* Gestore dell'evento click */
              }}
            />
          </li>
        ))}
      </ul>

      {/* CONTENUTO DESTRA (immagine, titolo, ecc.) */}
      <Grid
        item
        xs={12}
        md={7.9}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {/* Inserisci qui l'immagine */}
        <img
          src={fotoProfilo} //"https://bairesdev.mo.cloudinary.net/blog/2022/08/portrait-of-a-man-using-a-computer-in-a-modern-office-picture-id1344688156-1.jpg?tx=w_1920,q_auto" //
          alt="Foto Profilo"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            objectFit: "cover", // Aggiunta di object-fit: cover
          }}
        />

        <Typography variant="h2" gutterBottom>
          Andrea Pesce
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Web Developer
        </Typography>

        <Box mt={3}>
          {" "}
          {/* Margine superiore per i pulsanti */}
          <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Download CV
          </Button>
          <Button variant="outlined" color="primary">
            Contattami
          </Button>
        </Box>
      </Grid>

      {/* CARD SINISTRA (con scorrimento) */}
      <Grid item xs={12} md={4} sx={{ overflowY: "auto", maxHeight: "100%" }}>
        <Card
          className="card"
          sx={{ margin: 2, padding: 3, borderRadius: 2, boxShadow: 3 }}
        >
          <Typography variant="h4" gutterBottom>
            About Me
            <Divider sx={{ paddingTop: 1.5 }} />
          </Typography>

          <Typography
            variant="body1"
            sx={{ lineHeight: 1.6, textAlign: "justify" }}
          >
            Mi chiamo <b>Andrea Pesce</b>,
            <br />
            <br />
            Porto con me <b>oltre dieci anni di esperienza nel settore IT</b>,
            con una particolare enfasi sullo <b>sviluppo web</b> e le{" "}
            <b>tecnologie AI</b>. Ho solide competenze nei linguaggi di
            programmazione come <b>HTML, CSS, JavaScript e MySQL</b>, e sono
            esperto nella <b>programmazione orientata agli oggetti</b> con{" "}
            <b>Python</b>. Sono anche competente nell'uso di strumenti come{" "}
            <b>Git, Docker e Docker Compose</b>, e ho esperienza con framework
            come <b>Django e React</b>.
            <br />
            <br />
            Durante la mia carriera, ho contribuito significativamente al
            progetto open source <b>Cheshire-Cat (CCAT)</b>, sviluppando i primi
            plugin e utilizzandolo in alcuni progetti, i cui dettagli sono
            disponibili nel mio portfolio GitHub. Ho anche gestito un{" "}
            <b>blog tecnico</b> dove ho condiviso le mie conoscenze su come
            estendere le funzionalità di CCAT.
            <br />
            <br />
            Inoltre, ho recentemente completato un corso avanzato con{" "}
            <b>UMANA Forma</b>, dove ho perfezionato le mie abilità di{" "}
            <b>lavoro di squadra</b> e approfondito la mia conoscenza di{" "}
            <b>Python e Docker</b>. tune share more_vert
          </Typography>
        </Card>

        {/* MY SKILLS */}
        <Card className="card" mt={3} sx={{ margin: 2, padding: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Linguages:
              <Divider sx={{ paddingTop: 1.5 }} />
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
              {skills
                .filter((skill) => !skill.is_framework)
                .map((skill) => (
                  <img
                    key={skill.id}
                    alt={skill.name}
                    src={skill.icon}
                    style={{
                      height: 40,
                      cursor: "pointer",
                      marginLeft: 16,
                      marginTop: 16,
                    }}
                    onClick={() => {
                      Swal.fire({
                        title: skill.name,
                        html: `
                          <p>${skill.description}</p>
                          <p><b>Livello:</b> ${skill.level}</p>
                        `,
                        imageUrl: skill.icon,
                        imageWidth: 100, // Regola la dimensione dell'immagine
                        imageAlt: skill.name, // Aggiungi un testo alternativo per l'immagine
                      });
                    }}
                  />
                ))}
            </Stack>
          </Box>
          <Box mt={2}>
            <Typography variant="h6">Frameworks:</Typography>
            <Stack direction="row" spacing={2}>
              {skills
                .filter((skill) => skill.is_framework)
                .map((skill) => (
                  <img
                    key={skill.id}
                    alt={skill.name}
                    src={skill.icon}
                    style={{
                      height: 40,
                      cursor: "pointer",
                      marginLeft: 16,
                      marginTop: 16,
                    }}
                    onClick={() => {
                      Swal.fire({
                        title: skill.name,
                        html: `
                          <p>${skill.description}</p>
                          <p><b>Livello:</b> ${skill.level}</p>
                        `,
                        imageUrl: skill.icon,
                        imageWidth: 100, // Regola la dimensione dell'immagine
                        imageAlt: skill.name, // Aggiungi un testo alternativo per l'immagine
                      });
                    }}
                  />
                ))}
            </Stack>
          </Box>
        </Card>

        <Card className="card" mt={3} sx={{ margin: 2, padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            Soft Skill
            <Divider sx={{ paddingTop: 1.5 }} />
          </Typography>
          <List>
            {/* Inserisci qui i tuoi progetti */}
            <ListItem>
              <ListItemText primary="Progetto 1 - Descrizione" />
            </ListItem>
            {/* ... altri progetti ... */}
          </List>
        </Card>

        <Card className="card" mt={3} sx={{ margin: 2, padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            Contact Me
            <Divider sx={{ paddingTop: 1.5 }} />
          </Typography>
          <form>
            <TextField fullWidth label="Name" margin="normal" />
            <TextField fullWidth label="Email" margin="normal" />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              margin="normal"
            />
            <Button variant="contained" type="submit">
              Send
            </Button>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CVPage;
