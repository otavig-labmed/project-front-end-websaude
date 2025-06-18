import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import ReactDOM from "react-dom";
import styles from "../styles/pages-styles/DashboardStyle.module.css";

const TooltipPortal = memo(({ children, targetRef, position = "right" }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef();

  const updateCoords = useCallback(() => {
    if (targetRef?.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top, left;
      
      switch(position) {
        case "right":
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.right + 10;
          break;
        case "left":
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.left - tooltipRect.width - 10;
          break;
        case "top":
          top = targetRect.top - tooltipRect.height - 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case "bottom":
          top = targetRect.bottom + 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        default:
          top = targetRect.top;
          left = targetRect.right + 10;
      }

      // Ajuste para evitar que o tooltip saia da tela
      if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      if (left < 0) left = 10;
      
      if (top + tooltipRect.height > window.innerHeight) {
        top = window.innerHeight - tooltipRect.height - 10;
      }
      if (top < 0) top = 10;

      setCoords({ top, left });
      setIsVisible(true);
    }
  }, [targetRef, position]);

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        updateCoords();
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isVisible, updateCoords]);

  useEffect(() => {
    if (targetRef?.current) {
      updateCoords();
    }
  }, [targetRef, updateCoords]);

  if (!targetRef?.current || !children) return null;

  return ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      className={`${styles.tooltip} ${isVisible ? styles.show : ''}`}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none'
      }}
    >
      {children}
      <div className={styles.tooltipArrow} data-position={position}></div>
    </div>,
    document.body
  );
});

export default TooltipPortal;