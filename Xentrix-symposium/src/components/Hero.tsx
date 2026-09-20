import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, MapPin, Zap } from 'lucide-react';
import { soundFx } from '../utils/audioUtils';

interface HeroProps {
  onOpenRegister: () => void;
  cartCount?: number;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegister }) => {
  return (
    <section id="home" className="relative min-h-[88vh] w-full flex flex-col justify-center items-center text-center overflow-hidden bg-transparent pt-28 pb-16 text-richblack z-10">
      
      {/* RIGHT FLOATING OFFER IMAGE BANNER (no container) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="hidden lg:block absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 z-20"
      >
        <img
          src="/images/offer.jpeg"
          alt="Special Offer"
          className="w-52 h-52 lg:w-64 lg:h-64 object-contain transition-all hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.triedFallback) {
              target.dataset.triedFallback = 'true';
              target.src = '/offer.jpeg';
            }
          }}
        />
      </motion.div>
      {/* HERO CONTENT CONTAINER */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center justify-center space-y-6">
        
        {/* 1. DEPARTMENT HEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2 text-center"
        >
          <p className="text-sm sm:text-base md:text-lg uppercase font-outfit font-extrabold text-maroon-700 tracking-[0.3em]">
            Departments of
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-outfit font-black text-maroon-800 tracking-widest">
            ECE | EEE | MECH | CIVIL
          </h2>
        </motion.div>

        {/* 2. SYMPOSIUM TITLE: XenTriX'26 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="space-y-3 max-w-3xl text-center"
        >
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black text-richblack tracking-tight leading-none">
            XenTriX<span className="text-gold-500 font-space">'26</span>
          </h1>

          {/* 3. LOGO SPACE CONTAINER (Loads /images/logo.png) */}
          <div className="pt-2 pb-1 flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="XenTriX'26 Logo"
              className="h-28 sm:h-36 md:h-44 object-contain transition-all"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = 'true';
                  target.src = '/logo.png';
                }
              }}
            />
          </div>
        </motion.div>

        {/* 4. ACTION BUTTONS: Register Now & Explore Events (Enlarged) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-5 pt-4 font-outfit"
        >
          {/* Register Now Button */}
          <button
            onClick={() => {
              soundFx.playSuccess();
              onOpenRegister();
            }}
            className="px-10 py-4.5 sm:px-12 sm:py-5 rounded-full bg-gradient-to-r from-maroon-700 via-maroon-800 to-maroon-900 hover:from-maroon-800 hover:to-maroon-950 text-white font-outfit font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-3 cursor-pointer border-2 border-gold-400 hover:scale-105"
          >
            <Play className="w-5 h-5 fill-gold-300 text-gold-300 shrink-0" />
            <span>Register Now</span>
          </button>

          {/* Explore Events Button */}
          <a
            href="#events"
            onClick={() => soundFx.playPop()}
            className="px-9 py-4.5 sm:px-11 sm:py-5 rounded-full bg-white hover:bg-maroon-50 text-maroon-800 font-outfit font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer border-2 border-maroon-700/40 shadow-sm hover:shadow-md hover:scale-105"
          >
            <Zap className="w-5 h-5 text-gold-500 shrink-0" />
            <span>Explore Events</span>
          </a>
        </motion.div>

        {/* 5. DATE & VENUE BADGES */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-outfit font-bold text-gray-700">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-maroon-100 shadow-sm">
            <Calendar className="w-4 h-4 text-gold-500" />
            <span>SEP 26 2026 (Saturday)</span>
          </div>

          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-maroon-100 shadow-sm">
            <MapPin className="w-4 h-4 text-maroon-700" />
            <span>PSVPEC Campus, Chennai</span>
          </div>
        </div>

      </div>

    </section>
  );
};
