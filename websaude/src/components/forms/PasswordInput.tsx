import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './styles/InputFields.css';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor="password">
        <FontAwesomeIcon icon={faLock} className="icon-spacing" />
        Senha
      </label>
      <div className="input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="Digite sua senha"
          value={value}
          onChange={onChange}
          required
        />
        <button
          type="button"
          className="toggle-password"
          aria-label="Mostrar senha"
          onClick={() => setShowPassword(!showPassword)}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
