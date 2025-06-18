import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para que a próxima renderização mostre a UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Aqui você pode enviar o erro para um serviço de monitoramento
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '3rem 2rem',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Ícone animado */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              animation: 'pulse 2s infinite',
              boxShadow: '0 10px 20px rgba(255, 107, 107, 0.3)'
            }}>
              😔
            </div>

            <h1 style={{
              color: '#2d3748',
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Ops! Algo deu errado
            </h1>
            
            <p style={{
              color: '#718096',
              marginBottom: '2rem',
              lineHeight: '1.6',
              fontSize: '0.95rem'
            }}>
              Não se preocupe, isso acontece às vezes. Tente recarregar a página ou voltar ao início.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#3182ce';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(66, 153, 225, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#4299e1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(66, 153, 225, 0.3)';
                }}
              >
                🔄 Recarregar Página
              </button>

              <button
                onClick={() => window.location.href = '/'}
                style={{
                  backgroundColor: 'transparent',
                  color: '#4299e1',
                  border: '2px solid #4299e1',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
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
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginTop: '2rem',
                textAlign: 'left',
                backgroundColor: '#f7fafc',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  🔍 Detalhes do Erro (Dev)
                </summary>
                <pre style={{
                  color: '#e53e3e',
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  backgroundColor: '#fed7d7',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #feb2b2'
                }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>

          <style jsx>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 