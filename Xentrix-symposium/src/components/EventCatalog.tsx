import React, { useState, useEffect } from 'react';
import { SymposiumEvent } from '../types';
import { TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS } from '../data/eventsData';
import { X, Sparkles, ShoppingCart, Check, ArrowRight } from 'lucide-react';
import { soundFx } from '../utils/audioUtils';

interface EventCatalogProps {
  cart: SymposiumEvent[];
  onAddToCart: (event: SymposiumEvent) => void;
  onRemoveFromCart: (eventId: string) => void;
  onProceedToRegister: () => void;
}

export const EventCatalog: React.FC<EventCatalogProps> = ({
  cart,
  onAddToCart,
  onRemoveFromCart,
  onProceedToRegister
}) => {
  const [selectedEventForGuideline, setSelectedEventForGuideline] = useState<SymposiumEvent | null>(null);

  // Lock background body scroll when Guideline modal is open
  useEffect(() => {
    if (selectedEventForGuideline) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEventForGuideline]);

  const openGuidelineModal = (event: SymposiumEvent) => {
    soundFx.playPop();
    setSelectedEventForGuideline(event);
  };

  const closeGuidelineModal = () => {
    soundFx.playPop();
    setSelectedEventForGuideline(null);
  };

  // Dedicated Map for the 4 provided guideline PNG images in public/images/
  const getGuidelineImage = (eventId: string) => {
    if (eventId === 'paper-pres') return '/images/Paper Presentation.png';
    if (eventId === 'hackathon') return '/images/Hackathon.png';
    if (eventId === 'prompt-eng') return '/images/Prompt challenge.png';
    if (eventId === 'tech-quiz') return '/images/Tech Quest.png';
    return null;
  };

  const isInCart = (eventId: string) => cart.some((e) => e.id === eventId);

  const toggleCart = (event: SymposiumEvent) => {
    if (isInCart(event.id)) {
      onRemoveFromCart(event.id);
    } else {
      onAddToCart(event);
    }
  };

  const renderEventBox = (event: SymposiumEvent, index: number) => {
    const selected = isInCart(event.id);

    return (
      <div
        key={event.id}
        className={`p-6 rounded-2xl bg-white border-2 shadow-md transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between items-center text-center space-y-4 group ${
          selected ? 'border-maroon-700 ring-2 ring-maroon-700/30 bg-maroon-50/40' : 'border-maroon-100 hover:border-gold-500 hover:shadow-xl'
        }`}
      >
        {/* Event Title Numbered (1. Event Name) */}
        <h3 className="font-outfit font-black text-lg sm:text-xl text-richblack tracking-wide leading-tight group-hover:text-maroon-700 transition-colors">
          {index + 1}. {event.name}
        </h3>

        {/* Sparkling Guideline Button */}
        <button
          onClick={() => openGuidelineModal(event)}
          className="sparkling-btn px-7 py-2.5 rounded-full text-white font-outfit font-black text-xs uppercase tracking-wider transition-all cursor-pointer border border-gold-400/50 hover:scale-105 shadow-md"
        >
          Guideline
        </button>
      </div>
    );
  };

  return (
    <section id="events" className="py-20 bg-transparent text-richblack relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ================= TECHNICAL EVENTS SECTION ================= */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-maroon-50 border border-maroon-200 text-maroon-800 text-xs font-outfit font-extrabold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Engineering & Innovation</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-maroon-900 tracking-tight">
              Technical Events
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-maroon-700 to-gold-500 mx-auto rounded-full" />
          </div>

          {/* 3 Columns Grid of Event Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TECHNICAL_EVENTS.map((event, index) => renderEventBox(event, index))}
          </div>
        </div>

        {/* ================= NON-TECHNICAL EVENTS SECTION ================= */}
        <div className="space-y-8 pt-8 border-t border-maroon-100">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-50 border border-gold-300 text-maroon-800 text-xs font-outfit font-extrabold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Esports, Creative & Fun</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-maroon-900 tracking-tight">
              Non-Technical Events
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold-500 to-maroon-700 mx-auto rounded-full" />
          </div>

          {/* 3 Columns Grid of Event Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {NON_TECHNICAL_EVENTS.map((event, index) => renderEventBox(event, index))}
          </div>
        </div>

      </div>

      {/* ================= GUIDELINE POPUP MODAL ================= */}
      {selectedEventForGuideline && (
        <div className="fixed inset-0 z-[9999] pt-20 sm:pt-24 pb-6 px-4 flex items-center justify-center bg-black/75 backdrop-blur-md animate-fadeIn">
          
          <div className="relative w-full max-w-2xl bg-white border-2 border-maroon-700 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center text-center space-y-4 my-auto max-h-[85vh]">
            
            {/* Top Right Close Button */}
            <button
              onClick={closeGuidelineModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 rounded-full bg-maroon-700 hover:bg-maroon-900 text-white transition-all shadow-xl cursor-pointer border border-gold-400 hover:scale-110 z-30"
              title="Close Guideline"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* 1. PHOTO (Dedicated Internal Scroll Container) */}
            <div
              className="w-full max-h-[65vh] sm:max-h-[70vh] overflow-y-auto overscroll-contain rounded-2xl flex flex-col items-center justify-start p-1 cursor-grab active:cursor-grabbing"
              onWheel={(e) => e.stopPropagation()}
            >
              {getGuidelineImage(selectedEventForGuideline.id) ? (
                <img
                  src={getGuidelineImage(selectedEventForGuideline.id)!}
                  alt={`${selectedEventForGuideline.name} Guideline Poster`}
                  className="w-full h-auto object-contain rounded-2xl shadow-xl"
                />
              ) : (
                <div className="p-12 space-y-3 text-center bg-maroon-50 w-full rounded-2xl border border-maroon-200">
                  <div className="w-14 h-14 rounded-full bg-maroon-100 text-maroon-800 flex items-center justify-center mx-auto">
                    <Sparkles className="w-7 h-7 text-gold-500" />
                  </div>
                  <h4 className="font-heading text-xl font-bold text-maroon-900">{selectedEventForGuideline.name}</h4>
                  <p className="text-xs font-outfit text-gray-600 max-w-sm mx-auto leading-relaxed">
                    Official poster image coming soon! All event guidelines and details will be displayed here.
                  </p>
                </div>
              )}
            </div>

            {/* 2. ADD TO CART BUTTON */}
            <div className="w-full pt-1 flex items-center justify-center">
              <button
                onClick={() => toggleCart(selectedEventForGuideline)}
                className={`w-full sm:w-auto px-10 py-3.5 rounded-full font-outfit font-black text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer border hover:scale-105 ${
                  isInCart(selectedEventForGuideline.id)
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-400'
                    : 'bg-gradient-to-r from-maroon-700 via-maroon-800 to-maroon-900 hover:from-maroon-800 hover:to-maroon-950 text-white border-gold-400'
                }`}
              >
                {isInCart(selectedEventForGuideline.id) ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-gold-300" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= FLOATING BOTTOM STICKY CART POPUP BAR ================= */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] w-[92%] max-w-xl bg-maroon-950/95 border-2 border-gold-400 rounded-full px-5 py-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center justify-between gap-4 text-white animate-bounce-short">
          
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 flex items-center justify-center font-outfit font-black text-sm text-maroon-950 shadow-md shrink-0">
              {cart.length}
            </div>
            <div className="text-left font-outfit min-w-0">
              <div className="text-xs font-black text-white uppercase tracking-wider">
                {cart.length} {cart.length === 1 ? 'Event' : 'Events'} Selected
              </div>
              <div className="text-[11px] text-gold-200 truncate max-w-[170px] sm:max-w-[260px]">
                {cart.map((e) => e.name).join(', ')}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playPop();
              onProceedToRegister();
            }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-maroon-950 font-outfit font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer shrink-0 border border-gold-300 hover:scale-105"
          >
            <span>Continue to Register</span>
            <ArrowRight className="w-4 h-4 text-maroon-950" />
          </button>
        </div>
      )}

    </section>
  );
};
