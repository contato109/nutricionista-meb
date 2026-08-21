export default function Home() {
    return (
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            color: 'white',
            textAlign: 'center'
    }}>
      <h1 style={{
          fontSize: '3rem',
          fontWeight: '700',
          marginBottom: '1rem',
          letterSpacing: '-0.02em'
}}>
        Nutricionista MEB
          </h1>

      <p style={{
                  fontSize: '1.25rem',
                  marginBottom: '2rem',
                  opacity: 0.9,
                  maxWidth: '500px'
        }}>
        Plataforma de Gestão Nutricional - Método Estruturado de Bem-Estar
          </p>

      <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '3rem'
        }}>
        <button style={{
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
        }}>
          Começar
            </button>
            </div>

      <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '2rem',
                    maxWidth: '800px',
                    marginTop: '3rem'
          }}>
        <div>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</h3>
          <p>Dashboard</p>
            </div>
        <div>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</h3>
          <p>Pacientes</p>
            </div>
        <div>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📈</h3>
          <p>Relatórios</p>
            </div>
            </div>
            </div>
  );
}
