import React from 'react';
import styles from '../../styles/components-styles/LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles['spinner-container']}>
      <div className={styles.spinner}></div>
      <span style={{ fontWeight: 'bold' }}>Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;
