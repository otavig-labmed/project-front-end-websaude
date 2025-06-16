import React from "react";
import styles from '../../../styles/pages-styles/FindingsStyle.module.css';

const FindingsCreate = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reportar Bug</h2>
        
        <div className={styles.scrollContainer}>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Título do Bug</label>
              <input 
                type="text" 
                id="title" 
                placeholder="Descreva brevemente o problema"
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Descrição Detalhada</label>
              <textarea 
                id="description" 
                rows={5}
                placeholder="Descreva o bug com detalhes, incluindo passos para reproduzir..."
                className={styles.textarea}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="severity" className={styles.label}>Gravidade</label>
              <select id="severity" className={styles.select}>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="screenshot" className={styles.label}>Captura de Tela (opcional)</label>
              <input 
                type="file" 
                id="screenshot" 
                accept="image/*"
                className={styles.fileInput}
              />
            </div>
            
            <button type="submit" className={styles.submitButton}>
              Enviar Relatório
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindingsCreate;