import React from 'react';
import styles from '../../styles/components-styles/CheckboxGroup.module.css';

const CheckboxGroup = ({ 
  title, 
  options = [], 
  values = {}, 
  onChange, 
  columns = 2,
  className = '' 
}) => {
  const handleCheckboxChange = (key) => {
    const newValues = {
      ...values,
      [key]: !values[key]
    };
    onChange(newValues);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '1rem'
  };

  return (
    <div className={`${styles.checkboxGroup} ${className}`}>
      {title && <h3 className={styles.checkboxGroupTitle}>{title}</h3>}
      <div className={styles.checkboxGrid} style={gridStyle}>
        {options.map((option) => (
          <div key={option.key} className={styles.checkboxItem}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={values[option.key] || false}
                onChange={() => handleCheckboxChange(option.key)}
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxText}>{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup; 