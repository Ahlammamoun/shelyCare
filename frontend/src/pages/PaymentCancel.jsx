import React from 'react';

export default function PaymentCancel() {
  return (
    <div style={{
      padding: '3rem',
      textAlign: 'center',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ color: '#c62828' }}>❌ Paiement annulé</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
        Votre commande n'a pas été finalisée. Vous pouvez réessayer à tout moment.
      </p>
    </div>
  );
}
