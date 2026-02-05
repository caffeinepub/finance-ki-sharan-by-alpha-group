import { useState, useEffect } from 'react';
import { ASSET_PATHS, BRAND_NAME } from '@/utils/assetPaths';

interface BrandLogoProps {
  className?: string;
  showFallback?: boolean;
}

export default function BrandLogo({ className = 'h-10 w-auto', showFallback = true }: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset error state when logo path changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [ASSET_PATHS.logo]);

  const handleError = () => {
    console.warn(`Logo failed to load from: ${ASSET_PATHS.logo}`);
    setImageError(true);
  };

  const handleLoad = () => {
    setImageLoaded(true);
    // Clear any previous error state on successful load
    if (imageError) {
      setImageError(false);
    }
  };

  // If image failed to load and fallback is enabled, show text-based brand name
  if (imageError && showFallback) {
    return (
      <div 
        className="flex items-center justify-center font-heading font-bold text-primary px-3 py-2"
        style={{ minHeight: '2.5rem', minWidth: '8rem' }}
      >
        <span className="text-lg">{BRAND_NAME}</span>
      </div>
    );
  }

  // Render image with stable dimensions and fallback handling
  return (
    <img
      src={ASSET_PATHS.logo}
      alt={`${BRAND_NAME} Logo`}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="eager"
      style={{ minHeight: '2.5rem', objectFit: 'contain' }}
    />
  );
}
