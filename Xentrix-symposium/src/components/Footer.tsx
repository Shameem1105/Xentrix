import React from 'react';
import { Sparkles, ArrowUp, Instagram, Globe, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 border-t-4 border-gold-500 relative pt-14 pb-10 text-white shadow-2xl z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-maroon-800 pb-10">
          
          {/* Col 1: Prince Official Logo Banner */}
          <div className="md:col-span-5 space-y-4">
            <img
              src="/prince_banner.png"
              alt="Prince Shri Venkateshwara Padmavathy Engineering College"
              className="h-14 sm:h-16 object-contain"
            />

            <div>
              <div className="flex items-center gap-2 text-gold-400 text-xs font-space font-extrabold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>National Level Technical Symposium</span>
              </div>
              <h2 className="font-heading text-3xl font-black text-white pt-0.5">
                XenTriX <span className="text-gold-400 font-space">'26</span>
              </h2>
              <div className="font-space text-xs font-black text-gold-200 uppercase tracking-widest pt-1">
                ECE | EEE | MECH | CIVIL
              </div>
            </div>

            <p className="text-xs text-maroon-100 font-poppins leading-relaxed max-w-md">
              Prince Shri Venkateshwara Padmavathy Engineering College (Ponmar, Chennai - 600127). Autonomous Institution Accredited with NAAC A++ & NBA.
            </p>
          </div>

          {/* Col 2: Social Links (Instagram & Unstop) */}
          <div className="md:col-span-3 space-y-3 font-space">
            <div className="text-xs font-extrabold uppercase text-gold-400 tracking-wider border-b border-maroon-800 pb-2">
              Official Portals
            </div>

            <div className="space-y-2.5 text-xs font-bold">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-maroon-800 hover:bg-gold-600 hover:text-maroon-950 text-white transition-all border border-gold-400/40 shadow-md"
              >
                <Instagram className="w-4 h-4 text-pink-300 shrink-0" />
                <span>Instagram (@xentrix26)</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>
              <a
                href="https://unstop.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-maroon-800 hover:bg-gold-600 hover:text-maroon-950 text-white transition-all border border-gold-400/40 shadow-md"
              >
                <Globe className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Unstop Registration</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>
            </div>
          </div>

          {/* Col 3: Direct Contact Information */}
          <div className="md:col-span-4 space-y-3 font-space">
            <div className="text-xs font-extrabold uppercase text-gold-400 tracking-wider border-b border-maroon-800 pb-2">
              Event Organizers Contact
            </div>

            <div className="space-y-2.5 text-xs font-space text-maroon-100">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-maroon-800/60 border border-maroon-700">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-300 uppercase font-bold">Dr. K K Senthil Kumar (Convener)</div>
                  <a href="tel:9789832134" className="font-bold text-gold-300 hover:underline">
                    +91 97898 32134
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-maroon-800/60 border border-maroon-700">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-300 uppercase font-bold">Ms. Shalini M (Co-ordinator)</div>
                  <a href="tel:7358148482" className="font-bold text-gold-300 hover:underline">
                    +91 73581 48482
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-poppins text-maroon-200">
          <div>
            <a
              href="/admin.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gold-400 transition-colors cursor-pointer font-bold"
              title="Admin Portal Access"
            >
              © 2026 XenTriX '26.
            </a>{' '}
            Official National Level Technical Symposium — PSVPEC Chennai.
          </div>

          <button
            onClick={scrollToTop}
            className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-maroon-950 font-space font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 cursor-pointer border border-gold-300 hover:scale-105"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-4 h-4 text-maroon-950" />
          </button>
        </div>

      </div>
    </footer>
  );
};
