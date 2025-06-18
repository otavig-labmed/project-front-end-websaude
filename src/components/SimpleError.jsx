import React from 'react';

const SimpleError = ({ 
  title = "Ops! Algo deu errado", 
  message = "Não se preocupe, isso acontece às vezes. Tente novamente.",
  onRetry,
  onGoHome = true
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
        maxWidth: '380px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Ícone */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 1.25rem',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: '0 8px 16px rgba(255, 107, 107, 0.3)'
        }}>
          😔
        </div>

        <h2 style={{
          color: '#2d3748',
          marginBottom: '0.75rem',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          {title}
        </h2>
        
        <p style={{
          color: '#718096',
          marginBottom: '1.5rem',
          lineHeight: '1.5',
          fontSize: '0.9rem'
        }}>
          {message}
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#3182ce';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#4299e1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🔄 Tentar Novamente
            </button>
          )}

          {onGoHome && (
            <button
              onClick={() => window.location.href = '/'}
              style={{
                backgroundColor: 'transparent',
                color: '#4299e1',
                border: '1px solid #4299e1',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#4299e1';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#4299e1';
              }}
            >
              🏠 Voltar ao Início
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleError; 