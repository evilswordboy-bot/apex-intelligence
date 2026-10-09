"use client";

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ApexImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  badge?: string;
  badgeColor?: string;
  overlayGradient?: boolean;
}

export default function ApexImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/abstract/sports_telemetry_mesh.jpg',
  badge,
  badgeColor = '#B6FF3B',
  overlayGradient = true,
  ...rest
}: ApexImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        onError={() => {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }}
        {...rest}
      />
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-transparent pointer-events-none" />
      )}
      {badge && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#070B16]/80 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badgeColor }} />
          <span className="text-white">{badge}</span>
        </div>
      )}
    </div>
  );
}
