import React, { memo } from 'react';
import styles from '../../styles/components-styles/LoadingSpinner.module.css';

const LoadingSpinner = memo(({ 
  size = 'medium', 
  text = 'Carregando...', 
  fullScreen = false,
  ariaLabel = 'Carregando conteúdo'
}) => {
  const containerClass = fullScreen 
    ? `${styles['spinner-container']} ${styles['fullscreen']}`
    : styles['spinner-container'];

  return (
    <div 
      className={containerClass}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <div 
        className={`${styles.spinner} ${styles[size]}`}
        aria-hidden="true"
      />
      {text && (
        <span 
          className={styles['loading-text']}
          style={{ fontWeight: 'bold' }}
        >
          {text}
        </span>
      )}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
