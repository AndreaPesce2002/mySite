import React, { useEffect } from 'react';
import './styles/CVPage.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { FaCode, FaLaptopCode, FaGamepad } from 'react-icons/fa';
import { Box, Container, Typography } from '@mui/material';

const CVPage = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom data-aos="fade-up">
          Andrea Pesce
        </Typography>
        <Typography variant="subtitle1" gutterBottom data-aos="fade-up" data-aos-delay="200">
          Programmatore Python e appassionato di intelligenza artificiale
        </Typography>
      </Box>

      <Box my={4} data-aos="fade-up" data-aos-delay="400">
        <Typography variant="h5" component="h2" gutterBottom>
          Esperienza lavorativa
        </Typography>
        <ul>
          <li>SVIA srl: sviluppatore Python e Django</li>
          <li>IMAC srl: stage</li>
        </ul>
      </Box>

      <Box my={4} data-aos="fade-up" data-aos-delay="600">
        <Typography variant="h5" component="h2" gutterBottom>
          Abilità
        </Typography>
        <ul>
          <li>
            <FaCode /> Python
          </li>
          <li>
            <FaCode /> JavaScript
          </li>
          <li>
            <FaLaptopCode /> Django
          </li>
          <li>
            <FaLaptopCode /> React
          </li>
          <li>
            <FaLaptopCode /> Intelligenza artificiale
          </li>
        </ul>
      </Box>

      <Box my={4} data-aos="fade-up" data-aos-delay="800">
        <Typography variant="h5" component="h2" gutterBottom>
          Passioni
        </Typography>
        <ul>
          <li>
            <FaGamepad /> Sviluppo di videogiochi
          </li>
          <li>Atletica</li>
        </ul>
      </Box>

      <Box my={4} data-aos="fade-up" data-aos-delay="1000">
        <Typography variant="h5" component="h2" gutterBottom>
          Progetti
        </Typography>
        <ul>
          <li>AimTrainer: gioco di tiro a segno in Python</li>
          <li>Rete neurale: semplice rete neurale in Python</li>
          <li>City of CCAT: gioco di città in Python</li>
        </ul>
      </Box>
    </Container>
  );
};

export default CVPage;