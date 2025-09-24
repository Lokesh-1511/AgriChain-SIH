import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Page imports
import LandingPage from './pages/LandingPage';
import FarmerRegister from './pages/FarmerRegister';
import FarmerLogin from './pages/FarmerLogin';
import FarmerVerification from './pages/FarmerVerification';
import FarmerDashboard from './pages/FarmerDashboard';
import ConsumerRegister from './pages/ConsumerRegister';
import ConsumerLogin from './pages/ConsumerLogin';
import ConsumerDashboard from './pages/ConsumerDashboard';
import VerifyAadhaar from './pages/VerifyAadhaar';
import VerificationComplete from './pages/VerificationComplete';
import TracePage from './pages/TracePage';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: '1' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/farmer/register" element={<FarmerRegister />} />
              <Route path="/farmer/login" element={<FarmerLogin />} />
              <Route path="/farmer/verification" element={<FarmerVerification />} />
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer/verify" element={<VerifyAadhaar />} />
              <Route path="/consumer/register" element={<ConsumerRegister />} />
              <Route path="/consumer/login" element={<ConsumerLogin />} />
              <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
              <Route path="/consumer/verify" element={<VerifyAadhaar />} />
              <Route path="/verification-complete" element={<VerificationComplete />} />
              <Route path="/trace/:productId" element={<TracePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
