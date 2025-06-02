import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import ButtonBiggerActions from "../components/buttons/ButtonBiggerActions";
import EmailInput from "../components/inputs/EmailInput";
import PasswordInput from "../components/inputs/PasswordInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/pages-styles/LoginStyle.module.css';
import logo from '../assets/imgs/logo_websaude.webp';
import computador from '../assets/imgs/img_computador.webp';

const LoginPage = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Login inválido");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.container50}>
        <div className={styles['login-box']}>
          <div className={styles.left}>
            <img src={logo} alt="Logo WebSaude" className={styles.logo} />
            <img src={computador} alt="Ilustração computador" className={styles.illustration} />
          </div>
          <div className={styles.right}>
            <div className={styles['top-bar']}>
              <a href="#">Problemas com login?</a>
              <button>SUPORTE</button>
            </div>
            <h1>Bem-vindo</h1>
            <form id="loginForm" method="POST" onSubmit={handleLogin}>
              <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                <ButtonBiggerActions type="submit">
                <FontAwesomeIcon icon={faSignInAlt} className={styles['icon-spacing']} />
                Entrar
                </ButtonBiggerActions>

            </form>
            <p className={styles.terms}>
              Ao clicar em “Entrar”, você concorda com nossos <a href="#">Termos de Uso</a> e <a href="#">Políticas de Privacidade</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;