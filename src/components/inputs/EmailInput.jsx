import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faAt } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/components-styles/InputFields.module.css';

const EmailInput = ({ value, onChange }) => {
  const isEmail = value.includes('@');
  const icon = isEmail ? faAt : faUser;

  return (
    <div className={styles["form-group"]}>
      <label className={styles["label"]} htmlFor="email">
        <FontAwesomeIcon icon={faEnvelope} className={styles["icon-spacing"]} />
        E-mail ou Usuário
      </label>
      <div className={styles["input-wrapper"]}>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="seu@exemplo.com ou nome de usuário"
          value={value}
          onChange={onChange}
          required
          className={styles.input}
        />
        <FontAwesomeIcon icon={icon} className={styles["input-icon"]} />
      </div>
    </div>
  );
};

export default EmailInput;