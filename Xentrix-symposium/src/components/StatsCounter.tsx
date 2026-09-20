import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Code, Users, Building2, Utensils, Award } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const stats = [
    { label: 'Technical Events', count: '11+', icon: Code, detail: 'High-stakes tech battles' },
    { label: 'Non-Technical Events', count: '15+', icon: Trophy, detail: 'Esports & creative challenges' },
    { label: 'Total Prize Pool', count: '₹59,500', icon: Award, detail: 'Cash awards & trophies', highlight: true },
    { label: 'Food Stalls', count: '10', icon: Utensils, detail: 'Multi-cuisine food street' },
    { label: 'Expected Participants', count: '500+', icon: Users, detail: 'Engineers across South India' },
    { label: 'Participating Colleges', count: '50+', icon: Building2, detail: 'Inter-college networking' },
  ];

  return (
    <section className="py-20 bg-maroon-900 text-white relative overflow-hidden">
      {/* Blueprint Grain & Grid Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-maroon-800 via-maroon-900 to-black opacity-90" />
      <div className="absolute inset-0 blueprint-grid-bg opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-space uppercase tracking-[0.3em] text-gold-400 font-semibold">
            By The Numbers
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Symposium Metrics & Scale
          </h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  stat.highlight
                    ? 'bg-gradient-to-b from-maroon-800 to-maroon-900 border-gold-500/60 shadow-xl shadow-gold-500/10'
                    : 'bg-white/5 border-white/10 hover:border-gold-500/40 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-space tracking-widest text-gold-400 uppercase font-semibold">
                    METRIC #0{index + 1}
                  </span>
                </div>

                <div>
                  <div className="font-space text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
                    {stat.count}
                  </div>
                  <div className="font-heading text-base font-semibold text-gold-200 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-400 font-poppins">
                    {stat.detail}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
