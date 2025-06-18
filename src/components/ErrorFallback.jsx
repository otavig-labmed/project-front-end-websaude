import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          margin: '0 auto 1rem',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          boxShadow: '0 6px 12px rgba(255, 107, 107, 0.3)'
        }}>
          ⚠️
        </div>

        <h3 style={{
          color: '#2d3748',
          marginBottom: '0.75rem',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          Erro ao carregar componente
        </h3>
        
        <p style={{
          color: '#718096',
          marginBottom: '1.25rem',
          lineHeight: '1.5',
          fontSize: '0.85rem'
        }}>
          Houve um problema ao carregar este conteúdo. Tente novamente.
        </p>

        <button
          onClick={resetErrorBoundary}
          style={{
            backgroundColor: '#4299e1',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            boxShadow: '0 3px 8px rgba(66, 153, 225, 0.3)'
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
      </div>
    </div>
  );
};

export default ErrorFallback; 