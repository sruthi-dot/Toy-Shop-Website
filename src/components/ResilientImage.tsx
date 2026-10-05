import React, { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackType?: 'train' | 'blocks' | 'fox' | 'orrery' | 'loom' | 'glider' | 'hero';
  title?: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackType = 'blocks',
  title,
  className = 'w-full h-full object-cover',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F1F3EF] text-slate-700 p-6 select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-16 h-16 text-slate-400 mb-3 stroke-[1.25]"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
        >
          {fallbackType === 'train' && (
            <>
              <rect x="8" y="26" width="30" height="18" rx="2" />
              <rect x="26" y="16" width="12" height="10" rx="1" />
              <path d="M14 26V18h6v8" />
              <circle cx="16" cy="46" r="5" />
              <circle cx="30" cy="46" r="5" />
              <rect x="42" y="30" width="14" height="14" rx="2" />
              <circle cx="49" cy="46" r="5" />
              <line x1="38" y1="38" x2="42" y2="38" />
            </>
          )}
          {fallbackType === 'blocks' && (
            <>
              <path d="M12 48 A20 20 0 0 1 52 48 Z" />
              <path d="M20 48 A12 12 0 0 1 44 48" />
              <circle cx="32" cy="20" r="5" />
            </>
          )}
          {fallbackType === 'fox' && (
            <>
              <path d="M16 20 L24 30 H40 L48 20 L46 44 L32 52 L18 44 Z" />
              <circle cx="26" cy="36" r="1.5" fill="currentColor" />
              <circle cx="38" cy="36" r="1.5" fill="currentColor" />
              <polygon points="30,43 34,43 32,46" fill="currentColor" />
            </>
          )}
          {fallbackType === 'orrery' && (
            <>
              <circle cx="32" cy="28" r="6" />
              <ellipse cx="32" cy="28" rx="22" ry="8" />
              <circle cx="54" cy="28" r="3" fill="currentColor" />
              <circle cx="15" cy="24" r="2.5" fill="currentColor" />
              <line x1="32" y1="34" x2="32" y2="52" />
              <line x1="20" y1="52" x2="44" y2="52" />
            </>
          )}
          {(fallbackType === 'loom' || fallbackType === 'glider' || fallbackType === 'hero') && (
            <>
              <rect x="14" y="12" width="36" height="40" rx="2" />
              <line x1="22" y1="12" x2="22" y2="52" />
              <line x1="32" y1="12" x2="32" y2="52" />
              <line x1="42" y1="12" x2="42" y2="52" />
              <path d="M14 26 Q32 20 50 26" />
              <path d="M14 38 Q32 44 50 38" />
            </>
          )}
        </svg>
        {title && (
          <span className="text-xs font-medium text-slate-600 text-center max-w-[20ch] truncate">
            {title}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
