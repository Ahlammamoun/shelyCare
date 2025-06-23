import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 👈 useAuth hook
import Logo from './Logo';
import { useCart } from '../context/CartContext';


export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 👈 nettoie localStorage et contexte
    navigate('/');
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav style={{
      background: '#fce4ec',
      padding: '1.5rem 2rem',
      borderBottom: '1px solid black',
      fontFamily: 'sans-serif',
      fontWeight: '600',
      color: '#880e4f',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Logo />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.5rem', cursor: 'pointer' }}>🛒</span>
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#e91e63',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              {totalItems}
            </span>
          )}
        </Link>

        {user?.email && (
          <Link to="/my-orders">
            <button style={{ background: 'rgb(136, 14, 79)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px' }}>
              Mes commandes
            </button>
          </Link>
        )}

        {user?.firstname && <span style={{ fontSize: '1rem', color: 'black' }}>💁‍♀️ Bonjour : {user.firstname}</span>}

        {isAdmin && (
          <Link to="/admin">
            <button style={{
              background: '#880e4f',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer'
            }}>
              Admin
            </button>
          </Link>
        )}

        {user ? (
          <button onClick={handleLogout} style={{
            background: 'rgb(136, 14, 79)',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}>
            Déconnexion
          </button>
        ) : (
          <>
            <Link to="/login">
              <button style={buttonStyle}>Se connecter</button>
            </Link>
            <Link to="/register">
              <button style={buttonStyle}>S’enregistrer</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const buttonStyle = {
  background: 'rgb(136, 14, 79)',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer'
};
