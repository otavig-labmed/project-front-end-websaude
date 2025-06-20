import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/components-styles/InputFields.module.css';

const PasswordInput = ({ 
  value, 
  onChange, 
  error, 
  disabled = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles["form-group"]}>
      <label className={styles["label"]} htmlFor="password">
        <FontAwesomeIcon icon={faLock} className={styles["icon-spacing"]} />
        Senha
      </label>
      <div className={styles["input-wrapper"]}>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="Digite sua senha"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${styles.input} ${error ? styles.error : ''}`}
          {...props}
        />
        <button
          type="button"
          className={styles["toggle-password"]}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label="Mostrar ou ocultar senha"
          disabled={disabled}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
      {error && (
        <span className={styles["error-message"]}>
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;
