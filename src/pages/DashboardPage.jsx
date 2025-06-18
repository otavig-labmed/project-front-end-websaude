import React, { useState, useRef, useEffect, lazy, Suspense, useMemo, useCallback, memo } from "react";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/pages-styles/DashboardStyle.module.css';
import { useAuth } from '../contexts/AuthContext.jsx';
import TooltipPortal from '../components/TooltipPortal';
import { useSidebarOptimization } from '../hooks/useSidebarOptimization';

const DashboardHome = lazy(() => import('./subpages/dashboard/DashboardHome'));
const Report = lazy(() => import('./subpages/report/Report'));
const UserControll = lazy(() => import('./subpages/userControll/UserControll.jsx'));
const Settings = lazy(() => import('./subpages/Settings'));
const ManagePermissions = lazy(() => import('./subpages/ManagePermissions'));
const Calendar = lazy(() => import('./subpages/calendar/Calendar.jsx'));
const Agreements = lazy(() => import('./subpages/agreements/Agreements.jsx'));
const AccessBlocked = lazy(() => import('./subpages/AccessBlocked.jsx'));
const Findings = lazy(() => import('./subpages/findings/Findings.jsx'));
const Patient = lazy(()=> import('./subpages/patient/Patient.jsx'));

const Alert = lazy(() => import('../components/alerts/Alert'));

const LoadingFallback = memo(() => <div>Carregando...</div>);
LoadingFallback.displayName = 'LoadingFallback';

// Componente de item do menu otimizado
const MenuItem = memo(({ 
  item, 
  isActive, 
  isVisible, 
  isSidebarCollapsed, 
  hoveredItem, 
  onItemClick, 
  onMouseEnter, 
  onMouseLeave, 
  itemRef 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  return (
    <>
      <li
        ref={itemRef}
        className={isActive ? styles.active : ''}
        onClick={() => onItemClick(item.name)}
        onMouseEnter={() => {
          setIsHovered(true);
          onMouseEnter(item.name);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onMouseLeave();
        }}
      >
        <i className={`fas ${item.icon}`}></i>
        {!isSidebarCollapsed && <span>{item.label}</span>}
      </li>

      {isSidebarCollapsed && isHovered && (
        <TooltipPortal targetRef={itemRef} position="right">
          {item.label}
        </TooltipPortal>
      )}
    </>
  );
});
MenuItem.displayName = 'MenuItem';

// Componente principal otimizado
const DashboardPage = memo(() => {
  const { permissions, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const { debouncedResize, throttledScroll, debouncedStateUpdate, cleanup } = useSidebarOptimization();

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

  // Memoized menu items
  const menuItems = useMemo(() => [
    { name: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard', permission: 'dashboard_visualizar' },
    { name: 'calendar', icon: 'fa-calendar-alt', label: 'Calendário', permission: 'agenda_visualizar' },
    { name: 'engagements', icon: 'fa-clipboard-list', label: 'Compromissos', permission: 'engagements_visualizar' },
    { name: 'reports', icon: 'fa-chart-bar', label: 'Relatórios', permission: 'reportes_visualizar' },
    { name: 'medical-attention', icon: 'fa-user-doctor', label: 'Atendimento Médico', permission: 'prontuario_visualizar' },
    { name: 'patient', icon: 'fa-user-plus', label: 'Pacientes', permission: 'paciente_visualizar' },
    { name: 'financial', icon: 'fa-money-bill-wave', label: 'Caixa', permission: 'financeiro_visualizar' },
    { name: 'manage-permissions', icon: 'fa-users-cog', label: 'Gerenciar Usuários', isMaster: true },
    { name: 'agreements', icon: 'fa-handshake', label: 'Cadastro de Convênios', isMaster: true },
    { name: 'procedures', icon: 'fa-file-invoice', label: 'Procedimentos', permission: 'procedimento_visualizar' },
    { name: 'telemedicine', icon: 'fa-video', label: 'Telemedicina', permission: 'telemedicina_visualizar' },
    { name: 'offices', icon: 'fa-building', label: 'Gestão de Consultórios', permission: 'telemedicina_visualizar' },
    { name: 'attendant-attention', icon: 'fa-headset', label: 'Atendimento Atendente', permission: 'atendimento_atendente_visualizar' },
    { name: 'findings', icon: 'fa-bug', label: 'Relatar_Bugs', permission: 'findings_visualizar' },
    { name: 'settings', icon: 'fa-cog', label: 'Configurações' },
  ], []);

  // Memoized visibility checker
  const isMenuItemVisible = useCallback((itemName, itemDefinition = null) => {
    if (['dashboard', 'logout', 'settings'].includes(itemName)) {
      return true;
    }

    const currentItemDefinition = itemDefinition || menuItems.find(item => item.name === itemName);

    if (!currentItemDefinition) {
      return false;
    }

    if (currentItemDefinition.permission) {
      return permissions && Array.isArray(permissions) && permissions.includes(currentItemDefinition.permission);
    }

    if (currentItemDefinition.isMaster) {
      return userRole === 'Admin';
    }

    return false;
  }, [menuItems, permissions, userRole]);

  const visibleMenuItems = useMemo(() => 
    menuItems.filter(item => isMenuItemVisible(item.name, item)),
    [menuItems, isMenuItemVisible]
  );

  const handleItemClick = useCallback((itemName) => {
    const itemDefinition = menuItems.find(item => item.name === itemName);
    if (isMenuItemVisible(itemName, itemDefinition)) {
      setActiveItem(itemName);
    } else {
      setActiveItem('access-blocked');
    }
  }, [menuItems, isMenuItemVisible]);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    window.location.reload();
  }, [logout]);

  const handleMouseEnter = useCallback((itemName) => {
    if (isSidebarCollapsed) {
      setHoveredItem(itemName);
    }
  }, [isSidebarCollapsed]);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Mapeamento de componentes otimizado
  const componentMap = useMemo(() => ({
    dashboard: DashboardHome,
    settings: Settings,
    'manage-permissions': UserControll,
    calendar: Calendar,
    agreements: Agreements,
    findings: Findings,
    patient: Patient,
    reports: Report,
  }), []);

  const renderContent = useCallback(() => {
    if (activeItem === 'access-blocked') {
      return <AccessBlocked />;
    }

    const itemDefinition = menuItems.find(item => item.name === activeItem);

    if (!itemDefinition || !isMenuItemVisible(activeItem, itemDefinition)) {
      return <AccessBlocked />;
    }

    const Component = componentMap[activeItem];
    
    if (Component) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Component />
        </Suspense>
      );
    }

    return <AccessBlocked />;
  }, [activeItem, menuItems, isMenuItemVisible, componentMap]);

  // Otimização dos event listeners
  useEffect(() => {
    const checkOverflow = () => {
      if (navRef.current) {
        const el = navRef.current;
        const hasOverflow = el.scrollHeight > el.clientHeight && el.scrollTop + el.clientHeight < el.scrollHeight - 2;
        setShowScrollDown(hasOverflow);

        if (hasOverflow && el.scrollTop === 0) {
          debouncedStateUpdate(setScrollDownHintVisible, true, 2000);
        }
      }
    };
    
    checkOverflow();
    window.addEventListener('resize', () => debouncedResize(checkOverflow, 100));
    
    return () => {
      window.removeEventListener('resize', () => debouncedResize(checkOverflow, 100));
      cleanup();
    };
  }, [debouncedResize, debouncedStateUpdate, cleanup]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const onScroll = () => {
      throttledScroll(() => {
        if (
          el.scrollTop < lastScrollTopRef.current &&
          el.scrollTop + el.clientHeight < el.scrollHeight - 2
        ) {
          debouncedStateUpdate(setScrollDownHintVisible, true, 2000);
        } else if (el.scrollTop > lastScrollTopRef.current) {
          setScrollDownHintVisible(false);
        }
        lastScrollTopRef.current = el.scrollTop;
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [throttledScroll, debouncedStateUpdate]);

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
  }, [permissions, userRole, activeItem, menuItems]);

  useEffect(() => {
    if (showWelcomeMessage) {
      const timeout = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [showWelcomeMessage]);

  // Memoized sidebar content
  const sidebarContent = useMemo(() => (
    <aside className={styles.sidebar}>
      <nav ref={navRef}>
        <ul>
          {visibleMenuItems.map((item) => {
            if (!itemRefs.current[item.name]) {
              itemRefs.current[item.name] = React.createRef();
            }

            return (
              <MenuItem
                key={item.name}
                item={item}
                isActive={activeItem === item.name}
                isVisible={isMenuItemVisible(item.name, item)}
                isSidebarCollapsed={isSidebarCollapsed}
                hoveredItem={hoveredItem}
                onItemClick={handleItemClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                itemRef={itemRefs.current[item.name]}
              />
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
  ), [visibleMenuItems, activeItem, isSidebarCollapsed, hoveredItem, handleItemClick, handleMouseEnter, handleMouseLeave, handleLogout, handleSidebarToggle, scrollDownHintVisible, isMenuItemVisible]);

  return (
    <div className={styles.dashboardBody}>
      <div className={`${styles.dashboardWrapper} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        {sidebarContent}

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
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;