import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/pages-styles/DashboardStyle.module.css';
import { useAuth } from '../contexts/AuthContext.jsx';
import TooltipPortal from '../components/TooltipPortal';

const DashboardHome = lazy(() => import('./subpages/DashboardHome.jsx'));
const Users = lazy(() => import('./subpages/Users'));
const Settings = lazy(() => import('./subpages/Settings'));
const ManagePermissions = lazy(() => import('./subpages/ManagePermissions'));
const Calendar = lazy(() => import('./subpages/calendar/Calendar.jsx'));

const DashboardPage = () => {
  const { userRole, permissions, logout } = useAuth();
  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [scrollDownHintVisible, setScrollDownHintVisible] = useState(false);
  const navRef = useRef();
  const scrollHintTimeout = useRef();

  const itemRefs = useRef({});

  const lastScrollTopRef = useRef(0);

  const handleItemClick = (itemName) => setActiveItem(itemName);
  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleMouseEnter = (itemName) => {
    if (isSidebarCollapsed) {
      setHoveredItem(itemName);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const isMenuItemVisible = (itemName) => {
    if (itemName === 'dashboard' || itemName === 'logout' || itemName === 'settings') return true;

    switch (userRole) {
      case 'doctor':
        return itemName === 'medical-attention' && permissions.prontuario_visualizar > 0;
      case 'admin':
        return itemName === 'users' || permissions.is_master > 0;
      case 'attendant':
        return (
          itemName === 'calendar' ||
          itemName === 'attendant-attention' ||
          (itemName === 'patients' && permissions.paciente_visualizar > 0) ||
          (itemName === 'financial' && permissions.financeiro_visualizar > 0) ||
          (itemName === 'procedures' && permissions.procedimento_visualizar > 0) ||
          (permissions.is_master > 0 && itemName === 'agreements') ||
          (itemName === 'telemedicine' && permissions.telemedicina_visualizar > 0) ||
          (itemName === 'offices' && permissions.telemedicina_visualizar > 0)
        );
      default:
        return false;
    }
  };

  const renderContent = () => {
    if (userRole === 'doctor' && activeItem === 'dashboard') {
      return <Suspense fallback={<div>Carregando...</div>}><DashboardHome /></Suspense>;
    }
    switch (activeItem) {
      case 'dashboard':
        return <Suspense fallback={<div>Carregando...</div>}><DashboardHome /></Suspense>;
      case 'users':
        return <Suspense fallback={<div>Carregando...</div>}><Users /></Suspense>;
      case 'settings':
        return <Suspense fallback={<div>Carregando...</div>}><Settings /></Suspense>;
      case 'manage-permissions':
        if (permissions.is_master > 0) {
          return <Suspense fallback={<div>Carregando...</div>}><ManagePermissions /></Suspense>;
        } else {
          return <div><h2>Acesso negado</h2><p>Você não tem permissão para acessar esta página.</p></div>;
        }
      case 'calendar':
        if (userRole === 'doctor' || userRole === 'attendant') {
          return <Suspense fallback={<div>Carregando...</div>}><Calendar /></Suspense>;
        } else {
          return <div><h2>Acesso negado</h2><p>Você não tem permissão para acessar esta página.</p></div>;
        }
      default:
        return null;
    }
  };

  const menuItems = [
    { name: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { name: 'calendar', icon: 'fa-calendar-alt', label: 'Calendario', roles: ['doctor', 'attendant'] },
    { name: 'findings', icon: 'fa-bug', label: 'Findings', role: 'non-doctor' },
    { name: 'engagements', icon: 'fa-clipboard-list', label: 'Engagements', role: 'non-doctor' },
    { name: 'reports', icon: 'fa-chart-bar', label: 'Reportes' },
    { name: 'users', icon: 'fa-user', label: 'Usuários' },
    { name: 'medical-attention', icon: 'fa-user-doctor', label: 'Atendimento Médico', role: 'doctor', permission: 'prontuario_visualizar' },
    { name: 'patients', icon: 'fa-user-plus', label: 'Pacientes', permission: 'paciente_visualizar' },
    { name: 'financial', icon: 'fa-money-bill-wave', label: 'Caixa', permission: 'financeiro_visualizar' },
    { name: 'register-professional', icon: 'fa-file-medical', label: 'Cadastrar profissional', isMaster: true },
    { name: 'manage-permissions', icon: 'fa-users-cog', label: 'Gerenciar Usuários', isMaster: true },
    { name: 'agreements', icon: 'fa-handshake', label: 'Cadastro de Convênios', isMaster: true },
    { name: 'procedures', icon: 'fa-file-invoice', label: 'Procedimentos', permission: 'procedimento_visualizar' },
    { name: 'telemedicine', icon: 'fa-video', label: 'Telemedicina', permission: 'telemedicina_visualizar' },
    { name: 'offices', icon: 'fa-building', label: 'Gestão de Consultórios', permission: 'telemedicina_visualizar' },
    { name: 'attendant-attention', icon: 'fa-headset', label: 'Atendimento Atendente', role: 'attendant' },
    { name: 'settings', icon: 'fa-cog', label: 'Configurações' }
  ];

  useEffect(() => {
    const checkOverflow = () => {
      if (navRef.current) {
        const el = navRef.current;
        const hasOverflow = el.scrollHeight > el.clientHeight && el.scrollTop + el.clientHeight < el.scrollHeight - 2;
        setShowScrollDown(hasOverflow);

        if (hasOverflow && el.scrollTop === 0) {
          setScrollDownHintVisible(true);
          if (scrollHintTimeout.current) clearTimeout(scrollHintTimeout.current);
          scrollHintTimeout.current = setTimeout(() => setScrollDownHintVisible(false), 2000);
        }
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
      if (scrollHintTimeout.current) clearTimeout(scrollHintTimeout.current);
    };
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const onScroll = () => {
      if (
        el.scrollTop < lastScrollTopRef.current &&
        el.scrollTop + el.clientHeight < el.scrollHeight - 2 
      ) {
        setScrollDownHintVisible(true);
        if (scrollHintTimeout.current) clearTimeout(scrollHintTimeout.current);
        scrollHintTimeout.current = setTimeout(() => setScrollDownHintVisible(false), 2000);
      } else if (el.scrollTop > lastScrollTopRef.current) {
        // Rolar para baixo: esconde imediatamente
        setScrollDownHintVisible(false);
        if (scrollHintTimeout.current) clearTimeout(scrollHintTimeout.current);
      }
      lastScrollTopRef.current = el.scrollTop;
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.dashboardBody}>
      <div className={`${styles.dashboardWrapper} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        <aside className={styles.sidebar}>
          <nav ref={navRef}>
            <ul>
              {menuItems.map((item) => {
         
                if (!itemRefs.current[item.name]) {
                  itemRefs.current[item.name] = React.createRef();
                }
                if (
                  !isMenuItemVisible(item.name) ||
                  (item.role === 'non-doctor' && userRole === 'doctor') ||
                  (item.role && item.role !== userRole) ||
                  (item.roles && !item.roles.includes(userRole)) ||
                  (item.permission && permissions[item.permission] <= 0) ||
                  (item.isMaster && permissions.is_master <= 0)
                ) {
                  return null;
                }

                return (
                  <li
                    key={item.name}
                    ref={itemRefs.current[item.name]}
                    className={activeItem === item.name ? styles.active : ''}
                    onClick={() => handleItemClick(item.name)}
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                    {isSidebarCollapsed && hoveredItem === item.name && (
                      <TooltipPortal targetRef={itemRefs.current[item.name]}>{item.label}</TooltipPortal>
                    )}
                  </li>
                );
              })}

              <li
                className={`${activeItem === 'logout' ? styles.active : ''} ${styles.logoutItem}`}
                onClick={handleLogout}
                onMouseEnter={() => handleMouseEnter('logout')}
                onMouseLeave={handleMouseLeave}
                ref={itemRefs.current['logout'] || (itemRefs.current['logout'] = React.createRef())}
              >
                <i className="fas fa-sign-out-alt"></i>
                {!isSidebarCollapsed && <span>Logout</span>}
                {isSidebarCollapsed && hoveredItem === 'logout' && (
                  <TooltipPortal targetRef={itemRefs.current['logout']}>Logout</TooltipPortal>
                )}
              </li>
            </ul>
            {scrollDownHintVisible && (
              <div className={styles.scrollDownHint}>
                <i className="fas fa-chevron-down"></i>
              </div>
            )}
          </nav>

          <div
            className={`${styles.sidebarToggle} ${isSidebarCollapsed ? styles.collapsed : ''}`}
            onClick={handleSidebarToggle}
            onMouseEnter={() => handleMouseEnter('toggle')}
            onMouseLeave={handleMouseLeave}
            ref={itemRefs.current['toggle'] || (itemRefs.current['toggle'] = React.createRef())}
          >
            <i className={`fas ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            {!isSidebarCollapsed && <span style={{ marginLeft: 10 }}>Colapsar</span>}
            {isSidebarCollapsed && hoveredItem === 'toggle' && (
              <TooltipPortal targetRef={itemRefs.current['toggle']}>Expandir</TooltipPortal>
            )}
          </div>
        </aside>

        <main className={styles.mainContent}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;