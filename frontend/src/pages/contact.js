import React, { useState } from "react";
import "./styles/contact.css";
import { SocialIcon } from "react-social-icons";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Definisci il mixin con opzioni predefinite
  const swalOptions = {
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  };

  const [isElaborate, setIsElaborate] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    setIsElaborate(true);
    e.preventDefault();
    try {
      // Controlla se l'email è valida
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Email non valida");
      }

      const response = await fetch("http://127.0.0.1:8000/send-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `L'utente ${formData.name} (${formData.email}) ha ti ha inviato un mesaggio:\n\n${formData.message}`,
          subject: `Hai ricevuto un nuovo messaggio da ${formData.name} (${formData.email})`,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // Mostra un messaggio di conferma usando SweetAlert2
      Swal.mixin(swalOptions).fire(
        "Success!",
        "Il tuo messaggio è stato inviato con successo.",
        "success"
      );

      setFormData({ name: "", email: "", message: "" });
      setIsElaborate(false);
    } catch (error) {
      setIsElaborate(false);

      console.error("Error:", error);
      // Mostra un messaggio di errore se l'email non è valida
      if (error.message === "Email non valida") {
        Swal.mixin(swalOptions).fire({
          icon: "error",
          text: "Inserisci un indirizzo email valido.",
        });
      } else {
        Swal.mixin(swalOptions).fire({
          icon: "error",
          text: `Invio non riuscito: ${error.message}`,
        });
      }
    }
  };

  return (
    <section id="contact">
      <h1 className="section-header">Contact</h1>

      <div className="contact-wrapper">
        {/* Left contact page */}
        <form
          id="contact-form"
          className="form-horizontal"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <div className="col-sm-12">
              <TextField
                fullWidth
                margin="normal"
                label="NAME"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <TextField
                fullWidth
                margin="normal"
                label="EMAIL"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <TextField
            fullWidth
            margin="normal"
            label="MESSAGE"
            multiline
            rows={10}
            variant="outlined"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button
            className="btn btn-primary send-button"
            id="submit"
            type="submit"
            value="SEND"
            disabled={isElaborate}
          >
            <div className={!isElaborate ? "alt-send-button" : null}>
              {isElaborate ? (
                <div className="dots send-text">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <>
                  <SendIcon /> <span className="send-text">SEND</span>
                </>
              )}
            </div>
          </button>
        </form>

        {/* Right contact page */}
        <div className="direct-contact-container">
          <div className="direct-contact-container">
            <ul className="contact-list">
              <li className="list-item">
                <LocationOnIcon fontSize="large" />

                <span className="contact-text place">
                  <a
                    href="https://maps.app.goo.gl/uiuMbxNxBZqb9wzj9"
                    title="Give me a position"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PADOVA
                  </a>
                </span>
              </li>

              <li className="list-item">
                <MailIcon fontSize="large" />
                <span className="contact-text phone">
                  <a
                    href="tel:+393887235885"
                    title="Give me a call"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +39 388 7235 885
                  </a>
                </span>
              </li>

              <li className="list-item">
                <PhoneIcon fontSize="large" />
                <span className="contact-text gmail">
                  <a
                    href="mailto:andrea.pesce.lavoro@gmail.com"
                    title="Invia un'email a Andrea Pesce"
                  >
                    andrea.pesce.lavoro@gmail.com
                  </a>
                </span>
              </li>
            </ul>

            <hr />
            <div className="social-links-contact">
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
            <hr />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
