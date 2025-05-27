import React from 'react';
import './styles/ButtonBiggerActions.css';

interface PropsButtonBiggerActions {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

const ButtonBiggerActions: React.FC<PropsButtonBiggerActions> = ({
  children,
  type = 'button',
  onClick,
  className = '',
}) => {
  return (
    <button type={type} onClick={onClick} className={`submit-btn ${className}`}>
      {children}
    </button>
  );
};

export default ButtonBiggerActions;
