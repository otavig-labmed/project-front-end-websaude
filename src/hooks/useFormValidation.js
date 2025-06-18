import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';

/**
 * Hook personalizado para formulários com validação Zod
 * @param {Object} schema - Schema Zod para validação
 * @param {Object} defaultValues - Valores padrão do formulário
 * @param {Function} onSubmit - Função executada quando o formulário é enviado
 * @returns {Object} Objeto com métodos e estado do formulário
 */
export const useFormValidation = (schema, defaultValues = {}, onSubmit = null) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const {
    register,
    handleSubmit: originalHandleSubmit,
    formState,
    reset,
    setValue,
    getValues,
    watch,
    trigger,
    clearErrors,
    setError,
    setFocus
  } = form;

  const { errors, isValid, isDirty } = formState;

  // Função para lidar com o envio do formulário
  const handleFormSubmit = useCallback(async (data) => {
    if (!onSubmit) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(data);
      // Se chegou aqui, o envio foi bem-sucedido
      reset(data); // Reset mantendo os valores enviados
    } catch (error) {
      console.error('Erro no envio do formulário:', error);
      setSubmitError(error.message || 'Erro ao enviar formulário');
      
      // Se o erro tem campos específicos, definir erros nos campos
      if (error.fields) {
        Object.entries(error.fields).forEach(([field, message]) => {
          setError(field, {
            type: 'server',
            message
          });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, reset, setError]);

  // Função para resetar o formulário
  const resetForm = useCallback((values = defaultValues) => {
    reset(values);
    setSubmitError(null);
    clearErrors();
  }, [reset, clearErrors, defaultValues]);

  // Função para validar um campo específico
  const validateField = useCallback(async (fieldName) => {
    return await trigger(fieldName);
  }, [trigger]);

  // Função para validar todos os campos
  const validateAll = useCallback(async () => {
    return await trigger();
  }, [trigger]);

  // Função para definir valor e validar
  const setValueAndValidate = useCallback(async (fieldName, value) => {
    setValue(fieldName, value);
    await trigger(fieldName);
  }, [setValue, trigger]);

  // Função para verificar se o formulário pode ser enviado
  const canSubmit = useCallback(() => {
    return isValid && isDirty && !isSubmitting;
  }, [isValid, isDirty, isSubmitting]);

  // Função para obter erros de um campo específico
  const getFieldError = useCallback((fieldName) => {
    return errors[fieldName]?.message;
  }, [errors]);

  // Função para verificar se um campo tem erro
  const hasFieldError = useCallback((fieldName) => {
    return !!errors[fieldName];
  }, [errors]);

  // Função para obter todos os erros
  const getAllErrors = useCallback(() => {
    return Object.entries(errors).map(([field, error]) => ({
      field,
      message: error.message
    }));
  }, [errors]);

  return {
    // Métodos do react-hook-form
    register,
    handleSubmit: handleFormSubmit,
    reset: resetForm,
    setValue,
    getValues,
    watch,
    trigger,
    clearErrors,
    setError,
    setFocus,
    
    // Estado do formulário completo
    formState,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    submitError,
    
    // Métodos personalizados
    validateField,
    validateAll,
    setValueAndValidate,
    canSubmit,
    getFieldError,
    hasFieldError,
    getAllErrors
  };
};

/**
 * Hook para validação de campos específicos
 * @param {string} fieldName - Nome do campo
 * @param {Object} validationRules - Regras de validação
 * @returns {Object} Objeto com métodos de validação
 */
export const useFieldValidation = (fieldName, validationRules = {}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const validateField = useCallback(async (value) => {
    setIsValidating(true);
    setValidationError(null);

    try {
      // Aqui você pode implementar validações customizadas
      if (validationRules.required && !value) {
        throw new Error('Campo obrigatório');
      }

      if (validationRules.minLength && value.length < validationRules.minLength) {
        throw new Error(`Mínimo de ${validationRules.minLength} caracteres`);
      }

      if (validationRules.maxLength && value.length > validationRules.maxLength) {
        throw new Error(`Máximo de ${validationRules.maxLength} caracteres`);
      }

      if (validationRules.pattern && !validationRules.pattern.test(value)) {
        throw new Error(validationRules.patternMessage || 'Formato inválido');
      }

      if (validationRules.custom && typeof validationRules.custom === 'function') {
        const customResult = await validationRules.custom(value);
        if (!customResult.isValid) {
          throw new Error(customResult.message);
        }
      }

      return { isValid: true, error: null };
    } catch (error) {
      setValidationError(error.message);
      return { isValid: false, error: error.message };
    } finally {
      setIsValidating(false);
    }
  }, [validationRules]);

  return {
    validateField,
    isValidating,
    validationError,
    clearValidationError: () => setValidationError(null)
  };
}; 