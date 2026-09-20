import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, Menu, X } from 'lucide-react';
import { SymposiumEvent } from '../types';
import { soundFx } from '../utils/audioUtils';

interface NavbarProps {
  cart: SymposiumEvent[];
  onOpenRegister: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 backdrop-blur-md shadow-2xl py-3 border-b-2 border-gold-500 text-white'
          : 'bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 backdrop-blur-md shadow-xl py-3.5 border-b-2 border-gold-500 text-white'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Official College Brand */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <a
            href="#home"
            className="flex items-center group cursor-pointer"
            onClick={() => soundFx.playPop()}
          >
            {/* Prince College Logo Banner */}
            <img
              src="/prince_banner.png"
              alt="Prince Shri Venkateshwara Padmavathy Engineering College"
              className="h-11 sm:h-14 md:h-16 object-contain group-hover:scale-105 transition-transform origin-left brightness-105"
            />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center ml-8 lg:ml-12 gap-8 text-xs font-outfit font-extrabold tracking-widest text-gray-200 uppercase">
            <a
              href="#home"
              className="hover:text-gold-300 transition-colors py-1 text-gold-400 font-black"
            >
              <span>Home</span>
            </a>
            <a href="#events" className="hover:text-gold-300 transition-colors py-1">
              <span>Events Catalog</span>
            </a>
            <a href="#about" className="hover:text-gold-300 transition-colors py-1">
              <span>About</span>
            </a>
            <a href="#prizes" className="hover:text-gold-300 transition-colors py-1">
              <span>Prize Pool</span>
            </a>
            <a href="#food" className="hover:text-gold-300 transition-colors py-1">
              <span>Food Street</span>
            </a>
          </nav>
        </div>

        {/* Right Tools: Register CTA */}
        <div className="hidden md:flex items-center gap-4 font-outfit">
          <button
            onClick={() => {
              soundFx.playSuccess();
              onOpenRegister();
            }}
            className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-maroon-950 font-outfit font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer border border-gold-300 hover:scale-105"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4 text-maroon-950" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden shrink-0 p-2 rounded-xl bg-maroon-800 text-gold-400 border border-gold-400/40 hover:bg-maroon-700 cursor-pointer shadow-md"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-gold-300" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-maroon-950 to-maroon-900 border-b-2 border-gold-500 px-6 pt-4 pb-6 space-y-3 font-outfit text-xs font-bold uppercase tracking-wider text-white shadow-2xl">
          <a
            href="#home"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 text-gold-400 hover:text-gold-300 border-b border-maroon-800 font-outfit font-black"
          >
            Home
          </a>
          <a
            href="#events"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 text-gray-200 hover:text-gold-300 border-b border-maroon-800 font-outfit"
          >
            Events Catalog
          </a>
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 text-gray-200 hover:text-gold-300 border-b border-maroon-800 font-outfit"
          >
            About Symposium
          </a>
          <a
            href="#prizes"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 text-gray-200 hover:text-gold-300 border-b border-maroon-800 font-outfit"
          >
            Prize Pool ₹50,000+
          </a>
          <a
            href="#food"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 text-gray-200 hover:text-gold-300 border-b border-maroon-800 font-outfit"
          >
            Food Street
          </a>

          <div className="pt-3 flex flex-col gap-2.5 font-outfit">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-xl bg-maroon-800/80 border border-maroon-700 text-gold-300 font-outfit font-extrabold flex items-center justify-center gap-2 hover:bg-maroon-700"
            >
              <Shield className="w-4 h-4 text-gold-400" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-maroon-950 font-outfit font-black flex items-center justify-center gap-2 shadow-md border border-gold-300"
            >
              <span>Register & Get Pass</span>
              <ArrowRight className="w-4 h-4 text-maroon-950" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
