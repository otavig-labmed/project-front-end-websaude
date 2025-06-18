import { useCallback, useRef } from 'react';

export const useSidebarOptimization = () => {
  const resizeTimeoutRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const tickingRef = useRef(false);

  // Debounced resize handler
  const debouncedResize = useCallback((callback, delay = 100) => {
    try {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(callback, delay);
    } catch (error) {
      console.error('Erro no debouncedResize:', error);
    }
  }, []);

  // Throttled scroll handler
  const throttledScroll = useCallback((callback) => {
    try {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          callback();
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    } catch (error) {
      console.error('Erro no throttledScroll:', error);
    }
  }, []);

  // Debounced state update
  const debouncedStateUpdate = useCallback((setter, value, delay = 50) => {
    try {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => setter(value), delay);
    } catch (error) {
      console.error('Erro no debouncedStateUpdate:', error);
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    try {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      tickingRef.current = false;
    } catch (error) {
      console.error('Erro no cleanup:', error);
    }
  }, []);

  return {
    debouncedResize,
    throttledScroll,
    debouncedStateUpdate,
    cleanup
  };
}; 