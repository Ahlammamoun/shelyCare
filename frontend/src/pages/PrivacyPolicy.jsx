import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#880e4f' }}>Politique de Confidentialité</h1>
        <p><strong>Dernière mise à jour :</strong> 22 juin 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>La présente politique explique comment ShelyCare collecte, utilise et protège vos données personnelles lorsque vous utilisez notre site web.</p>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <p>Nous collectons uniquement les données strictement nécessaires :</p>
          <ul>
            <li>Informations de compte : nom, prénom, email, mot de passe (crypté)</li>
            <li>Informations de commande : adresse, téléphone, historique des achats</li>
            <li>Données techniques : adresse IP, type de navigateur, pages visitées</li>
          </ul>
        </section>

        <section>
          <h2>3. Finalités du traitement</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul>
            <li>Créer et gérer votre compte utilisateur</li>
            <li>Traiter vos commandes</li>
            <li>Répondre à vos demandes de contact</li>
            <li>Améliorer notre site et nos services</li>
            <li>Prévenir les fraudes ou abus</li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>Notre site utilise des cookies pour assurer son bon fonctionnement et améliorer votre expérience. Vous pouvez configurer vos préférences depuis votre navigateur à tout moment.</p>
        </section>

        <section>
          <h2>5. Sécurité des données</h2>
          <p>Vos données sont stockées de manière sécurisée. L'accès est strictement limité aux membres autorisés de notre équipe. Aucune donnée sensible (mot de passe en clair, carte bancaire) n’est conservée sur nos serveurs.</p>
        </section>

        <section>
          <h2>6. Partage des données</h2>
          <p>Nous ne vendons jamais vos données. Certaines informations peuvent être partagées uniquement avec :</p>
          <ul>
            <li>Nos prestataires de paiement (ex : Stripe)</li>
            <li>Nos transporteurs pour la livraison</li>
            <li>Nos services de sécurité ou autorités judiciaires en cas d'obligation légale</li>
          </ul>
        </section>

        <section>
          <h2>7. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d’accès à vos données</li>
            <li>Droit de rectification ou de suppression</li>
            <li>Droit d’opposition au traitement</li>
            <li>Droit à la portabilité</li>
          </ul>
          <p>Vous pouvez exercer vos droits en nous écrivant à : <strong>privacy@shelycare.com</strong></p>
        </section>

        <section>
          <h2>8. Conservation des données</h2>
          <p>Les données sont conservées pendant la durée nécessaire à la gestion de votre compte, puis archivées ou supprimées selon les obligations légales.</p>
        </section>

        <section>
          <h2>9. Modifications</h2>
          <p>Cette politique de confidentialité peut être mise à jour à tout moment. Les utilisateurs seront informés en cas de changement majeur.</p>
        </section>


      </div>
    </main>
  );
}
