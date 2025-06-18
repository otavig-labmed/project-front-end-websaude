import React, { memo } from 'react';
import styles from '../../styles/components-styles/ButtonBiggerActions.module.css';

const ButtonBiggerActions = memo(({ children, type = "button", onClick }) => {
  return (
    <button type={type} className={styles.submitBtn} onClick={onClick}>
      {children}
    </button>
  );
});

ButtonBiggerActions.displayName = 'ButtonBiggerActions';

export default ButtonBiggerActions;
