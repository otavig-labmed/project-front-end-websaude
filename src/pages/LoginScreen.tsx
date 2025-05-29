import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import './styles/variables.css';
import './styles/LoginStyle.css';

const LoginScreen: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") ?? "client";

  const endpoints: Record<string, string> = {
    attendant: "/api/login-attendant",
    client: "/api/login-client",
    professional: "/api/login-professional",
  };

  // Test
  // useEffect(() => {
  //   console.log(endpoints[type]);
  // });

  async function handleLogin(email: string, password: string) {
    const endpoint = endpoints[type] || endpoints["client"];

    // console.log(email + " " + password);
    
    try {
      const response = await fetch(endpoint, {
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
    <div className="body-center">
      <div className="logo-container floating" />

      <main>
        <div className="login-container" role="form">
          <h2>HealthBooking</h2>
          <LoginForm onSubmit={handleLogin} />
        </div>

        <footer>
          <p>
            Este sistema é uma reserva de <a href="#">WebSaúde</a>. Todos os direitos reservados &copy; {currentYear}.
          </p>
          <p>
            <a href="#">
              <i className="fas fa-lock icon-spacing" />
              Política de Privacidade
            </a>{" "}
            |
            <a href="#">
              <i className="fas fa-file-alt icon-spacing" />
              Termos de Uso
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LoginScreen;
