import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faAt } from '@fortawesome/free-solid-svg-icons';
import './styles/InputFields.css';

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange }) => (
  <div className="form-group">
    <label htmlFor="email">
      <FontAwesomeIcon icon={faEnvelope} className="icon-spacing" />
      E-mail
    </label>
    <div className="input-wrapper">
      <input
        type="email"
        id="email"
        name="email"
        placeholder="seu@exemplo.com"
        value={value}
        onChange={onChange}
        required
      />
      <FontAwesomeIcon icon={faAt} className="input-icon" />
    </div>
  </div>
);

export default EmailInput;
