import React from 'react';
import './styles/AccessCard.css';

interface AccessCardProps {
  role: 'attendant' | 'client' | 'professional';
  title: string;
  description: string;
  iconClass: string;
  href: string;
}

const AccessCard: React.FC<AccessCardProps> = ({ role, title, description, iconClass, href }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const wave = document.createElement('span');
    wave.className = 'wave';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;

    btn.appendChild(wave);
    setTimeout(() => wave.remove(), 600);
  };

  return (
    <div className={`access-card ${role}`}>
      <div className="icon-wrapper">
        <i className={`fas ${iconClass} icon`}></i>
      </div>
      <h2>{title}</h2>
      <p className="description">{description}</p>
      <a href={href} className="btn" onClick={handleClick}>
        Acessar <i className="fas fa-arrow-right"></i>
      </a>
    </div>
  );
};

export default AccessCard;
