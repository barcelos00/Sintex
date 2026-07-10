import React from 'react';
import './Banner.css'; 
import videoComdas from './Imagens/comidasModificacao.mp4';


const Banner = () => {
  return (
    <div className="banner-container">
      {/* Lado Esquerdo: Textos */}
      <div className="banner-content">
        <span className="banner-badge">GASTRONOMIA MUNDIAL</span>
        <h1>Uma Viagem de <br /><span>Sabores Incomparáveis</span></h1>
        <p>Da delicadeza da culinária japonesa à força dos pratos alemães, italianos e do nosso sabor brasileiro.</p>
      </div> 

      {/* Lado Direito: O Vídeo */}
      {/* <div className="banner-video-wrapper"> */}
        <video 
          src={videoComdas} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="food-animated-video"
          />
        
        <div className="video-shadow-glow"></div>
      {/* </div> */}
    </div>
  );
};

export default Banner;