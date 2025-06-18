import React, { useEffect } from 'react';
import styles from '../../styles/components-styles/Modal.module.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
    fullscreen: styles.fullscreen
  }[size] || styles.medium;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={`${styles.modal} ${sizeClass} ${className}`}>
        {title && (
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>{title}</h3>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Fechar modal"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 