import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const { cart, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    postalCode: '',
    city: '',
    phone: '',
  });
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const shippingCost = total >= 50 ? 0 : 3.9;
  const grandTotal = total + shippingCost;
  const [isRedirecting, setIsRedirecting] = useState(false);



  useEffect(() => {
    console.log('🧪 Utilisateur courant :', user);
  }, [user]);

  const handleCheckout = async () => {
    if (
      !user ||
      !Array.isArray(user.roles) ||
      !user.roles.some(role => role === 'ROLE_USER' || role === 'ROLE_ADMIN')
    ) {
      alert("❌ Vous devez être connecté avec un compte autorisé pour passer commande.");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const shippingCost = total >= 50 ? 0 : 3.9;
    const grandTotal = total + shippingCost;

    try {
      const res = await fetch("/api/order-from-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          products: cart.map(p => ({ id: p.id, quantity: p.quantity })), // 👈 changer 'items' en 'products'
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.postalCode} ${shippingInfo.city} - Tel: ${shippingInfo.phone}`
        })



      });

      const data = await res.json();

      if (data.orderId) {
        setIsRedirecting(true);
        clearCart();
        window.location.href = `/api/checkout/${data.orderId}`;
      } else {
        alert("Erreur de création de commande");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors du paiement");
    }
  };

  const isFormValid = () => {
    return (
      shippingInfo.address.trim() &&
      shippingInfo.postalCode.trim() &&
      shippingInfo.city.trim() &&
      shippingInfo.phone.trim()
    );
  };





  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🛒 Votre panier</h1>

      {isRedirecting ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner" />
          <p style={{ marginTop: '1rem' }}>Redirection vers le paiement en cours...</p>
        </div>
      ) : cart.length === 0 ? (
        <p style={styles.empty}>Votre panier est vide.</p>
      ) : (
        <div style={styles.columns}>
          {/* Colonne Gauche : Panier */}
          <div style={styles.leftColumn}>
            <div style={styles.cartList}>
              {cart.map(product => (
                <div key={product.id} style={styles.cartItem}>
                  <div>
                    <strong>{product.name}</strong><br />
                    {product.quantity} × {product.price} € ={" "}
                    <strong>{(product.quantity * product.price).toFixed(2)} €</strong>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    style={styles.removeBtn}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.total}>
              <p><strong>Sous-total : {total.toFixed(2)} €</strong></p>
              <p><strong>Livraison : {shippingCost.toFixed(2)} €</strong></p>
              <p><strong>Total à payer : {grandTotal.toFixed(2)} €</strong></p>
            </div>


            <button
              onClick={() => navigate("/")}
              style={styles.continueBtn}
            >
              🛍️ Continuer ses achats
            </button>
          </div>

          {/* Colonne Droite : Livraison */}
          <div style={styles.rightColumn}>
            <h3 style={styles.deliveryTitle}>📦 Informations de livraison</h3>

            <label style={styles.label}>Adresse</label>
            <input
              type="text"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
              style={styles.input}
            />

            <label style={styles.label}>Code postal</label>
            <input
              type="text"
              value={shippingInfo.postalCode}
              onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
              style={styles.input}
            />

            <label style={styles.label}>Ville</label>
            <input
              type="text"
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
              style={styles.input}
            />

            <label style={styles.label}>Numéro de téléphone</label>
            <input
              type="tel"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
              style={styles.input}
            />

            <button
              onClick={handleCheckout}
              style={{
                ...styles.payBtn,
                background: isFormValid() ? "#880e4f" : "#ccc",
                cursor: isFormValid() ? "pointer" : "not-allowed"
              }}
              disabled={!isFormValid()}
            >
              💳 Payer
            </button>

          </div>
        </div>
      )}
    </div>
  );


}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },

  heading: {
    marginBottom: "2rem",
    color: "#880e4f",
    fontSize: "2rem",
    textAlign: "center",
  },

  empty: {
    textAlign: "center",
    color: "#666",
    fontSize: "1.1rem",
  },

  columns: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
  },

  leftColumn: {
    flex: "1 1 48%",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  rightColumn: {
    flex: "1 1 48%",
    backgroundColor: "#fff0f5",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
  },

  cartList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fce4ec",
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    flexWrap: "wrap",
  },

  removeBtn: {
    background: "transparent",
    border: "none",
    color: "red",
    fontSize: "1.2rem",
    cursor: "pointer",
  },

  total: {
    textAlign: "right",
    fontSize: "1.2rem",
    marginTop: "1rem",
  },

  continueBtn: {
    padding: "1rem 2rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1.1rem",
    background: "#f8bbd0",
    color: "#333",
    width: "100%",
    marginTop: "1rem",
  },

  deliveryTitle: {
    marginBottom: "1rem",
    fontSize: "1.3rem",
    color: "#880e4f",
    textAlign: "center",
  },

  label: {
    fontWeight: "bold",
    marginBottom: "0.25rem",
    display: "block",
    fontSize: "0.95rem",
    color: "#333",
  },

  input: {
    display: "block",
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "1rem",
    fontSize: "1rem",
    boxSizing: "border-box",
  },

  payBtn: {
    marginTop: "1rem",
    padding: "1rem 2rem",
    background: "#880e4f",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1.1rem",
    width: "100%",
  },
};



export default CartPage;

