import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Identifiants invalides');

      const data = await res.json(); // data.token

      const profileRes = await fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (!profileRes.ok) throw new Error('Erreur lors de la récupération du profil');

      const profile = await profileRes.json();

      // ✅ Stockage complet avec roles
      login({
        id: profile.id,
        firstname: profile.firstname,
        email: profile.email,
        roles: profile.roles || [],
        token: data.token,
      });

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }; 

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border:'5px', margin:'0 auto', maxWidth: '400px', margin: '2rem auto',}}>
      <h2 style={{color: 'rgb(136, 14, 79)'}}>Connexion</h2>
      <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: 'auto' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc',}}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc',}}
        />
        <button
          type="submit"
          style={{
            background: 'rgb(136, 14, 79)',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
          }}
        >
          Se connecter
        </button>

        <div style={{ marginTop: '1rem' }}>
          <Link to="/register">
            <button
              style={{
                background: 'rgb(136, 14, 79)',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
              }}
            >
              S'enregistrer
            </button>
          </Link>
        </div>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>

      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          background: '#f48fb1',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        ⬅ Retour à l'accueil
      </button>
    </div>
  );
}
