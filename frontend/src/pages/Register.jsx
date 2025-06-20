import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l’inscription');
      } else {
        alert('Inscription réussie !');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue');
    }
  };


  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '400px',
        margin: '2rem auto', // centre horizontalement + marge haut/bas
        fontFamily: 'sans-serif',
        textAlign: 'center',
        background: '#fff0f6',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h2>Créer un compte</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '400px',
          margin: '0 auto', // centre le formulaire dans son parent
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem', // espace vertical entre inputs
        }}
      >
        <input
          type="text"
          name="firstname"
          placeholder="Prénom"
          required
          value={form.firstname}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            boxSizing: 'border-box', // important pour le padding et largeur
          }}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Nom"
          required
          value={form.lastname}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
          value={form.password}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#880e4f',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          S'inscrire
        </button>
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
          width: '100%',
          fontSize: '1rem',
        }}
      >
        ⬅ Retour à l'accueil
      </button>
    </div>
  );
}
