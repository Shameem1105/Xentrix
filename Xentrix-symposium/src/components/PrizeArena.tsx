import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, ChevronRight } from 'lucide-react';
import { ALL_EVENTS } from '../data/eventsData';

interface PrizeArenaProps {
  onOpenRegister: () => void;
}

export const PrizeArena: React.FC<PrizeArenaProps> = ({ onOpenRegister }) => {
  const [filter, setFilter] = useState<'All' | 'Technical' | 'Non-Technical'>('All');

  const filteredEvents = ALL_EVENTS.filter(e => {
    if (filter === 'All') return true;
    return e.category === filter;
  });

  return (
    <section id="prize-pool" className="py-24 bg-[#FAF9F6]/60 backdrop-blur-sm border-t border-bordergray relative overflow-hidden">
      {/* Background blueprint elements */}
      <div className="absolute inset-0 blueprint-grid-bg opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Preview Card */}
        <div className="bg-gradient-to-r from-maroon-900/95 via-maroon-800/95 to-maroon-900/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-white border border-gold-500/40 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
            <Trophy className="w-96 h-96 text-gold-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 text-xs font-space font-semibold uppercase tracking-widest">
                <Trophy className="w-4 h-4 text-gold-400" />
                <span>Prize Arena & Rewards</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight">
                Grand Prize Pool: <span className="text-gold-400 font-space">₹59,500</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base max-w-2xl font-poppins">
                Every competition track offers transparent cash rewards for 1st, 2nd, and 3rd place winners, along with gold trophies, achievement medals, and official certificates.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <button
                onClick={onOpenRegister}
                className="px-8 py-4 rounded-full bg-gold-500 text-richblack font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-gold-500/20 flex items-center gap-2"
              >
                <span>Claim Your Spot</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h3 className="font-heading text-2xl font-bold text-richblack">Individual Prize Structure</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-space">Full Breakdown across all events</p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-xl bg-white/80 backdrop-blur-md border border-bordergray shadow-sm">
            {(['All', 'Technical', 'Non-Technical'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-space font-semibold transition-all ${
                  filter === cat
                    ? 'bg-maroon-700 text-gold-400 shadow-md'
                    : 'text-gray-600 hover:text-maroon-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prize Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-bordergray shadow-md hover:shadow-xl hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-space font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    event.category === 'Technical'
                      ? 'bg-maroon-50 text-maroon-700 border border-maroon-700/20'
                      : 'bg-gold-50 text-gold-700 border border-gold-500/30'
                  }`}>
                    {event.category}
                  </span>
                  
                  {event.prizePool > 0 && (
                    <span className="font-space font-bold text-sm text-gold-600">
                      Total: ₹{event.prizePool.toLocaleString()}
                    </span>
                  )}
                </div>

                <h4 className="font-heading text-base font-bold text-richblack mb-4">
                  {event.name}
                </h4>

                {event.prizePool > 0 ? (
                  <div className="grid grid-cols-3 gap-2 bg-gray-50/70 p-3 rounded-xl border border-bordergray text-center mb-4">
                    <div className="p-2 rounded-lg bg-white/90 shadow-xs border border-amber-200">
                      <div className="flex items-center justify-center text-amber-500 mb-1">
                        <Trophy className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[10px] uppercase font-space font-semibold text-gray-500">1st Prize</div>
                      <div className="font-space text-xs font-bold text-richblack">₹{event.prizes.first.toLocaleString()}</div>
                    </div>

                    <div className="p-2 rounded-lg bg-white/90 shadow-xs border border-slate-200">
                      <div className="flex items-center justify-center text-slate-400 mb-1">
                        <Medal className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[10px] uppercase font-space font-semibold text-gray-500">2nd Prize</div>
                      <div className="font-space text-xs font-bold text-richblack">₹{event.prizes.second.toLocaleString()}</div>
                    </div>

                    <div className="p-2 rounded-lg bg-white/90 shadow-xs border border-orange-200">
                      <div className="flex items-center justify-center text-amber-700 mb-1">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[10px] uppercase font-space font-semibold text-gray-500">3rd Prize</div>
                      <div className="font-space text-xs font-bold text-richblack">₹{event.prizes.third.toLocaleString()}</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gold-50/80 p-3 rounded-xl border border-gold-500/30 text-center mb-4">
                    <div className="text-xs font-space font-bold text-gold-700 uppercase tracking-wider">Certified Practical Workshop</div>
                    <div className="text-[11px] text-gray-600 font-poppins">Starter Kit & Completion Certificates Provided</div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-bordergray/60 flex items-center justify-between text-xs text-gray-500 font-poppins">
                <span>Fee: ₹{event.fee} ({event.feeType})</span>
                <span className="font-space font-semibold text-maroon-700">{event.teamSize}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
