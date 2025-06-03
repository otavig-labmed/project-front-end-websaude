import React from "react";
import styles from "./../../styles/pages-styles/AccessBlockedStyle.module.css";

const AccessBlockedPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.message}>
        <span>ACESSO BLOQUEADO... </span>
        <span className={styles.icon}>🚫</span> 
      </div>
    </div>
  );
}

export default AccessBlockedPage;
