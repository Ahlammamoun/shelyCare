import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) return; // attend le chargement du user (même s’il est null)

        const fetchOrders = async () => {
            if (!user) {
                setError("❌ Vous devez être connecté.");
                return;
            }

            try {
                const res = await fetch('/api/my-orders', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (!res.ok) throw new Error('❌ Erreur lors du chargement des commandes.');
                const data = await res.json();
                setOrders(data || []);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Erreur inconnue.');
            }
        };

        fetchOrders();
    }, [user]);


    if (error) {
        return <p style={{ color: 'red', padding: '2rem' }}>{error}</p>;
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#880e4f' }}>📦 Mes commandes</h2>

            {orders.length === 0 ? (
                <p>Aucune commande pour le moment.</p>
            ) : (
                orders.map(order => (
                    <div
                        key={order.id}
                        style={{
                            background: '#fff0f6',
                            border: '1px solid #f8bbd0',
                            borderRadius: '10px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                        }}
                    >
                        <h3 style={{ marginBottom: 8 }}>Commande <strong>#{order.id}</strong></h3>
                        <p><strong>📅 Date :</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>📦 Statut :</strong> {order.status ?? 'En cours'}</p>
                        <p><strong>💰 Total :</strong> {order.total.toFixed(2)} €</p>
                        <p><strong>🚚 Livraison :</strong> {(order.shippingCost ?? 0).toFixed(2)} €</p>

                        <h4 style={{ marginTop: '1rem' }}>🛍 Produits</h4>
                        <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: 10 }}>
                            {order.products.map((product, index) => (
                                <li
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: 10,
                                        borderBottom: '1px dashed #ccc',
                                        paddingBottom: 8
                                    }}
                                >
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.product}
                                            style={{
                                                width: 50,
                                                height: 50,
                                                objectFit: 'cover',
                                                borderRadius: 8,
                                                marginRight: 12,
                                                border: '1px solid #ccc',
                                            }}
                                        />
                                    )}
                                    <span>
                                        {product.quantity} × {product.product} — <strong>{product.price.toFixed(2)} €</strong>

                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}

            <button
                onClick={() => navigate('/')}
                style={{
                    marginTop: '2rem',
                    padding: '0.75rem 1.5rem',
                    background: '#880e4f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                ⬅ Retour à l'accueil
            </button>
        </div>


    );
}
