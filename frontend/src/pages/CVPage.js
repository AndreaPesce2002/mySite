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
import { gsap } from 'gsap';

const CVPage = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/skills/")
      .then((response) => response.json())
      .then((data) => setSkills(data));
  }, []);

  return (
    <Grid
      container
      sx={{
        height: "100%", // Occupa tutta l'altezza della viewport
        width: "100%", // Occupa tutta la larghezza della viewport
        marginTop: 0,
      }}
    >
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
        }}
      >
        {/* Inserisci qui l'immagine */}
        <img
          src="https://bairesdev.mo.cloudinary.net/blog/2022/08/portrait-of-a-man-using-a-computer-in-a-modern-office-picture-id1344688156-1.jpg?tx=w_1920,q_auto"
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
        <Card sx={{ margin: 2, padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            About Me
            <Divider sx={{ paddingTop: 1.5 }} />
          </Typography>

          <Typography variant="body1">
            {/* Inserisci qui la tua descrizione */}
            Sono uno sviluppatore web appassionato di tecnologie front-end e
            back-end. Amo creare interfacce utente intuitive e applicazioni web
            performanti.
          </Typography>
        </Card>

        {/* MY SKILLS */}
        <Card mt={3} sx={{ margin: 2, padding: 3 }}>
          <Box>
            <Typography variant="h6">Languages:</Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              {skills
                .filter((skill) => !skill.is_framework)
                .map((skill) => (
                  <img
                    key={skill.id}
                    alt={skill.name}
                    src={skill.icon}
                    style={{ height: 40, cursor: "pointer",  marginLeft: 16, marginTop: 16}}
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
                    style={{ height: 40, cursor: "pointer",  marginLeft: 16, marginTop: 16}}
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

        <Card mt={3} sx={{ margin: 2, padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            My Work
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

        <Card mt={3} sx={{ margin: 2, padding: 3 }}>
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
