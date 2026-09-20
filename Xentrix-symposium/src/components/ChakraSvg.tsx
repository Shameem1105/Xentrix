import React from 'react';

// Saved Rotating Chakra SVG Component for future usage
export const RotatingChakraSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg className="w-full h-full relative z-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Large Outer Gear / Chakra */}
        <g className="animate-gear origin-center">
          <circle cx="200" cy="200" r="160" stroke="#6D071A" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="140" stroke="#C89B3C" strokeWidth="1.5" />
          <path d="M200 40 L200 360 M40 200 L360 200" stroke="#ECECEC" strokeWidth="1" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="200"
              y1="45"
              x2="200"
              y2="35"
              stroke="#6D071A"
              strokeWidth="4"
              transform={`rotate(${deg} 200 200)`}
            />
          ))}
        </g>

        {/* Inner Counter-Rotating Gear / Chakra */}
        <g className="animate-gear-reverse origin-center">
          <circle cx="200" cy="200" r="95" stroke="#C89B3C" strokeWidth="3" />
          <circle cx="200" cy="200" r="80" stroke="#6D071A" strokeWidth="1.5" strokeDasharray="4 4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <circle
              key={deg}
              cx="200"
              cy="120"
              r="4"
              fill="#C89B3C"
              transform={`rotate(${deg} 200 200)`}
            />
          ))}
        </g>

        {/* Circuit Board Trace Pathways */}
        <path d="M70 200 H120 L150 230 V280" stroke="#6D071A" strokeWidth="2" strokeLinecap="round" />
        <path d="M330 200 H280 L250 170 V120" stroke="#C89B3C" strokeWidth="2" strokeLinecap="round" />
        <circle cx="70" cy="200" r="4" fill="#6D071A" />
        <circle cx="150" cy="280" r="4" fill="#6D071A" />

        {/* Center Core Emblem */}
        <circle cx="200" cy="200" r="45" fill="#6D071A" />
        <circle cx="200" cy="200" r="38" stroke="#C89B3C" strokeWidth="2" fill="none" />
        <text x="200" y="206" textAnchor="middle" fill="#C89B3C" fontSize="18" fontFamily="Space Grotesk" fontWeight="bold">
          Z26
        </text>
      </svg>
    </div>
  );
};
