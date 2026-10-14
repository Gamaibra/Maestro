import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  interactive?: boolean;
  customLogoUrl?: string | null;
}

export const ClocheLineIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10 text-white' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Cloche knob */}
    <circle cx="32" cy="19" r="3.2" strokeWidth="2.8" />
    <path d="M32 22.2V25" strokeWidth="2.8" />
    {/* Cloche dome */}
    <path
      d="M14 42C14 29 22 25 32 25C42 25 50 29 50 42"
      strokeWidth="2.8"
    />
    {/* Cloche rim */}
    <rect x="11" y="42" width="42" height="4.5" rx="2.25" strokeWidth="2.8" />
    {/* Dish plate platter */}
    <path d="M8 48.5C18 51.5 46 51.5 56 48.5" strokeWidth="2.8" />
  </svg>
);

export const MenuBookIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-white' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="16" y="8" width="32" height="48" rx="3" strokeWidth="2.8" />
    <path d="M26 20L38 32M38 20L26 32" strokeWidth="2.4" />
    <line x1="24" y1="40" x2="40" y2="40" strokeWidth="2.4" />
    <line x1="24" y1="46" x2="36" y2="46" strokeWidth="2.4" />
  </svg>
);

/**
 * Full Brand Logo as specified from the provided artwork:
 * Rounded square (28px) with gold border, deep burgundy background,
 * cloche & menu emblem, "CHEZ LE" in white Baloo 2, "Maestro" in Yellowtail cursive.
 */
export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', customLogoUrl }) => {
  const sizeClasses = {
    sm: 'w-24 h-24 p-3',
    md: 'w-44 h-44 sm:w-48 sm:h-48 p-4',
    lg: 'w-56 h-56 sm:w-64 sm:h-64 p-5',
  }[size];

  if (customLogoUrl) {
    return (
      <div
        className={`relative rounded-[28px] border border-[#F2C21B]/40 shadow-2xl flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#560D17] via-[#3B0710] to-[#250409] ${sizeClasses} ${className}`}
        style={{
          boxShadow: '0 12px 36px -6px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(242, 194, 27, 0.25)',
        }}
      >
        <img
          src={customLogoUrl}
          alt="Chez le Maestro – restaurant africain à Deira, Dubaï"
          className="w-full h-full object-contain filter drop-shadow-md"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-[28px] border border-[#F2C21B]/40 shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-b from-[#560D17] via-[#3B0710] to-[#250409] ${sizeClasses} ${className}`}
      style={{
        boxShadow: '0 12px 36px -6px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(242, 194, 27, 0.25)',
      }}
    >
      {/* Subtle marble veins inside logo box */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
        }}
      />

      {/* Emblem: Menu Book + Cloche Dish Cover */}
      <div className="relative z-10 flex flex-col items-center justify-center -mt-1">
        <svg
          viewBox="0 0 120 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-24 h-16 sm:w-28 sm:h-18 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          {/* Menu Book behind cloche */}
          <g stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            {/* Book frame angled open */}
            <path d="M48 8 L78 6 L78 52 L48 54 Z" fill="none" opacity="0.95" />
            {/* Crossed fork and knife inside menu */}
            {/* Knife */}
            <path d="M57 16 L69 28" />
            <path d="M69 16 C69 20 66 22 64 24" />
            {/* Fork */}
            <path d="M69 16 L57 28" />
            <path d="M57 16 L60 19" />
            {/* Menu text lines */}
            <line x1="56" y1="36" x2="72" y2="36" strokeWidth="2.6" />
            <line x1="56" y1="42" x2="72" y2="42" strokeWidth="2.6" />
            <line x1="56" y1="48" x2="68" y2="48" strokeWidth="2.6" />
          </g>

          {/* Cloche in front */}
          <g stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Cloche knob */}
            <circle cx="34" cy="22" r="3.2" strokeWidth="2.8" fill="#3B0710" />
            {/* Cloche dome */}
            <path
              d="M16 46 C16 31 22 26 34 26 C46 26 52 31 52 46 Z"
              fill="#3B0710"
              strokeWidth="3.2"
            />
            {/* Dome rim */}
            <rect x="13" y="46" width="42" height="4" rx="2" strokeWidth="2.8" fill="#3B0710" />
          </g>
        </svg>

        {/* CHEZ LE in Baloo 2 uppercase white */}
        <div className="font-baloo font-extrabold text-white uppercase text-xl sm:text-2xl tracking-wider leading-none mt-1">
          CHEZ LE
        </div>

        {/* Maestro in Yellowtail cursive gold */}
        <div className="relative font-script text-[#F2C21B] text-3xl sm:text-4xl leading-tight -mt-1 drop-shadow-[0_2px_6px_rgba(242,194,27,0.35)]">
          Maestro
          {/* Golden brush underline swoop */}
          <svg
            viewBox="0 0 100 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-2.5 mt-[-2px] text-[#F2C21B]"
          >
            <path
              d="M10 2 C 35 10, 75 10, 95 2 C 80 8, 40 7, 10 2 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * Compact Wordmark for Header:
 * Text-only wordmark: "CHEZ LE" in white + "Maestro" in yellow cursive.
 */
export const Wordmark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-baseline gap-1 sm:gap-1.5 select-none shrink-0 ${className}`}>
    <span className="font-baloo font-extrabold text-white text-base sm:text-xl tracking-wider uppercase leading-none">
      CHEZ LE
    </span>
    <span className="font-script text-[#F2C21B] text-xl sm:text-3xl leading-none drop-shadow-[0_2px_6px_rgba(242,194,27,0.3)]">
      Maestro
    </span>
  </div>
);
