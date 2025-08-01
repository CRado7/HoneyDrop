import React, { useState } from 'react';
import Hero from './components/Hero';
import Nav from './components/Nav';
import Features from './components/Features';
// import AuthPanel from './components/AuthPanel';
import NotifyForm from './components/NotifyForm';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

export default function LandingPage() {
    const [showAuth, setShowAuth] = useState(false);
  return (
    <div className="relative bg-cream text-bee font-sans min-h-screen">
      <Nav onLoginClick={() => setShowAuth(true)} />
      <Hero />
      <Features />
      <AuthModal show={showAuth} onHide={() => setShowAuth(false)} />
      <NotifyForm />
      <Footer />
    </div>
  );
}

