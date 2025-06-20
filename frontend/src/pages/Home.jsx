import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Erreur chargement catégories", err));
  }, []);

  useEffect(() => {
    const url = selectedCategory
      ? `/api/products?category=${encodeURIComponent(selectedCategory)}`
      : '/api/products';

    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Erreur chargement produits:', err));
  }, [selectedCategory]);


  return (
    <main style={{
      padding: '2rem',
      fontFamily: 'sans-serif',
      background: '#f7f7f7',
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      // flex: '0 0 40%',
      // backgroundImage: 'url("/assets/backgrounds/bg-towels.jpg")',
      // backgroundSize: 'contain',
      // backgroundRepeat: 'no-repeat',
      // backgroundPosition: 'left',
      // backgroundColor: '#f7f7f7'
    }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        <section style={{
          textAlign: 'center',
          marginBottom: '2rem',
          background: 'linear-gradient(to right, #fff0f5, #ffe4e1)',
          padding: '3rem',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{ color: '#880e4f', fontSize: '2rem', marginBottom: '1rem' }}>
            Bienvenue sur ShelyCare 💖
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#444', maxWidth: 600, margin: 'auto' }}>
            Découvrez nos soins et produits de maquillage naturels pour sublimer votre beauté au quotidien.
          </p>
          <p>
            <span style={{ fontSize: '2rem' }}>💄</span>
            <span style={{ fontSize: '2rem' }}>🧴</span>
            <span style={{ fontSize: '2rem' }}>🪞</span>
            <span style={{ fontSize: '2rem' }}>💅</span>
            <span style={{ fontSize: '2rem' }}>🧼</span>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
            style={{
              marginTop: '2rem',
              background: '#880e4f',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              borderRadius: '30px',
              cursor: 'pointer'
            }}
          >
            Découvrir la collection
          </button>
        </section>

        {/* Catégories */}
        <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
          }}>
            <div
              onClick={() => setSelectedCategory(null)}
              style={{
                background: selectedCategory === null ? '#f8bbd0' : '#fce4ec',
                padding: '1rem 1.5rem',
                borderRadius: '20px',
                fontWeight: 'bold',
                color: '#880e4f',
                cursor: 'pointer',
                boxShadow: '0 10px 10px rgba(0,0,0,0.1)',
              }}
            >
              Tous
            </div>

            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  background: selectedCategory === cat.name ? '#f8bbd0' : '#fce4ec',
                  padding: '1rem 1.5rem',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  color: '#880e4f',
                  cursor: 'pointer',
                  boxShadow: '0 10px 10px rgba(0,0,0,0.1)',
                }}
              >
                {cat.name}
              </div>
            ))}
          </div>
        </section>

        {/* Produits */}
        <section style={{ textAlign: 'center' }}>
          {/* <h2 style={{ color: '#880e4f', marginBottom: '1rem' }}>Nos produits</h2> */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1.5rem',
            justifyContent: 'center',
          }}>
            {products.slice(0, 25).map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  border: '2px solid #e6e6fa',
                }}
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    backgroundColor: '#f9f9f9'
                  }}
                />
                <h4 style={{ color: '#880e4f', fontSize: '1rem' }}>{prod.name}</h4>
                <h2 style={{ color: 'black', fontSize: '1rem' }}>prix: {prod.price} €</h2>



                <button
                  onClick={() => navigate(`/product/${prod.id}`)}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'black',
                    border: 'none',
                    borderRadius: '20px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Découvrir
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

