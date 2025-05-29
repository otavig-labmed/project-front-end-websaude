import React, { useState } from "react";
import { useOutletContext } from 'react-router-dom';
import './styles/variables.css';
import styles from './styles/DashboardScreen.module.css';

// Define the type for the context data that DashboardScreen expects
interface DashboardOutletContext {
  userRole: 'doctor' | 'admin' | 'attendant' | 'patient';
  permissions: { [key: string]: number };
}

const DashboardScreen: React.FC = () => {
  // Use useOutletContext to access the data passed from the parent Route
  const { userRole, permissions } = useOutletContext<DashboardOutletContext>();

  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  const isMenuItemVisible = (itemName: string) => {
    if (itemName === 'dashboard' || itemName === 'logout') {
      return true;
    }

    if (userRole === 'doctor') {
      if (itemName === 'calendar' && permissions.agenda_visualizar > 0) return true;
      if (itemName === 'medical-attention' && permissions.prontuario_visualizar > 0) return true;
    }

    if (userRole === 'admin') {
      if (itemName === 'users' || itemName === 'settings' || permissions.is_master > 0) return true;
    }

    if (userRole === 'attendant') {
      if (itemName === 'attendant-attention') return true;
      if (itemName === 'patients' && permissions.paciente_visualizar > 0) return true;
      if (itemName === 'financial' && permissions.financeiro_visualizar > 0) return true;
      if (itemName === 'procedures' && permissions.procedimento_visualizar > 0) return true;
      if (permissions.is_master > 0 && itemName === 'agreements') return true;
      if (itemName === 'telemedicine' && permissions.telemedicina_visualizar > 0) return true;
      if (itemName === 'offices' && permissions.telemedicina_visualizar > 0) return true;
    }

    return false;
  };

  // Render content based on active item
  const renderContent = () => {
    if (userRole === 'doctor' && activeItem === 'dashboard') {
        return (
          <div className={styles.doctorDashboardContent}>
            <h2>Bem-vindo(a), Médico!</h2>
            <p>Escolha sua próxima ação abaixo.</p>
            <div className={styles.dashboardButtons}>
              <a href="/agenda/agenda_medico" className={styles.dashboardButton}>
                <i className="fas fa-calendar-alt"></i>
                <span>Agenda</span>
              </a>
              <a href="/dashboard/iniciar_atendimento" className={styles.dashboardButton}>
                <i className="fas fa-stethoscope"></i>
                <span>Iniciar Atendimento</span>
              </a>
            </div>
          </div>
        );
      }

      switch (activeItem) {
        case 'dashboard':
          return (
            <>
              <h1>Welcome to the {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)} Section!</h1>
              <p>This is where your {activeItem} content will be displayed.</p>
            </>
          );
 
        case 'findings': return <h1>Findings Section</h1>;
        case 'engagements': return <h1>Engagements Section</h1>;
        case 'reports': return <h1>Reports Section</h1>;
        case 'users': return <h1>Users Management</h1>;
        case 'calendar': return <h1>Calendar</h1>;
        case 'settings': return <h1>Settings</h1>;
        case 'logout': return <h1>Logging out...</h1>;
        case 'medical-attention': return <h1>Atendimento Médico</h1>;
        case 'patients': return <h1>Pacientes</h1>;
        case 'financial': return <h1>Caixa</h1>;
        case 'register-professional': return <h1>Cadastrar profissional de saúde</h1>;
        case 'manage-permissions': return <h1>Gerenciar Usuários</h1>;
        case 'agreements': return <h1>Cadastro de Convênios</h1>;
        case 'procedures': return <h1>Procedimentos</h1>;
        case 'telemedicine': return <h1>Telemedicina</h1>;
        case 'offices': return <h1>Gestão de Consultórios</h1>;
        case 'attendant-attention': return <h1>Atendimento Atendente</h1>;
        default: return null;
      }
  };

  return (
    <div className={styles.dashboardBody}>
      <div className={styles.dashboardWrapper}>
        <aside className={styles.sidebar}>
          <nav>
            <ul>
              {isMenuItemVisible('dashboard') && (
                <li className={activeItem === 'dashboard' ? styles.active : ''} onClick={() => handleItemClick('dashboard')}>
                  <i className="fas fa-tachometer-alt"></i>
                  <span>Dashboard</span>
                </li>
              )}
              {userRole !== 'doctor' && (
                <>
                  {isMenuItemVisible('findings') && (
                    <li className={activeItem === 'findings' ? styles.active : ''} onClick={() => handleItemClick('findings')}>
                      <i className="fas fa-bug"></i>
                      <span>Findings</span>
                    </li>
                  )}
                  {isMenuItemVisible('engagements') && (
                    <li className={activeItem === 'engagements' ? styles.active : ''} onClick={() => handleItemClick('engagements')}>
                      <i className="fas fa-clipboard-list"></i>
                      <span>Engagements</span>
                    </li>
                  )}
                </>
              )}
              {isMenuItemVisible('reports') && (
                <li className={activeItem === 'reports' ? styles.active : ''} onClick={() => handleItemClick('reports')}>
                  <i className="fas fa-chart-bar"></i>
                  <span>Reports</span>
                </li>
              )}
              {isMenuItemVisible('users') && (
                <li className={activeItem === 'users' ? styles.active : ''} onClick={() => handleItemClick('users')}>
                  <i className="fas fa-user"></i>
                  <span>Users</span>
                </li>
              )}
              {isMenuItemVisible('calendar') && (
                <li className={activeItem === 'calendar' ? styles.active : ''} onClick={() => handleItemClick('calendar')}>
                  <i className="fas fa-calendar-alt"></i>
                  <span>Agenda</span>
                </li>
              )}
              {isMenuItemVisible('settings') && (
                <li className={activeItem === 'settings' ? styles.active : ''} onClick={() => handleItemClick('settings')}>
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </li>
              )}

              {userRole === 'doctor' && permissions.prontuario_visualizar > 0 && (
                <li className={activeItem === 'medical-attention' ? styles.active : ''} onClick={() => handleItemClick('medical-attention')}>
                  <i className="fas fa-user-doctor"></i>
                  <span>Atendimento Médico</span>
                </li>
              )}
              {permissions.paciente_visualizar > 0 && (
                <li className={activeItem === 'patients' ? styles.active : ''} onClick={() => handleItemClick('patients')}>
                  <i className="fas fa-user-plus"></i>
                  <span>Pacientes</span>
                </li>
              )}
              {permissions.financeiro_visualizar > 0 && (
                <li className={activeItem === 'financial' ? styles.active : ''} onClick={() => handleItemClick('financial')}>
                  <i className="fas fa-money-bill-wave"></i>
                  <span>Caixa</span>
                </li>
              )}
              {permissions.is_master > 0 && (
                <>
                  <li className={activeItem === 'register-professional' ? styles.active : ''} onClick={() => handleItemClick('register-professional')}>
                    <i className="fas fa-file-medical"></i>
                    <span>Cadastrar profissional de saúde</span>
                  </li>
                  <li className={activeItem === 'manage-permissions' ? styles.active : ''} onClick={() => handleItemClick('manage-permissions')}>
                    <i className="fas fa-users-cog"></i>
                    <span>Gerenciar Usuários</span>
                  </li>
                  <li className={activeItem === 'agreements' ? styles.active : ''} onClick={() => handleItemClick('agreements')}>
                    <i className="fas fa-handshake"></i>
                    <span>Cadastro de Convênios</span>
                  </li>
                </>
              )}
              {permissions.procedimento_visualizar > 0 && (
                <li className={activeItem === 'procedures' ? styles.active : ''} onClick={() => handleItemClick('procedures')}>
                  <i className="fas fa-clipboard-list"></i>
                  <span>Procedimentos</span>
                </li>
              )}
              {permissions.telemedicina_visualizar > 0 && (
                <>
                  <li className={activeItem === 'telemedicine' ? styles.active : ''} onClick={() => handleItemClick('telemedicine')}>
                    <i className="fas fa-video"></i>
                    <span>Telemedicina</span>
                  </li>
                  <li className={activeItem === 'offices' ? styles.active : ''} onClick={() => handleItemClick('offices')}>
                    <i className="fas fa-door-open"></i>
                    <span>Gestão de Consultórios</span>
                  </li>
                </>
              )}
              {userRole === 'attendant' && (
                <li className={activeItem === 'attendant-attention' ? styles.active : ''} onClick={() => handleItemClick('attendant-attention')}>
                  <i className="fa-solid fa-clipboard-user"></i>
                  <span>Atendimento Atendente</span>
                </li>
              )}

              {isMenuItemVisible('logout') && (
                <li className={activeItem === 'logout' ? styles.active : ''} onClick={() => handleItemClick('logout')}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        <div className={styles.mainArea}>
          <header className={styles.topbar}>
            <div className={styles.logo}>
              WEB<span>SAUDE</span>
            </div>
          </header>

          <main className={styles.dashboardContent}>
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;