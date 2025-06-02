import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages-styles/NotFoundStyle.module.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles['not-found-container']}>
      <h1 style={{ fontSize: '6rem', color: '#1e88e5' }}>404</h1>
      <h1>Página não encontrada</h1>
      <p>
        Desculpe, a página que você tentou acessar não pôde ser encontrada.
        Verifique se o endereço está correto ou volte para a página anterior.
      </p>
      <button onClick={handleGoBack} className={styles['back-button']}>
        Retornar...
      </button>
    </div>
  );
};

export default NotFoundPage;