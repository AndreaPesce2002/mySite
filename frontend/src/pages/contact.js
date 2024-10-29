import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import "./styles/contact.css";

import Swal from 'sweetalert2';
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import { gsap } from 'gsap';

import Chat from './chat_user';

function Contact() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [isLoginActive, setIsLoginActive] = useState(false);

  const animateSwitch = () => {
    const height = '-70px'
    const time = 0.7
    if (!isLoginActive) {
      gsap.to(".name-login", { rotationX: 90, duration: time });
      gsap.to(".card-login", { height: '220px', duration: time });
      gsap.to(".email-login", { translateY: height, duration: time });
      gsap.to(".password-login", { translateY: height, duration: time });
      gsap.to(".submit-login", { translateY: height, duration: time });
      gsap.to(".submit-login", { rotationX: 360, duration: time });
    } else {
      gsap.to(".name-login", { rotationX: 0, duration: time });
      gsap.to(".card-login", { height: '280px', duration: time });
      gsap.to(".email-login", { translateY: '0px', duration: time });
      gsap.to(".password-login", { translateY: '0px', duration: time });
      gsap.to(".submit-login", { translateY: '0px', duration: time });
      gsap.to(".submit-login", { rotationX: 0, duration: time });
    }

    setIsLoginActive(!isLoginActive);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    //fai login
    try {
      const response = await axios.post('http://localhost:8000/chat/login/', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status >= 200 && response.status < 300) {
        const token = response.data.auth_token;
        const cookieName = 'auth_token';
        const cookieValue = token;
        const expires = new Date(Date.now() + 3600000).toUTCString();
        document.cookie = `${cookieName}=${cookieValue}; expires=${expires}; path=/`;

        setIsAuthenticated(true);
      } else {
        console.error('Errore di login:', response.status, response.statusText);
        // Mostra un messaggio di errore all'utente
        Swal.fire({
          position: "top-end",
          icon: 'error',
          title: 'Errore di login',
          text: 'Si prega di riprovare',
          showConfirmButton: false,
        });
      }

    } catch (error) {
      console.error('Errore durante il login:', error);

      if (axios.isAxiosError(error)) {
        const errorResponse = error.response;

        if (errorResponse) {
          Swal.fire({
            position: "top-end",
            icon: 'error',
            title: 'Errore di login',
            text: errorResponse.data.message,
            showConfirmButton: false,
          })
        } else {
          Swal.fire({
            position: "top-end",
            icon: 'error',
            title: 'Errore di login',
            text: 'Si prega di riprovare',
            showConfirmButton: false,
          });
        }
      } else {
        console.error('Errore non Axios:', error);
      }
    }
  }

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const new_data = {
      'email': data['email'],
      'password': data['password'],
      'username': data['name']
    }

    console.log(new_data);

    //controlla se la mail è valida
    if (!/\S+@\S+\.\S+/.test(new_data.email)) {
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'inserisci una mail valida',
        text: 'la mail deve avere un @ e un .',
        showConfirmButton: false,
      });
      return;
    }

    //controlla se la password è valida
    if (new_data.password.length < 8) {
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'la password è troppo corta',
        text: 'la password deve contenere almeno 8 caratteri',
        footer: "<a href='https://www.infodata.ilsole24ore.com/2021/12/18/quanto-tempo-ci-vuole-decifrare-le-vostre-password/' target='_blank'>puoi saperne di più su questo articolo del ilsole24ore</a>",
        showConfirmButton: false,
      });
      return;
    }

    //la password deve contenere almeno un numero, una lettera maiuscola ed una minuscola e un carattere speciale
    const passwordRequirements = {
      hasDigit: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasSpecialChar: false,
    };

    const password = new_data.password;

    for (const char of password) {
      if (char >= '0' && char <= '9') passwordRequirements.hasDigit = true;
      if (char >= 'A' && char <= 'Z') passwordRequirements.hasUpperCase = true;
      if (char >= 'a' && char <= 'z') passwordRequirements.hasLowerCase = true;
      if (!char.match(/^[a-zA-Z0-9]$/)) passwordRequirements.hasSpecialChar = true;
    }

    if (!passwordRequirements.hasDigit) {
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'la password deve contenere almeno un numero',
        showConfirmButton: false,
      })
      return;
    }

    if (!passwordRequirements.hasUpperCase) {
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'la password deve contenere almeno una lettera maiuscola',
        showConfirmButton: false,
      })
      return;
    }

    if (!passwordRequirements.hasLowerCase) {
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'la password deve contenere almeno una lettera minuscola',
        showConfirmButton: false,
      })
      return;
    }

    if (!passwordRequirements.hasSpecialChar) {
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'la password deve contenere almeno un carattere speciale',
        showConfirmButton: false,
      })
      return;
    }

    //controlla che la password non abbia l'usderame all'interno
    if (new_data.password.toLowerCase().includes(new_data.username.toLowerCase())) {
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: 'la password non deve contenere l\'username',
        showConfirmButton: false,
      })
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/chat/create/', new_data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status >= 200 && response.status < 300) {
        const token = response.data.auth_token;
        const cookieName = 'auth_token';
        const cookieValue = token;
        const expires = new Date(Date.now() + 3600000).toUTCString();
        document.cookie = `${cookieName}=${cookieValue}; expires=${expires}; path=/`;
        setIsAuthenticated(true);
      }

      //Controlla se il cookie esiste già
      //const existingCookie = document.cookie.match(new RegExp(`${cookieName}=([^;]*)`));

    } catch (error) {

      if (error.response.data.status === 'element exist') {
        Swal.fire({
          position: "top-end",
          icon: 'error',
          title: error.response.data.message,
          showConfirmButton: false,
        })
      } else {
        console.error('Errore durante la creazione:', error);
      }
    }
  };

  gsap.to('#login-form', {
    duration: 0.5,
    opacity: 1,
    y: 0,
    ease: 'power1.inOut',
  });

  //controlla che nella pagina ci sia la il cookies auth_token
  useEffect(() => {
    animateSwitch();
    setIsLoginActive(!isLoginActive);

    try {
      const cookieName = 'auth_token';
      const cookieValue = document.cookie.match(new RegExp(`${cookieName}=([^;]*)`));
      if (cookieValue) {
        const decodedToken = jwtDecode(cookieValue[1]);
        if (!(decodedToken.exp * 1000 < Date.now())) {
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Token non valido:', error);
        Swal.fire({
          position: "top-end",
          icon: 'error',
          title: 'Token non valido. Si prega di effettuare il login.',
          showConfirmButton: false,
        })
      } else {
        console.error('Errore durante la decodifica del token:', error);
        Swal.fire({
          position: "top-end",
          icon: 'error',
          title: 'Errore durante la decodifica del token. Si prega di effettuare il login.',
          showConfirmButton: false,
        })
      }
    }
    handleLogout()
  }, []);

  //logout
  const handleLogout = () => {
    const cookieName = 'auth_token';
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <Chat />
      ) : (
        <Container maxWidth="sm">
          <Paper className="peper-login" elevation={3}>
            <Typography variant="h4" gutterBottom>
              Accedi o Registra
            </Typography>


            <Grid item xs={12} className='card-login'>
              <form onSubmit={isLoginActive ? (e) => handleSubmit(e) : (e) => handleSubmitRegister(e)} id="login-form" className='flip-card-front'>
                <TextField
                  label="Nome"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`name-login`}
                  style={{ transform: 'rotateX(90deg)' }}
                />
                <TextField
                  label="Email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  className={`email-login`}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <FormControl variant="outlined" fullWidth className='password-login' margin="normal">
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    name='password'
                  />
                </FormControl>

                <Button type="submit" variant="contained" color="primary" fullWidth className='submit-login'>
                  {isLoginActive ? 'Accedi' : 'Registrati'}
                </Button>
              </form>

            </Grid>


            <Button onClick={animateSwitch} sx={{ mt: 1, position: 'relative' }} className='flip-button'>
              {isLoginActive ? 'Passa a registrazione' : 'Torna al login'}
            </Button>
          </Paper>
        </Container>


      )}
    </>
  );
}

export default Contact;