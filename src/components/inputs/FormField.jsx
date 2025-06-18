import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../styles/components-styles/InputFields.module.css';

const FormField = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  icon,
  maxLength,
  min,
  step,
  options = [],
  error,
  className = ''
}) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`${styles.input} ${className}`}
          >
            <option value="">{placeholder || 'Selecione uma opção'}</option>
            {options.map((option) => (
              <option key={option.value || option} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            className={`${styles.input} ${className}`}
            rows={4}
          />
        );
      
      default:
        return (
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            min={min}
            step={step}
            className={`${styles.input} ${className}`}
          />
        );
    }
  };

  return (
    <div className={styles["form-group"]}>
      <label className={styles["label"]} htmlFor={id}>
        {icon && <FontAwesomeIcon icon={icon} className={styles["icon-spacing"]} />}
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </label>
      <div className={styles["input-wrapper"]}>
        {renderInput()}
      </div>
      {error && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</p>}
    </div>
  );
};

export default FormField; 