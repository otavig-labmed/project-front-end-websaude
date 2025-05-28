import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPaperPlane, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ButtonBiggerActions from "../buttons/ButtonBiggerActions";
import './styles/FormGroup.css';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <ButtonBiggerActions type="submit">
        <FontAwesomeIcon icon={faPaperPlane} className="icon-spacing" />
        Enviar instruções
      </ButtonBiggerActions>

      <Link to="/" className="link-register" style={{ display: "inline-block", marginTop: "15px" }}>
        <FontAwesomeIcon icon={faArrowLeft} className="icon-spacing" />
        Voltar para acessos
      </Link>
    </form>
  );
};

export default ForgotPasswordForm;
