import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <span style={{fontWeight: "bold"}}>Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;
