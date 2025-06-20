import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [order, setOrder] = useState(null);
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/order/by-session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            throw new Error(data.error);
          }
          setOrder(data);
        })
        .catch(err => {
          console.error(err);
          alert("❌ Erreur lors de la récupération de la commande");
        });
    }
  }, [sessionId]);

  if (!order) return <p>Chargement de la commande...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>✅ Paiement réussi !</h1>
      <p>Commande n° {order.id} — Total : {order.total} €</p>
      <ul>
        {order.items.map((item, idx) => (
          <li key={idx}>{item.quantity} x {item.product} — {item.price} €</li>
        ))}
      </ul>
    </div>
  );
}

