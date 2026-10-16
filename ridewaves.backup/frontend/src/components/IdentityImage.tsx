import React, { useState } from 'react';

/** Preserve remote avatars/logos, with an accessible fallback if the host is unavailable. */
export const IdentityImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (failedSource === src) {
    return <span role="img" aria-label={alt} className={`inline-flex shrink-0 items-center justify-center bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-200 font-semibold ${className}`}>{alt.split(' ').filter(Boolean).slice(0, 2).map(word => word[0]).join('')}</span>;
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailedSource(src)} />;
};
