import React, { useEffect, useState, useCallback, memo } from "react";
import styles from "../../styles/components-styles/Alerts.module.css";

const Alert = memo(({ children, type, duration = 5000, onClose }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClose = useCallback(() => {
    setShowAlert(false);
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    setShowAlert(true);
    let interval;

    interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + (100 / (duration / 100));
      });
    }, 100);

    const timer = setTimeout(() => {
      setShowAlert(false);
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, onClose]);

  const types = {
    error: "container-alert-error",
    warning: "container-alert-warning",
    success: "container-alert-success",
    good: "container-alert-good",
  };

  return (
    <div
      className={`${styles[types[type]]} ${showAlert ? styles.show : ""}`}
    >
      <p>{children}</p>
      <button className={styles["close-btn"]} onClick={handleClose}>
        &times;
      </button>

      <div className={styles["progress-bar"]}>
        <div
          className={styles["progress"]}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
});

Alert.displayName = 'Alert';

export default Alert;
