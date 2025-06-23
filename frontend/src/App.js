import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import MyOrders from './pages/MyOrders';
import TermsAndConditions from './pages/ConditionsLegales';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, rgb(255, 210, 225), rgb(0, 0, 0))',

          }}
        >
          <Router>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/conditions" element={<TermsAndConditions/>}/>
              <Route path="/confidentiality" element={<PrivacyPolicy/>}/>
              <Route path="/contact" element={<Contact/>}/>
            </Routes>
            <Footer />
          </Router>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

