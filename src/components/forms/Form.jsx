import React from 'react';
import FormSection from './FormSection';
import FormActions from './FormActions';
import FormGrid from '../layout/FormGrid';
import styles from '../../styles/components-styles/Form.module.css';

const Form = ({
  title,
  onSubmit,
  onCancel,
  onReset,
  loading = false,
  disabled = false,
  submitText = 'Salvar',
  cancelText = 'Cancelar',
  resetText = 'Limpar',
  showCancel = true,
  showReset = false,
  children,
  className = '',
  sections = []
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && !disabled) {
      onSubmit(e);
    }
  };

  const handleCancel = () => {
    if (!loading && !disabled) {
      onCancel();
    }
  };

  const handleReset = () => {
    if (!loading && !disabled) {
      onReset();
    }
  };

  return (
    <div className={`${styles.formContainer} ${className}`}>
      {title && <h1 className={styles.formTitle}>{title}</h1>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <FormSection
              key={index}
              title={section.title}
              description={section.description}
              collapsible={section.collapsible}
              defaultOpen={section.defaultOpen}
            >
              {section.content}
            </FormSection>
          ))
        ) : (
          children
        )}
        
        <FormActions
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onReset={handleReset}
          submitText={submitText}
          cancelText={cancelText}
          resetText={resetText}
          loading={loading}
          disabled={disabled}
          showCancel={showCancel}
          showReset={showReset}
        />
      </form>
    </div>
  );
};

export default Form; 