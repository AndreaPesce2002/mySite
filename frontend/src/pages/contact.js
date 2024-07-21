import React, { useState } from "react";
import "./styles/contact.css";
import { SocialIcon } from "react-social-icons";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Form submitted successfully");
        setFormData({ name: "", email: "", message: "" });
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      console.error("Error:", error);
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
          role="form"
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
          >
            <div className="alt-send-button">
              <SendIcon />
              <span className="send-text">SEND</span>
            </div>
          </button>
        </form>

        {/* Right contact page */}
        <div className="direct-contact-container">
          <div className="direct-contact-container">
            <ul className="contact-list">
              <li className="list-item">
                <LocationOnIcon fontSize="large" />
                <span className="contact-text place">City, State</span>
              </li>

              <li className="list-item">
                <MailIcon fontSize="large" />
                <span className="contact-text phone">
                  <a href="tel:1-212-555-5555" title="Give me a call">
                    (212) 555-2368
                  </a>
                </span>
              </li>

              <li className="list-item">
                <PhoneIcon fontSize="large" />
                <span className="contact-text gmail">
                  <a href="mailto:#" title="Send me an email">
                    hitmeup@gmail.com
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
