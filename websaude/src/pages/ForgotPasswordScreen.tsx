import React from "react";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import './styles/variables.css';
import './styles/LoginStyle.css';

const ForgotPasswordScreen: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleForgotPassword = async (email: string) => {
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        alert("Erro ao solicitar redefinição.");
        return;
      }

      alert("Instruções de redefinição enviadas para seu e-mail.");
    } catch (err) {
      console.error(err);
      alert("Erro na solicitação. Tente novamente.");
    }
  };

  return (
    <div>
      <div className="logo-container floating" />

      <main>
        <div className="login-container" role="form">
          <h2>Recuperar Senha</h2>
          <p style={{ textAlign: "center", marginBottom: "15px" }}>
            Informe o e-mail cadastrado para receber as instruções de redefinição.
          </p>

          <ForgotPasswordForm onSubmit={handleForgotPassword} />
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

export default ForgotPasswordScreen;
