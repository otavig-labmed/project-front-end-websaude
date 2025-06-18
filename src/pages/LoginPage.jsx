import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/pages-styles/LoginStyle.module.css';
import logo from '../assets/imgs/logo_websaude.webp';
import computador from '../assets/imgs/img_computador.webp';
import { useAuth } from '../contexts/AuthContext';
import { ALERT_TYPES, TIMEOUTS } from '../utils/constants.js';
import { loginSchema } from '../utils/validationSchemas.js';

const EmailInput = lazy(() => import("../components/inputs/EmailInput"));
const PasswordInput = lazy(() => import("../components/inputs/PasswordInput"));
const ButtonBiggerActions = lazy(() => import("../components/buttons/ButtonBiggerActions"));
const Alert = lazy(() => import('../components/alerts/Alert'));

// Componente como função nomeada para compatibilidade com Fast Refresh
function LoginPage() {
  const navigate = useNavigate();
  const [alertStatus, setAlertStatus] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();

  // Formulário com validação usando react-hook-form diretamente
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setError,
    clearErrors,
    reset
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  // Adicionar classe ao body para garantir o fundo azul
  useEffect(() => {
    document.body.classList.add('login-page');
    document.documentElement.classList.add('login-page');
    
    return () => {
      document.body.classList.remove('login-page');
      document.documentElement.classList.remove('login-page');
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]); 

  useEffect(() => {
    if (alertStatus) {
      const timer = setTimeout(() => {
        setAlertStatus(null); 
      }, TIMEOUTS.LOGIN_ALERT_DURATION); 

      return () => clearTimeout(timer);
    }
  }, [alertStatus]); 

  // Rate limiting simples
  useEffect(() => {
    if (loginAttempts >= 3) {
      setIsBlocked(true);
      const timer = setTimeout(() => {
        setIsBlocked(false);
        setLoginAttempts(0);
      }, 300000); // 5 minutos

      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const handleLogin = useCallback(async (data) => {
    if (isBlocked) {
      setAlertStatus("Muitas tentativas. Aguarde 5 minutos.");
      return;
    }

    setAlertStatus(null);
    clearErrors();

    try {
      const result = await login(data.email, data.password);

      if (!result) {
        setLoginAttempts(prev => prev + 1);
        setError('email', {
          type: 'server',
          message: 'Email ou senha incorretos'
        });
        setError('password', {
          type: 'server',
          message: 'Email ou senha incorretos'
        });
        setAlertStatus("Email ou senha incorretos. Por favor, tente novamente.");
      } else {
        // Login bem-sucedido, resetar tentativas
        setLoginAttempts(0);
        setIsBlocked(false);
      }
    } catch (error) {
      console.error("Ocorreu um erro inesperado durante o login:", error);
      setAlertStatus("Ocorreu um erro inesperado: " + (error.message || "Verifique sua conexão."));
    }
  }, [login, setError, clearErrors, isBlocked]);

  // Verificar se pode enviar o formulário
  const canSubmit = isValid && isDirty && !isLoading && !isBlocked;

  return (
    <div className={styles['login-container']}>
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
          <form onSubmit={handleSubmit(handleLogin)}>
            <Suspense fallback={<div>Carregando...</div>}>
              <div className={styles['form-group']}>
                <EmailInput 
                  {...register('email')}
                  error={errors.email?.message}
                  disabled={isLoading || isBlocked}
                />
              </div>
              <div className={styles['form-group']}>
                <PasswordInput 
                  {...register('password')}
                  error={errors.password?.message}
                  disabled={isLoading || isBlocked}
                />
              </div>
              <ButtonBiggerActions 
                type="submit" 
                disabled={!canSubmit}
              >
                <FontAwesomeIcon icon={faSignInAlt} className={styles['icon-spacing']} />
                {isLoading ? "Entrando..." : "Entrar"}
              </ButtonBiggerActions>
            </Suspense>
          </form>
          
          {/* Informações de rate limiting */}
          {isBlocked && (
            <div className={styles['rate-limit-info']}>
              <p>Tentativas excedidas. Aguarde 5 minutos.</p>
            </div>
          )}
          
          {!isBlocked && loginAttempts > 0 && (
            <div className={styles['rate-limit-warning']}>
              <p>Tentativas restantes: {3 - loginAttempts}</p>
            </div>
          )}

          <p className={styles.terms}>
            Ao clicar em "Entrar", você concorda com nossos <a href="#">Termos de Uso</a> e <a href="#">Políticas de Privacidade</a>
          </p>

          {alertStatus && (
            <Suspense fallback={<div>Carregando...</div>}>
              <Alert type={ALERT_TYPES.ERROR} duration={TIMEOUTS.LOGIN_ALERT_DURATION}>
                {alertStatus}
              </Alert>
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
