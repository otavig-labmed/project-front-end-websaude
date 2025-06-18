import React, { useState, Suspense, useCallback, useMemo } from "react";
import styles from "../styles/components-styles/BodgettMenu.module.css";

// Componente de fallback reutilizável
const LoadingFallback = () => <div>Carregando...</div>;

const BodgettMenu = ({ components }) => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemClick = useCallback((component, index) => {
    setActiveComponent(component);
    setActiveIndex(index);
  }, []);

  const menuItems = useMemo(() => components, [components]);

  const renderContent = useCallback(() => {
    if (components.length === 0) {
      return (
        <div className={styles.logoContainer}>
        </div>
      );
    }

    return (
      <>
        <nav className={styles.bodgettNav}>
          <ul className={styles.bodgettNavList}>
            {menuItems.map((item, idx) => (
              <li key={idx} className={activeIndex === idx ? styles.bodgettActive : ""}>
                <button
                  onClick={() => handleItemClick(item.component, idx)}
                  className={styles.menuButton}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.componentContainer}>
          <Suspense fallback={<LoadingFallback />}>
            {activeComponent || components[0].component}
          </Suspense>
        </div>
      </>
    );
  }, [components, menuItems, activeIndex, activeComponent, handleItemClick]);

  return (
    <div className={styles.bodgettContainer}>
      <h1 className={styles.bodgettTitle}>WebSaude</h1>
      {renderContent()}
    </div>
  );
};

export default BodgettMenu;
