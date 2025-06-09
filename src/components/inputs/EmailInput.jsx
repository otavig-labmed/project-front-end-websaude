import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/components-styles/InputFields.module.css';

const EmailInput = ({ value, onChange }) => {
  return (
    <div className={styles["form-group"]}>
      <label className={styles["label"]} htmlFor="email">
        <FontAwesomeIcon icon={faEnvelope} className={styles["icon-spacing"]} />
        E-mail
      </label>
      <div className={styles["input-wrapper"]}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="seu@exemplo.com"
          value={value}
          onChange={onChange}
          required
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default EmailInput;
