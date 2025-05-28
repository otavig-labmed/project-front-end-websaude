import React, { useState } from "react";
import './styles/variables.css';
import styles from './styles/DashboardScreen.module.css';

const DashboardScreen: React.FC = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  return (
    <div className={styles.dashboardBody}>
      <div className={styles.dashboardWrapper}>
        <aside
          className={styles.sidebar}
        >
          <nav>
            <ul>
              <li
                className={activeItem === 'dashboard' ? styles.active : ''}
                onClick={() => handleItemClick('dashboard')}
              >
                <i className="fas fa-tachometer-alt"></i>
                 <span>Dashboard</span>
              </li>
              <li
                className={activeItem === 'findings' ? styles.active : ''}
                onClick={() => handleItemClick('findings')}
              >
                <i className="fas fa-bug"></i>
                <span>Findings</span>
              </li>
              <li
                className={activeItem === 'engagements' ? styles.active : ''}
                onClick={() => handleItemClick('engagements')}
              >
                <i className="fas fa-clipboard-list"></i>
                <span>Engagements</span>
              </li>
              <li
                className={activeItem === 'reports' ? styles.active : ''}
                onClick={() => handleItemClick('reports')}
              >
                <i className="fas fa-chart-bar"></i>
                <span>Reports</span>
              </li>
              <li
                className={activeItem === 'users' ? styles.active : ''}
                onClick={() => handleItemClick('users')}
              >
                <i className="fas fa-user"></i>
                <span>Users</span>
              </li>
              <li
                className={activeItem === 'calendar' ? styles.active : ''}
                onClick={() => handleItemClick('calendar')}
              >
                <i className="fas fa-calendar-alt"></i>
                <span>Calendar</span>
              </li>
              <li
                className={activeItem === 'settings' ? styles.active : ''}
                onClick={() => handleItemClick('settings')}
              >
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </li>
              <li
                className={activeItem === 'logout' ? styles.active : ''}
                onClick={() => handleItemClick('logout')}
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </li>
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
            <h1>Welcome to the {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)} Section!</h1>
            <p>This is where your {activeItem} content will be displayed.</p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;