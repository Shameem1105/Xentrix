import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, GraduationCap, ShieldCheck, Sparkles, Flame, Coffee, Gamepad2 } from 'lucide-react';

export const WhyParticipate: React.FC = () => {
  const reasons = [
    {
      title: '100% OD (On-Duty) Pass',
      description: 'Official 1-day leave signed with pride. Swap 7 periods of lectures for gaming, coding & food!',
      icon: ShieldCheck,
      badge: 'Official Leave 📜'
    },
    {
      title: 'Cash > Canteen Bills',
      description: 'Win cash prizes from ₹50,000+ pool and clear all your pending canteen and tea debts.',
      icon: Trophy,
      badge: 'Money Moves 💰'
    },
    {
      title: 'Free Food Court Coupons',
      description: 'Hostel mess food exemption day! Enjoy delicious pizza, samosas, filter coffee & fresh juices.',
      icon: Coffee,
      badge: 'Delicious Eats 🍕'
    },
    {
      title: 'Esports & Gaming Battle',
      description: 'BGMI & Free Fire squad tournaments on custom lobbies with live screen broadcasting.',
      icon: Gamepad2,
      badge: 'Clutch Arena 🎮'
    },
    {
      title: 'Zero CGPA Discrimination',
      description: 'Whether you have a 9.5 CGPA or single-digit backlogs, everyone is welcomed equally!',
      icon: GraduationCap,
      badge: 'Backbenchers United 🗿'
    },
    {
      title: 'Anna University Certificates',
      description: 'Official accredited participation & winning certificates to boost your resume and LinkedIn.',
      icon: Award,
      badge: 'Resume Flex 🎓'
    },
    {
      title: 'Insta Aesthetic & Reels',
      description: 'Capture aesthetic campus reels, tag official handles, and make your school friends jealous.',
      icon: Sparkles,
      badge: 'Viral Status 📸'
    },
    {
      title: 'Robot Fights & Obstacles',
      description: 'Watch wired & wireless bots smash through mud tracks and ramps in the Amphitheatre.',
      icon: Flame,
      badge: 'Robo Action 🏎️'
    },
  ];

  return (
    <section className="py-20 bg-transparent text-richblack relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-space uppercase tracking-[0.3em] text-maroon-700 font-extrabold">
            Student Survival Guide
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-maroon-900">
            Why You <span className="text-gold-600">CANNOT Miss</span> XenTriX '26
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto font-poppins">
            Designed to give you the most unforgettable college day of the year. Here is why you should join us:
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-maroon-700 to-gold-500 mx-auto rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group p-6 rounded-3xl bg-white border border-maroon-100 hover:border-gold-500 hover:scale-105 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-maroon-700 text-gold-300 border border-gold-400/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-space font-bold uppercase px-2.5 py-1 rounded-full bg-gold-100 text-maroon-900 border border-gold-300">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-maroon-950 mb-2 group-hover:text-maroon-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-poppins">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-maroon-50 text-[11px] font-space text-gold-600 font-semibold">
                  REASON #{index + 1}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
