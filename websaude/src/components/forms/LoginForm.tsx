import React, { useState } from "react";
import ButtonBiggerActions from "../buttons/ButtonBiggerActions";
import { Link } from "react-router-dom";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faKey  } from '@fortawesome/free-solid-svg-icons';
import './styles/FormGroup.css';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form id="loginForm" method="POST" onSubmit={handleSubmit}>
      <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
      <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

      <ButtonBiggerActions type="submit">
        <FontAwesomeIcon icon={faSignInAlt} className="icon-spacing" />
        Entrar
      </ButtonBiggerActions>

      <Link className="link-register" to="/forgot-password">
        <FontAwesomeIcon icon={faKey} className="icon-spacing" />
        Esqueci a senha
      </Link>
    </form>
  );
};

export default LoginForm;
