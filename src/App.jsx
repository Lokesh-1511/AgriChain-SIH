import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Page imports
import LandingPage from './pages/LandingPage';
import FarmerRegister from './pages/FarmerRegister';
import FarmerLogin from './pages/FarmerLogin';
import ForgotPassword from './pages/ForgotPassword';
import FarmerVerification from './pages/FarmerVerification';
import FarmerDashboard from './pages/FarmerDashboard';
import ConsumerRegister from './pages/ConsumerRegister';
import ConsumerLogin from './pages/ConsumerLogin';
import ConsumerForgotPassword from './pages/ConsumerForgotPassword';
import ConsumerDashboard from './pages/ConsumerDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import VerifyAadhaar from './pages/VerifyAadhaar';
import VerificationComplete from './pages/VerificationComplete';
import TracePage from './pages/TracePage';

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: '1' }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/farmer/register" element={<FarmerRegister />} />
                <Route path="/farmer/login" element={<FarmerLogin />} />
                <Route path="/farmer/forgot-password" element={<ForgotPassword />} />
                <Route path="/farmer/verification" element={<FarmerVerification />} />
                <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                <Route path="/farmer/verify" element={<VerifyAadhaar />} />
                <Route path="/consumer/register" element={<ConsumerRegister />} />
                <Route path="/consumer/login" element={<ConsumerLogin />} />
                <Route path="/consumer/forgot-password" element={<ConsumerForgotPassword />} />
                <Route path="/consumer" element={<ConsumerDashboard />} />
                <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                <Route path="/consumer/verify" element={<VerifyAadhaar />} />
                <Route path="/verification-complete" element={<VerificationComplete />} />
                <Route path="/trace/:productId" element={<TracePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
