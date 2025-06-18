import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages-styles/NotFoundStyle.module.css";

// Componente como função nomeada para compatibilidade com Fast Refresh
function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe.</p>
        <button onClick={handleGoBack} className={styles.backButton}>
          Voltar
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;