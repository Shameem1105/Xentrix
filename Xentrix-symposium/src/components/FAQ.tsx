import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, HelpCircle } from 'lucide-react';
import { soundFx } from '../utils/audioUtils';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Will I actually get OD (On-Duty) attendance credit?',
      a: 'YES! 100% official OD permission pass provided with verified QR code. Generate your pass, show it to your class advisor, and enjoy full-day attendance credit!'
    },
    {
      q: 'Can I participate if I have 5 backlogs and 60% attendance?',
      a: 'Absolutely! XenTriX \'26 measures your enthusiasm and vibe, not your arrears. Backbenchers are most welcome to compete for glory and cash!'
    },
    {
      q: 'What if my code crashes during the 4-Hour Hackathon?',
      a: 'Just tell the judges "It worked fine on my local machine" or blame the college Wi-Fi. Classic engineer move! (Or quickly ask ChatGPT for a fix).'
    },
    {
      q: 'Is carrying the original College ID card mandatory?',
      a: 'YES, strictly mandatory! Entry into the campus and venue halls requires your original college identity card matching the name on your digital pass.'
    },
    {
      q: 'Is lunch and refreshment included in the entry pass?',
      a: 'Yes! Every digital pass comes loaded with official Food Court coupons for 10+ campus stalls. No hostel mess food today!'
    },
    {
      q: 'Can I register for both Technical and Non-Technical events?',
      a: 'Yes! Code or present your paper in the morning session, then smash BGMI, Free Fire, or the IPL Auction in the afternoon.'
    },
    {
      q: 'How and when will prize money be handed out?',
      a: 'Prize money totaling ₹50,000+ will be distributed directly at the Grand Valedictory Ceremony inside the Main Auditorium at 04:30 PM!'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-[#FDFBF7] text-[#0F172A] border-t border-bordergray relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6D071A]/10 border border-[#6D071A]/30 text-[#6D071A] text-xs font-space font-extrabold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-[#0F172A]">
            Frequently Asked Questions
          </h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-3 font-space">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white hover:bg-amber-50/40 transition-colors rounded-2xl overflow-hidden border border-bordergray shadow-sm"
              >
                <button
                  onClick={() => {
                    soundFx.playPop();
                    setOpenIndex(isOpen ? null : index);
                  }}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-space text-base sm:text-lg font-bold text-[#0F172A]">
                    {faq.q}
                  </span>
                  <div className="text-[#6D071A] transition-transform duration-300">
                    {isOpen ? <X className="w-7 h-7 text-[#6D071A]" /> : <Plus className="w-7 h-7 text-[#6D071A]" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-amber-50/40 px-6 pb-6 pt-2 border-t border-bordergray/50"
                    >
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-poppins font-normal">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
