import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/pages-styles/LoginStyle.module.css';
import logo from '../assets/imgs/logo_websaude.webp';
import computador from '../assets/imgs/img_computador.webp';
import { useAuth } from '../contexts/AuthContext'; // Make sure the path is correct

const EmailInput = lazy(() => import("../components/inputs/EmailInput"));
const PasswordInput = lazy(() => import("../components/inputs/PasswordInput"));
const ButtonBiggerActions = lazy(() => import("../components/buttons/ButtonBiggerActions"));

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    await login(email, password);
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
              <Suspense fallback={<div>Carregando...</div>}>
                <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                <ButtonBiggerActions type="submit" disabled={isLoading}>
                  <FontAwesomeIcon icon={faSignInAlt} className={styles['icon-spacing']} />
                  {isLoading ? "Entrando..." : "Entrar"}
                </ButtonBiggerActions>
              </Suspense>
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