import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#FAF9F6] border-y border-maroon-100/80 text-richblack relative z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
        
        {/* Heading: About */}
        <div className="space-y-3">
          <h2 className="font-heading text-4xl sm:text-6xl font-black text-maroon-900 tracking-tight">
            About
          </h2>
          <div className="w-20 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>

        {/* Narrative Text Wordings Alone (Pure Luxury Text) */}
        <div className="space-y-6 font-outfit text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto pt-2">
          <p>
            <strong className="text-maroon-900 font-extrabold text-lg sm:text-xl">XenTriX '26</strong> is the flagship National Level Technical Symposium organized by the combined engineering departments at <strong className="text-maroon-800">Prince Shri Venkateshwara Padmavathy Engineering College (PSVPEC)</strong>, Chennai.
          </p>

          <p>
            Bringing together students from top institutions across the nation, XenTriX '26 serves as a vibrant platform for showcasing technical innovation, creative engineering solutions, coding acumen, and competitive problem-solving.
          </p>

          <p>
            Featuring a comprehensive lineup of technical paper presentations, hackathons, robotics arenas, design challenges, and engaging non-technical events, XenTriX '26 offers an enriching experience designed to inspire leadership, foster collaboration, and recognize student talent.
          </p>
        </div>

      </div>
    </section>
  );
};
