import React from 'react';
import styles from '../../styles/components-styles/FormGrid.module.css';

const FormGrid = ({ 
  children, 
  columns = 2, 
  gap = '1rem',
  className = '' 
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gap
  };

  return (
    <div className={`${styles.formGrid} ${className}`} style={gridStyle}>
      {children}
    </div>
  );
};

export default FormGrid; 