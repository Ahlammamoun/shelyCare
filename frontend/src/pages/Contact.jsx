import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        const error = await res.json();
        console.error('Erreur API :', error);
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#fff' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#880e4f', marginBottom: '1rem' }}>Contactez-nous 💌</h1>
        <p style={{ marginBottom: '2rem' }}>
          Une question, une remarque ou juste envie de dire bonjour ? Remplis ce formulaire et on te répond rapidement !
        </p>

        {sent && (
          <div style={{ background: '#d4edda', padding: '1rem', borderRadius: '8px', color: '#155724' }}>
            Merci pour ton message, on revient vers toi très vite ! 💖
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Ton nom"
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Ton email"
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <textarea
            name="message"
            value={form.message}
            placeholder="Ton message"
            rows="5"
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Envoyer ✉️</button>
        </form>
      </div>
    </main>
  );
}

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem'
};

const buttonStyle = {
  background: '#880e4f',
  color: 'white',
  border: 'none',
  padding: '0.75rem',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer'
};
