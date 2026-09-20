import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Coffee, Pizza, IceCream, Apple, CupSoda, Flame } from 'lucide-react';

export const FoodCourt: React.FC = () => {
  const stalls = [
    { name: 'South Indian Feast', desc: 'Crispy Dosa, Hot Idli, Vada & Spicy Sambar', icon: Utensils, badge: '99% Dosa Accuracy 🥞' },
    { name: 'Artisan Pizza Corner', desc: 'Fresh Wood-Fired Cheese & Veggie Loaded Pizzas', icon: Pizza, badge: 'Extra Cheese 🧀' },
    { name: 'Gourmet Burger Hub', desc: 'Juicy Grilled Veggie & Paneer Burgers with Fries', icon: Flame, badge: 'High Calorie Power 🍔' },
    { name: 'Fresh Juice Bar', desc: 'Cold Pressed Fruit Juices, Smoothies & Shakes', icon: Apple, badge: 'Vitamin Boost 🍹' },
    { name: 'Kulhad Tea Lounge', desc: 'Hot Ginger & Masala Tea in Clay Kulhads', icon: Coffee, badge: "Engineers' Fuel ☕" },
    { name: 'Filter Coffee Express', desc: 'Strong Traditional South Indian Filter Coffee', icon: Coffee, badge: 'Brain Reboot ☕' },
    { name: 'Chinese Wok Alley', desc: 'Hakka Noodles, Schezwan Fried Rice & Hot Momos', icon: Utensils, badge: 'Spicy Fix 🥢' },
    { name: 'Ice Cream Parlour', desc: 'Sundaes, Belgian Chocolate Gelato & Cones', icon: IceCream, badge: 'Cool Vibes 🍦' },
    { name: 'Snack Shack', desc: 'Samosas, French Fries, Cutlets & Crispy Rolls', icon: Utensils, badge: 'Samosa Rush 🥟' },
    { name: 'Dessert Studio', desc: 'Sizzling Brownies, Waffles & Chocolate Pastries', icon: CupSoda, badge: 'Sugar Rush 🧇' },
  ];

  return (
    <section id="food" className="py-20 bg-transparent text-richblack relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-50 border border-gold-300 text-maroon-800 text-xs font-space font-extrabold uppercase tracking-widest shadow-sm">
            <Utensils className="w-3.5 h-3.5 text-gold-600" />
            <span>Food Street Arena</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-maroon-900">
            The Great Canteen Escape 🍕 Shawarma 🧋
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-poppins">
            Because real engineering requires calories, chai, samosas, and zero hostel mess food!
          </p>
        </div>

        {/* Stalls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stalls.map((stall, index) => {
            const IconComponent = stall.icon;
            return (
              <motion.div
                key={stall.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-white rounded-3xl p-5 border border-maroon-100 hover:border-gold-500 hover:scale-105 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-maroon-700 text-gold-200 flex items-center justify-center shadow-md">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-space font-extrabold uppercase text-maroon-800 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-300">
                      STALL #{index + 1}
                    </span>
                  </div>

                  <span className="text-[10px] font-space font-bold uppercase tracking-wider text-gold-600 block mb-1">
                    {stall.badge}
                  </span>

                  <h3 className="font-heading text-sm font-bold text-maroon-950 mb-1 group-hover:text-maroon-700 transition-colors">
                    {stall.name}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-poppins">
                    {stall.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-maroon-50 text-[10px] font-space text-gray-500 font-semibold">
                  Location: Campus Courtyard
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
