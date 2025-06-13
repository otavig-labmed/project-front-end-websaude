import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/pages-styles/DashboardStyle.module.css';
import { useAuth } from '../contexts/AuthContext.jsx';
import TooltipPortal from '../components/TooltipPortal';

const DashboardHome = lazy(() => import('./subpages/dashboard/DashboardHome.jsx'));
const UserControll = lazy(() => import('./subpages/userControll/UserControll.jsx'));
const Settings = lazy(() => import('./subpages/Settings'));
const ManagePermissions = lazy(() => import('./subpages/ManagePermissions'));
const Calendar = lazy(() => import('./subpages/calendar/Calendar.jsx'));
const Agreements = lazy(() => import('./subpages/agreements/Agreements.jsx'));
const AccessBlocked = lazy(() => import('./subpages/AccessBlocked.jsx'));
const Alert = lazy(() => import('../components/alerts/Alert'));

const DashboardPage = () => {
  const { permissions, logout, userRole } = useAuth();
  const navigate = useNavigate();

  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard'); 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); 
  const [hoveredItem, setHoveredItem] = useState(null); 
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [scrollDownHintVisible, setScrollDownHintVisible] = useState(false);
  
  const navRef = useRef(); 
  const scrollHintTimeout = useRef(); 

  const itemRefs = useRef({}); 
  const lastScrollTopRef = useRef(0); 

  const handleItemClick = (itemName) => {
    if (isMenuItemVisible(itemName)) {
      setActiveItem(itemName);
    } else {
      setActiveItem('access-blocked');
    }
  };

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

  const menuItems = [
    { name: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { name: 'calendar', icon: 'fa-calendar-alt', label: 'Calendário', permission: 'agenda_visualizar' },
    { name: 'findings', icon: 'fa-bug', label: 'Findings', permission: 'findings_visualizar' }, 
    { name: 'engagements', icon: 'fa-clipboard-list', label: 'Engagements', permission: 'engagements_visualizar' }, 
    { name: 'reports', icon: 'fa-chart-bar', label: 'Reportes', permission: 'reports_visualizar' },
    { name: 'medical-attention', icon: 'fa-user-doctor', label: 'Atendimento Médico', permission: 'prontuario_visualizar' },
    { name: 'patients', icon: 'fa-user-plus', label: 'Pacientes', permission: 'paciente_visualizar' },
    { name: 'financial', icon: 'fa-money-bill-wave', label: 'Caixa', permission: 'financeiro_visualizar' },
    { name: 'register-professional', icon: 'fa-file-medical', label: 'Cadastrar profissional', isMaster: true }, 
    { name: 'manage-permissions', icon: 'fa-users-cog', label: 'Gerenciar Usuários', isMaster: true },
    { name: 'agreements', icon: 'fa-handshake', label: 'Cadastro de Convênios', isMaster: true }, 
    { name: 'procedures', icon: 'fa-file-invoice', label: 'Procedimentos', permission: 'procedimento_visualizar' },
    { name: 'telemedicine', icon: 'fa-video', label: 'Telemedicina', permission: 'telemedicina_visualizar' },
    { name: 'offices', icon: 'fa-building', label: 'Gestão de Consultórios', permission: 'telemedicina_visualizar' },
    { name: 'attendant-attention', icon: 'fa-headset', label: 'Atendimento Atendente', permission: 'atendimento_atendente_visualizar' }, 
    { name: 'settings', icon: 'fa-cog', label: 'Configurações' }
  ];

  const isMenuItemVisible = (itemName) => {
    if (userRole === 'Admin') return true;

    if (['dashboard', 'logout', 'settings'].includes(itemName)) return true;


    if (!itemDefinition) return false;

    if (itemDefinition.permission) {
      return permissions && permissions.includes(itemDefinition.permission);
    }

    if (itemDefinition.isMaster) {
      return userRole === 'Admin';
    }

    return false; 
  };

  const renderContent = () => {
    if (activeItem === 'access-blocked') {
      return <AccessBlocked />;
    }

    const itemDefinition = menuItems.find(item => item.name === activeItem);

    if (!itemDefinition || !isMenuItemVisible(activeItem)) {
      return <AccessBlocked />;
    }

    switch (activeItem) {
      case 'dashboard':
        return <Suspense fallback={<div>Carregando...</div>}><DashboardHome /></Suspense>;
      case 'settings':
        return <Suspense fallback={<div>Carregando...</div>}><Settings /></Suspense>;
      case 'manage-permissions':
        return <Suspense fallback={<div>Carregando...</div>}><UserControll /></Suspense>;
      case 'calendar':
        return <Suspense fallback={<div>Carregando...</div>}><Calendar /></Suspense>;
      case 'agreements':
        return <Suspense fallback={<div>Carregando...</div>}><Agreements /></Suspense>;
      case 'medical-attention':
        return <Suspense fallback={<div>Carregando...</div>}><DashboardHome /></Suspense>;
      case 'patients':
        return <Suspense fallback={<div>Carregando...</div>}><DashboardHome /></Suspense>;
      case 'financial':
        return <Suspense fallback={<div>Carregando...</div>}><DashboardHome /></Suspense>;
      case 'procedures':
        return <Suspense fallback={<div>Carregando...</div>}><DashboardHome /></Suspense>;
      case 'telemedicine':
        return <Suspense fallback={<div>Carregando...</div>}><DashboardHome /></Suspense>;
      case 'offices':
        return <Suspense fallback={<div>Carregando...</div>}><DashboardHome /></Suspense>;
      case 'attendant-attention':
        return <Suspense fallback={<div>Carregando...</div>}><DashboardHome /></Suspense>;
      default:
        return <AccessBlocked/>; 
    }
  };

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
        setScrollDownHintVisible(false);
        if (scrollHintTimeout.current) clearTimeout(scrollHintTimeout.current);
      }
      lastScrollTopRef.current = el.scrollTop; 
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll); 
  }, []);

  useEffect(() => {
    if (permissions && Array.isArray(permissions) && permissions.length > 0) {
      const findInitialActiveItem = () => {
        if (userRole === 'Admin') {
            return 'dashboard'; 
        }

        if (permissions.includes('dashboard_visualizar')) {
          return 'dashboard';
        }

        for (const item of menuItems) {
          if (['dashboard', 'logout', 'settings'].includes(item.name)) continue;

          if (item.permission && permissions.includes(item.permission)) {
            return item.name;
          }
          if (item.isMaster && userRole === 'Admin') {
            return item.name;
          }
        }

        return 'dashboard';
      };

      const initialItem = findInitialActiveItem();

      if (activeItem === 'dashboard') {
        if (initialItem && initialItem !== activeItem) {
          setActiveItem(initialItem);
        }
      }
    }
  }, [permissions, userRole]); 

  useEffect(() => {
    if (showWelcomeMessage) {
      const timeout = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000); 
      return () => clearTimeout(timeout); 
    }
  }, [showWelcomeMessage]);

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

                if (!isMenuItemVisible(item.name)) {
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

        {showWelcomeMessage && (
          <Suspense fallback={<div>Carregando...</div>}>
            <Alert type="good" duration={2000}>
              Bem-vindo ao Dashboard!
            </Alert>
          </Suspense>
        )}

        <main className={styles.mainContent}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
