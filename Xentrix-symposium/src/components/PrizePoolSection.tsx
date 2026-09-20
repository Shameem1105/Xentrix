import React from 'react';
import { Trophy, Layers, Users, Utensils, Sparkles } from 'lucide-react';

export const PrizePoolSection: React.FC = () => {
  const stats = [
    {
      icon: Trophy,
      value: '₹50,000+',
      label: 'Grand Prize Pool',
      subtext: 'Cash prizes to sponsor canteen treats & pay debts'
    },
    {
      icon: Layers,
      value: '22+ Events',
      label: 'Tech, Gaming & Fun',
      subtext: 'Paper presentation, hackathons, BGMI & IPL auction'
    },
    {
      icon: Users,
      value: '500+ Expected',
      label: 'Students & Gangs',
      subtext: 'Compete against top engineering colleges in South India'
    },
    {
      icon: Utensils,
      value: '10+ Food Stalls',
      label: 'Courtyard Refreshments',
      subtext: 'Samosas, dosa, burgers & kulhad chai coupons included'
    }
  ];

  return (
    <section id="prizes" className="py-16 bg-[#FAF9F6] text-richblack relative overflow-hidden z-10 border-y border-maroon-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-gold-300 text-maroon-800 text-xs font-space font-extrabold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span>FEATURED PRIZE ARENA</span>
          </div>

          <h2 className="font-heading text-4xl sm:text-6xl font-black text-maroon-900">
            Grand Prize Pool <span className="text-gold-600 font-space">₹50,000+</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 font-poppins leading-relaxed max-w-2xl mx-auto">
            Compete across <strong className="text-maroon-900">22+ Technical, Gaming & Non-Tech Events</strong> for gold trophies, cash awards, and accredited certificates. <strong className="text-maroon-900">10+ multi-cuisine Food Stalls</strong> ready on campus!
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="p-6 rounded-3xl bg-white border border-maroon-100 hover:border-gold-500 hover:scale-105 transition-all duration-300 space-y-3 text-center shadow-md hover:shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-maroon-700 text-gold-300 border border-gold-400/40 mx-auto flex items-center justify-center shadow-md font-bold">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-heading text-3xl font-black text-maroon-900 leading-none">
                    {item.value}
                  </div>
                  <div className="font-space text-xs font-bold text-gold-600 uppercase tracking-wider pt-1">
                    {item.label}
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 font-poppins">{item.subtext}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
