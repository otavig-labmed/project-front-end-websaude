import React, { useState, Suspense } from "react";
import styles from "../styles/components-styles/BodgettMenu.module.css";

const BodgettMenu = ({ components }) => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemClick = (component, index) => {
    setActiveComponent(component);
    setActiveIndex(index);
  };

  return (
    <div className={styles.bodgettContainer}>
      <h1 className={styles.bodgettTitle}>WebSaude</h1>
      <nav className={styles.bodgettNav}>
        <ul className={styles.bodgettNavList}>
          {components.map((item, idx) => (
            <li 
              key={idx} 
              className={activeIndex === idx ? styles.bodgettActive : ""}
            >
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
        {activeComponent || (components.length > 0 && (
          <Suspense fallback={<div>Carregando...</div>}>
            {components[0].component}
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default BodgettMenu;