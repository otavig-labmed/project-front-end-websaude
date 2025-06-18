import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook para implementar rate limiting no frontend
 * @param {number} maxAttempts - Número máximo de tentativas permitidas
 * @param {number} timeWindow - Janela de tempo em milissegundos
 * @param {number} cooldownPeriod - Período de cooldown após exceder tentativas
 * @returns {Object} Objeto com funções e estado do rate limiting
 */
export const useRateLimit = (maxAttempts = 3, timeWindow = 60000, cooldownPeriod = 300000) => {
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const lastAttemptRef = useRef(0);
  const blockUntilRef = useRef(0);
  const intervalRef = useRef(null);

  // Cleanup do interval no unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Função para verificar se pode fazer tentativa
  const canAttempt = useCallback(() => {
    const now = Date.now();
    
    // Se está bloqueado, verificar se já passou o período de cooldown
    if (isBlocked) {
      if (now >= blockUntilRef.current) {
        setIsBlocked(false);
        setAttempts(0);
        setRemainingTime(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return true;
      }
      return false;
    }

    // Se passou a janela de tempo, resetar tentativas
    if (now - lastAttemptRef.current > timeWindow) {
      setAttempts(0);
      return true;
    }

    // Verificar se não excedeu o limite
    return attempts < maxAttempts;
  }, [attempts, isBlocked, maxAttempts, timeWindow]);

  // Função para registrar uma tentativa
  const recordAttempt = useCallback(() => {
    const now = Date.now();
    lastAttemptRef.current = now;
    
    setAttempts(prev => {
      const newAttempts = prev + 1;
      
      // Se excedeu o limite, bloquear
      if (newAttempts >= maxAttempts) {
        setIsBlocked(true);
        blockUntilRef.current = now + cooldownPeriod;
        setRemainingTime(cooldownPeriod);

        // Iniciar contador regressivo
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        intervalRef.current = setInterval(() => {
          setRemainingTime(prev => {
            const remaining = blockUntilRef.current - Date.now();
            if (remaining <= 0) {
              setIsBlocked(false);
              setAttempts(0);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              return 0;
            }
            return remaining;
          });
        }, 1000);
      }
      
      return newAttempts;
    });
  }, [maxAttempts, cooldownPeriod]);

  // Função para resetar o rate limiting
  const reset = useCallback(() => {
    setAttempts(0);
    setIsBlocked(false);
    setRemainingTime(0);
    lastAttemptRef.current = 0;
    blockUntilRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Função para obter informações do rate limiting
  const getRateLimitInfo = useCallback(() => {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptRef.current;
    const timeRemainingInWindow = Math.max(0, timeWindow - timeSinceLastAttempt);
    
    // Calcular canAttempt diretamente aqui para evitar recursão
    let canAttemptNow = false;
    
    if (isBlocked) {
      canAttemptNow = now >= blockUntilRef.current;
    } else if (now - lastAttemptRef.current > timeWindow) {
      canAttemptNow = true;
    } else {
      canAttemptNow = attempts < maxAttempts;
    }
    
    return {
      attempts,
      maxAttempts,
      remainingAttempts: Math.max(0, maxAttempts - attempts),
      isBlocked,
      remainingTime,
      timeRemainingInWindow,
      canAttempt: canAttemptNow
    };
  }, [attempts, maxAttempts, isBlocked, remainingTime, timeWindow]);

  // Cleanup no unmount
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return {
    canAttempt,
    recordAttempt,
    reset,
    getRateLimitInfo,
    cleanup,
    attempts,
    isBlocked,
    remainingTime
  };
}; 