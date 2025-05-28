import React from "react";
import { Link } from "react-router-dom";
import "./styles/NotFoundStyle.css";

const NotFoundScreen: React.FC = () => {
  return (
    <div className="not-found-container">
      <img
        src="https://media.giphy.com/media/UoeaPqYrimha6rdTFV/giphy.gif"
        alt="404 Not Found"
        className="not-found-gif"
      />
      <h1>404 - Página não encontrada</h1>
      <p>Ops! A rota que você tentou acessar não existe ou foi movida.</p>
      <Link to="/" className="back-button">Voltar para o início</Link>
    </div>
  );
};

export default NotFoundScreen;
