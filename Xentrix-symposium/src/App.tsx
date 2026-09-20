import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { EventCatalog } from './components/EventCatalog';
import { FoodCourt } from './components/FoodCourt';
import { RegistrationPage } from './components/RegistrationPage';
import { AdminPortal } from './components/AdminPortal';
import { DigitalPassModal } from './components/DigitalPassModal';
import { Coordinators } from './components/Coordinators';
import { Footer } from './components/Footer';
import { SmoothScrollProvider } from './components/SmoothScrollProvider';
import { SymposiumEvent, RegistrationResult } from './types';

export default function App() {
  const [cart, setCart] = useState<SymposiumEvent[]>([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);

  const handleAddToCart = (event: SymposiumEvent) => {
    if (!cart.some((e) => e.id === event.id)) {
      setCart([...cart, event]);
    }
  };

  const handleRemoveFromCart = (eventId: string) => {
    setCart(cart.filter((e) => e.id !== eventId));
  };

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-white text-richblack font-poppins selection:bg-maroon-700 selection:text-gold-200 relative">
        
        {/* Static blueprint subtle grid */}
        <div className="fixed inset-0 pointer-events-none blueprint-grid-bg z-0" />

        <div className="relative z-10">
          
          {/* Navigation Bar */}
          <Navbar
            cart={cart}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          <main>
            {/* 1. Hero Landing Section */}
            <Hero
              cartCount={cart.length}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />

            {/* 2. About Section */}
            <About />

            {/* 3. Technical & Non-Technical Events (Numbered boxes + Guideline popups) */}
            <EventCatalog
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onProceedToRegister={() => setIsRegisterOpen(true)}
            />

            {/* 4. Food Stalls Section (without lunch timing) */}
            <FoodCourt />

            {/* 5. Coordinators Section (Staff & Student Coordinators) */}
            <Coordinators />
          </main>

          {/* 6. Footer */}
          <Footer />

          {/* Dedicated Registration Application */}
          <RegistrationPage
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            cart={cart}
            onSuccess={(result) => setRegistrationResult(result)}
          />

          {/* Admin Security Portal */}
          <AdminPortal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />

          {/* Digital Pass Portal */}
          {registrationResult && (
            <DigitalPassModal
              result={registrationResult}
              onClose={() => setRegistrationResult(null)}
            />
          )}

        </div>

      </div>
    </SmoothScrollProvider>
  );
}
