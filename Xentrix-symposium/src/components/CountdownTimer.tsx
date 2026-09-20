import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const targetDate = new Date('2026-09-26T09:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'UPCOMING'
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      const eventDuration = 10 * 60 * 60 * 1000;

      if (difference <= 0 && difference > -eventDuration) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'LIVE' });
      } else if (difference <= -eventDuration) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'ENDED' });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, status: 'UPCOMING' });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="py-16 bg-[#000000] border-y border-gray-800 relative overflow-hidden text-white shadow-2xl">
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#E50914]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10 space-y-8">
        
        {/* Doomsday Timer Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#E50914]/20 border border-[#E50914]/50 text-[#E50914] text-xs font-space font-extrabold uppercase tracking-widest shadow-xl">
          <Sparkles className="w-4 h-4 text-[#E50914]" />
          <span>XenTriX '26 COUNTDOWN TO PREMIERE</span>
        </div>

        {timeLeft.status === 'UPCOMING' && (
          <>
            <div>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-wide">
                September 26, 2026 • PSVPEC Campus 
              </h2>
            </div>

            {/* 4 CHAKRA DOOMSDAY TIMER UNITS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto pt-2">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative group bg-[#181818] rounded-md p-6 border border-gray-800 hover:border-[#E50914] hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center shadow-2xl overflow-hidden min-h-[150px]"
                >
                  {/* ROTATING CHAKRA WHEEL SVG BACKGROUND */}
                  <svg className="w-36 h-36 absolute inset-0 m-auto opacity-20 pointer-events-none" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g className="animate-gear origin-center">
                      <circle cx="200" cy="200" r="160" stroke="#E50914" strokeWidth="3" strokeDasharray="6 6" />
                      <circle cx="200" cy="200" r="140" stroke="#800000" strokeWidth="2" />
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                        <line
                          key={deg}
                          x1="200"
                          y1="45"
                          x2="200"
                          y2="35"
                          stroke="#E50914"
                          strokeWidth="5"
                          transform={`rotate(${deg} 200 200)`}
                        />
                      ))}
                    </g>
                  </svg>

                  {/* Centered Number & Label */}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <span className="font-space text-4xl sm:text-5xl font-black text-[#E50914] tracking-tight drop-shadow-lg">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-xs uppercase font-space font-extrabold tracking-widest text-gray-300 pt-1">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {timeLeft.status === 'LIVE' && (
          <div className="py-6 px-8 rounded-md bg-[#181818] border border-[#E50914] shadow-2xl inline-block">
            <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-widest text-white mb-2 animate-pulse">
              THE EVENT IS LIVE NOW!
            </h2>
            <p className="text-sm font-space text-gray-300">Welcome participants to XenTriX '26 campus arenas.</p>
          </div>
        )}

        {timeLeft.status === 'ENDED' && (
          <div className="py-6 px-8 rounded-md bg-[#181818] border border-[#E50914] shadow-2xl inline-block">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1">
              Thank You For Making XenTriX '26 Successful!
            </h2>
            <p className="text-sm text-gray-400">See you next year at ZENTRIX '27.</p>
          </div>
        )}

      </div>
    </section>
  );
};
