import React, { useState, useEffect } from 'react';
import WorkCard from './Components/work_card.js';
import './styles/work.css';
import Sketch from "react-p5";


const WorkPage = () => {
  const [works, setWorks] = useState([]);
  const [punti, setPunti] = useState([]);
  const [bgColor, setBgColor] = useState('initial');
 

  useEffect(() => {
    fetch('http://127.0.0.1:8000/works/')
      .then(response => response.json())
      .then(data => setWorks(data));
 }, []);

 // Funzioni per gestire gli eventi del mouse
 const handleMouseEnter = (e) => {
    setBgColor('rgba(0, 0, 0, 0.6)'); // Cambia il colore dello sfondo quando il mouse entra
 };

 const handleMouseLeave = () => {
    setBgColor('initial'); // Ripristina il colore originale quando il mouse esce
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(1866, 919).parent(canvasParentRef);
    const puntiIniziali = [];
    for (let i = 0; i < 200; i++) {
      puntiIniziali.push(new Punto(p5)); // Utilizza una nuova istanza di p5
    }
    setPunti(puntiIniziali);
  };

  const draw = (p5) => {
    p5.background(10);
    punti.forEach(punto => {
      punto.muovi();
      punto.mostra();
    });
    
    p5.stroke(255);
    punti.forEach((punto, index) => {
      for (let j = index + 1; j < punti.length; j++) {
        if (punto.vicinoA(punti[j])) {
          p5.line(punto.x, punto.y, punti[j].x, punti[j].y);
        }
      }
    });
  };

  class Punto {
    constructor(p) {
      this.p5 = p;
      this.x = this.p5.random(1866);
      this.y = this.p5.random(919);
      this.velocitaX = this.p5.random(-0.1, 0.1);
      this.velocitaY = this.p5.random(-0.1, 0.1);
    }

    muovi() {
      this.x += this.velocitaX;
      this.y += this.velocitaY;

      if (this.x < 0 || this.x > this.p5.windowWidth) {
        this.velocitaX *= -1;
      }
      if (this.y < 0 || this.y > this.p5.windowHeight) {
        this.velocitaY *= -1;
      }
    }

    mostra() {
      this.p5.stroke(255);
      this.p5.fill(255);
      this.p5.ellipse(this.x, this.y, 4);
    }

    vicinoA(altro) {
      let d = this.p5.dist(this.x, this.y, altro.x, altro.y);
      return d < 100;
    }
  }

  return (
    <div className='work_page'>
       <div className="sketch_wrapper" >
         <Sketch setup={setup} draw={draw} className={'sketch_css'}/>
       </div>
       <div 
         className="container_work_card" 
         style={{ backgroundColor: bgColor }} // Applica il colore dello sfondo
        >  
        {works.map((work, index) => (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            >
          <WorkCard
            key={index}
            title={work.title}
            description={work.description}
            image={'http://127.0.0.1:8000' + work.image}
            url={work.url}
          />
          </div>
          
        ))}
       </div>
    </div>
   );
};

export default WorkPage;
