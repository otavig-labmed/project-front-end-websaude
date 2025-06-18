import React, { memo } from 'react';
import styles from '../../styles/components-styles/PopUp.module.css';

const PopUp = memo(({ isOpen, onClose, children, title = "Informação" }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
});

PopUp.displayName = 'PopUp';

export default PopUp;
