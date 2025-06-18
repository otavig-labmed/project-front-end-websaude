import React from 'react';
import styles from '../../styles/components-styles/FormActions.module.css';

const FormActions = ({ 
  onSubmit, 
  onCancel, 
  onReset,
  submitText = 'Salvar', 
  cancelText = 'Cancelar',
  resetText = 'Limpar',
  loading = false,
  disabled = false,
  showCancel = true,
  showReset = false,
  className = ''
}) => {
  return (
    <div className={`${styles.formActions} ${className}`}>
      {showReset && (
        <button
          type="button"
          onClick={onReset}
          className={styles.resetButton}
          disabled={loading || disabled}
        >
          {resetText}
        </button>
      )}
      
      {showCancel && (
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={loading || disabled}
        >
          {cancelText}
        </button>
      )}
      
      <button
        type="submit"
        onClick={onSubmit}
        className={styles.submitButton}
        disabled={loading || disabled}
      >
        {loading ? 'Salvando...' : submitText}
      </button>
    </div>
  );
};

export default FormActions; 