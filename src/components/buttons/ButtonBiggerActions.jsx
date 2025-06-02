import React from 'react';
import styles from '../../styles/components-styles/ButtonBiggerActions.module.css';

const ButtonBiggerActions = ({ children, type = "button", onClick }) => {
  return (
    <button type={type} className={styles.submitBtn} onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonBiggerActions;
