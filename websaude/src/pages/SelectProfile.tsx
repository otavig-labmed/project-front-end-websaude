// src/pages/SelectProfile.tsx
import React from 'react';
import AccessCard from '../components/cards/AccessCard';
import './styles/SelectProfileStyle.css';

const SelectProfile: React.FC = () => {
  return (
    <div className="select-profile">
      <div className="header">
        <div className="logo">
          <i className="fas fa-heartbeat"></i> HealthAccess
        </div>
        <h1>Qual é o seu perfil?</h1>
        <p className="subtitle">
          Selecione abaixo o tipo de acesso que melhor corresponde ao seu perfil para entrar no nosso sistema de saúde integrado
        </p>
      </div>

      <div className="container">
        <AccessCard
          role="attendant"
          title="Atendente"
          description="Acesso completo ao sistema de agendamento, gestão de clientes e ferramentas administrativas para o gerenciamento diário da clínica."
          iconClass="fa-user-tie"
          href="/login?type=attendant"
        />
        <AccessCard
          role="client"
          title="Cliente"
          description="Área do paciente com acesso a agendamentos online, histórico médico completo, receitas digitais e informações pessoais."
          iconClass="fa-user"
          href="/login"
        />
        <AccessCard
          role="professional"
          title="Profissional"
          description="Acesso especializado a prontuários eletrônicos, agenda de consultas, prescrições médicas e ferramentas de diagnóstico."
          iconClass="fa-user-md"
          href="/login?type=professional"
        />
      </div>

      <div className="footer">
        <p>
          © 2025 HealthAccess. Todos os direitos reservados.
          <a href="#"> Termos de uso</a> | <a href="#">Política de privacidade</a>
        </p>
      </div>
    </div>
  );
};

export default SelectProfile;
