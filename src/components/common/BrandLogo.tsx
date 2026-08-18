import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  showSlogan = false,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 select-none" id="brand-logo-container">
      {/* Geometric MG Emblem with Bag Silhouette */}
      <div
        className={`${currentSize.icon} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0A192F] via-[#0D254C] to-[#0066FF] shadow-sm text-white font-black overflow-hidden shrink-0 border border-white/10`}
        id="brand-logo-emblem"
      >
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full p-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* M letter geometry */}
          <path
            d="M8 36V14L16 26L24 14V36"
            stroke="#00D2FF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* G letter with subtle shopping bag curve */}
          <path
            d="M38 18C36 14.5 31.5 13 27 15C22.5 17 21 22 21 27C21 32 24 35.5 29 35.5C34 35.5 38 32.5 38 28V24H30"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Tiny shopping bag handle accent on G */}
          <path
            d="M26 12C26 9.5 28 8 30 8C32 8 34 9.5 34 12"
            stroke="#00D2FF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {variant !== 'compact' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`${currentSize.text} font-black tracking-tight ${
                variant === 'white' ? 'text-white' : 'text-[#0A192F] dark:text-white'
              }`}
            >
              MG
            </span>
            <span
              className={`${currentSize.text} font-bold tracking-tight text-[#0066FF]`}
            >
              GESTION
            </span>
          </div>

          {showSlogan && (
            <span
              className={`${currentSize.sub} font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5`}
            >
              Vann · Achte · Jere
            </span>
          )}
        </div>
      )}
    </div>
  );
};
