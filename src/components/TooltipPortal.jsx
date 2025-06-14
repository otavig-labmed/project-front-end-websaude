import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "../styles/pages-styles/DashboardStyle.module.css";

const TooltipPortal = ({ children, targetRef }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef();

  useEffect(() => {
    if (targetRef && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 10
      });
    }
  }, [targetRef, children]);

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      className={styles.tooltip}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        transform: "translateY(-50%)",
        zIndex: 9999
      }}
    >
      {children}
      <div className={styles.tooltipArrow}></div>
    </div>,
    document.body
  );
};

export default TooltipPortal; 