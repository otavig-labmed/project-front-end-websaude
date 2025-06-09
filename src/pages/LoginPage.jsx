import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/pages-styles/LoginStyle.module.css';
import logo from '../assets/imgs/logo_websaude.webp';
import computador from '../assets/imgs/img_computador.webp';
import axios from 'axios'; // Importando o axios

const EmailInput = lazy(() => import("../components/inputs/EmailInput"));
const PasswordInput = lazy(() => import("../components/inputs/PasswordInput"));
const ButtonBiggerActions = lazy(() => import("../components/buttons/ButtonBiggerActions"));

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useEffect(() => {
  //   const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  //   if (token) {
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/", 
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Envia o cookie automaticamente com a requisição
        }
      );

      if (response.status !== 200) {
        alert(`Login inválido: ${response.data.detail || 'Erro desconhecido'}`);
        return;
      }

      alert(`${response.data.message}`);
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
            <hr />
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
