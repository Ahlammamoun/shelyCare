import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '2rem 1rem',
      background: '#fce4ec',
      fontFamily: 'sans-serif',
      fontSize: '0.9rem',
      textAlign: 'center',
      color: '#880e4f',
      borderTop: '1px solid black'
    }}>


      {/* Liens utiles */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.5rem',
        marginBottom: '1rem',
        fontWeight: 'bold'
      }}>
        <a href="/contact" style={{ textDecoration: 'none', color: '#880e4f' }}>📬 Nous contacter</a>
        <a href="/conditions" style={{ textDecoration: 'none', color: '#880e4f' }}>📄 Conditions générales</a>
        <a href="/confidentialite" style={{ textDecoration: 'none', color: '#880e4f' }}>🔒 Confidentialité</a>
        <a href="/faq" style={{ textDecoration: 'none', color: '#880e4f' }}>❓ FAQ</a>
      </div>


      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 'bold',
        color: '#880e4f',
        marginBottom: '1rem'
      }}>
        <span style={{ fontSize: '1.2rem' }}>🚚</span>
        <span>Livraison gratuite dès 50 € d'achats</span>
      </div>
      {/* Logos de paiement (captures écran) */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1rem',
        marginBottom: '1rem'
      }}>
        <img src="/assets/payment-logos/visa.jpg" alt="Visa" style={{ height: '30px' }} />
        <img src="/assets/payment-logos/mastercard.jpg" alt="MasterCard" style={{ height: '30px' }} />
        <img src="/assets/payment-logos/Paypal.jpg" alt="PayPal" style={{ height: '30px' }} />

      </div>

      {/* Copyright */}
      <p style={{ marginTop: '1rem' }}>
        &copy; {new Date().getFullYear()} ShelyCare – Beauté & Bien-être
      </p>
    </footer>
  );
}
