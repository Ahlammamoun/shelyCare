import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);

        // Charger produits similaires
        fetch('/api/products')
          .then(res => res.json())
          .then(all => {
            const related = all
              .filter(p => p.category === data.category && p.id !== data.id)
              .slice(0, 4);
            setRelatedProducts(related);
          });
      });
  }, [id]);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    @keyframes slidein {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
    document.head.appendChild(styleTag);
  }, []);

  if (!product) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Chargement...</p>;

  return (
    <main style={{
      fontFamily: 'Poppins, sans-serif',
      padding: '2rem',
      background: '#fff0f6',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center'
    }}>

      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '1000px',
        width: '100%',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Bannière promo */}
        <div style={{
          background: 'linear-gradient(90deg, #f8bbd0, #fce4ec)',
          padding: '0.8rem 1.5rem',
          color: '#880e4f',
          fontWeight: 'bold',
          fontSize: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
          animation: 'slidein 0.7s ease-out'
        }}>
          🎉 Livraison gratuite dès 50 € d'achat !
        </div>

        {/* Produit principal */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '300px',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              objectFit: 'contain',
              background: '#fafafa'
            }}
          />

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', color: '#880e4f' }}>{product.name}</h1>
            <p style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>
              Catégorie : <strong>{product.category}</strong>
            </p>
            <p style={{
              backgroundColor: '#fce4ec',
              padding: '1rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              color: '#444',
              lineHeight: '1.6',
              textAlign: 'justify'
            }}>
              {product.description}
            </p>
            <h2 style={{ color: 'black', marginTop: '1rem' }}>
              Prix : <span style={{ color: '#880e4f' }}>{product.price} €</span>
            </h2>

            <button
              onClick={() => {
                addToCart(product);
                navigate('/cart');
              }}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: '#880e4f',
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              🛒 Ajouter au panier
            </button>

            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '1rem',
                padding: '0.6rem 1.2rem',
                background: '#f8bbd0',
                color: '#880e4f',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginLeft: '1rem'
              }}
            >
              ⬅ Retour
            </button>
          </div>
        </div>

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 style={{ color: '#880e4f', marginBottom: '1rem' }}>🔁 Vous aimerez aussi</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1.5rem'
            }}>
              {relatedProducts.map(prod => (
                <div key={prod.id} style={{
                  background: '#fce4ec',
                  borderRadius: '10px',
                  padding: '1rem',
                  textAlign: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{
                      width: '100%',
                      height: 120,
                      objectFit: 'contain',
                      borderRadius: 6,
                      marginBottom: 10,
                      background: '#fff'
                    }}
                  />
                  <p style={{ fontWeight: 'bold', marginBottom: 5 }}>{prod.name}</p>
                  <p style={{ marginBottom: 10 }}>{prod.price} €</p>
                  <button
                    onClick={() => navigate(`/product/${prod.id}`)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: '#880e4f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Voir
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
