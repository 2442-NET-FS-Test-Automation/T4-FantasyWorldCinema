import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Extraemos el estado global y las funciones del contexto de auth
  const { login, logout, status, user, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(identifier, password);
    if (success) {
      console.log("Succesfully logIn");
    } else {
      console.log("Failed to logIn");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Test Authentication .NET + React</h2>

      {/* Panel para ver el estado actual en tiempo real */}
      <div style={{ background: '#f4f4f4', color: '#333', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Estado:</strong> <code>{status}</code></p>
        <p><strong>Usuario logueado:</strong> {user ? JSON.stringify(user) : 'Ninguno'}</p>
        {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      </div>

      {/* Formulario de Login */}
      {status !== 'authenticated' ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Usuario / Email:</label>
            <input 
              type="text" 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={status === 'authenticating'}
            style={{ padding: '10px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {status === 'authenticating' ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      ) : (
        <button 
          onClick={logout}
          style={{ padding: '10px', background: '#cc0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cerrar Sesión (Logout)
        </button>
      )}
    </div>
  );
}