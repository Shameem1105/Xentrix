import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Maximize2 } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);

  const galleryItems = [
    { id: '1', title: 'Robo Race Arena 2025', category: 'Tech', bg: 'from-maroon-900 to-maroon-700', aspect: 'h-64' },
    { id: '2', title: 'Paper Presentation Keynote', category: 'Keynote', bg: 'from-amber-900 to-maroon-800', aspect: 'h-80' },
    { id: '3', title: 'Valorant Esports Showdown', category: 'Non-Tech', bg: 'from-slate-900 to-maroon-900', aspect: 'h-56' },
    { id: '4', title: 'Mega Project Hardware Stalls', category: 'Tech', bg: 'from-maroon-800 to-amber-900', aspect: 'h-72' },
    { id: '5', title: '4-Hour Hackathon Coding Sprint', category: 'Tech', bg: 'from-neutral-900 to-maroon-900', aspect: 'h-60' },
    { id: '6', title: 'IPL Auction Strategy Bidding', category: 'Non-Tech', bg: 'from-maroon-950 to-gold-700', aspect: 'h-76' },
  ];

  return (
    <section id="gallery" className="py-24 bg-gray-50 border-t border-bordergray relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-maroon-50 border border-maroon-700/20 text-maroon-700 text-xs font-semibold uppercase tracking-widest">
            <ImageIcon className="w-3.5 h-3.5 text-gold-600" />
            <span>Visual Archive</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-richblack">
            Symposium Memories & Moments
          </h2>
        </div>

        {/* Masonry Layout Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setActiveLightbox(item.title)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${item.bg} p-6 flex flex-col justify-end text-white border border-bordergray shadow-lg hover:shadow-2xl transition-all duration-500 ${item.aspect}`}
            >
              <div className="absolute inset-0 blueprint-grid-bg opacity-20 group-hover:scale-110 transition-transform duration-700" />

              <div className="relative z-10">
                <span className="text-[10px] font-space font-bold uppercase tracking-widest text-gold-400 px-2.5 py-1 rounded bg-black/40 border border-gold-500/30 inline-block mb-2">
                  {item.category}
                </span>
                <h3 className="font-heading text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                  {item.title}
                </h3>
              </div>

              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-gold-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Popup */}
      <AnimatePresence>
        {activeLightbox && (
          <div className="fixed inset-0 z-[9990] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-3xl p-8 max-w-xl w-full border border-gold-500/40 text-center"
            >
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-richblack"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-maroon-900 to-richblack flex items-center justify-center text-gold-400 mb-4 border border-gold-500/30">
                <ImageIcon className="w-16 h-16 opacity-60" />
              </div>

              <h3 className="font-heading text-xl font-bold text-richblack">{activeLightbox}</h3>
              <p className="text-xs text-gray-500 mt-1 font-space">High-Resolution Event Frame Preview</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
