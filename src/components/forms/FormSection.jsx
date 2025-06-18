import React from 'react';
import styles from '../../styles/components-styles/FormSection.module.css';

const FormSection = ({ 
  title, 
  children, 
  description, 
  collapsible = false, 
  defaultOpen = true,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  if (collapsible) {
    return (
      <details 
        className={`${styles.section} ${className}`} 
        open={isOpen}
        onToggle={(e) => setIsOpen(e.target.open)}
      >
        <summary className={styles.sectionSummary}>
          {title}
        </summary>
        {description && <p className={styles.sectionDescription}>{description}</p>}
        <div className={styles.sectionContent}>
          {children}
        </div>
      </details>
    );
  }

  return (
    <div className={`${styles.section} ${className}`}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {description && <p className={styles.sectionDescription}>{description}</p>}
      <div className={styles.sectionContent}>
        {children}
      </div>
    </div>
  );
};

export default FormSection; 