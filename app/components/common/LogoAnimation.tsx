"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LogoAnimationProps {
  onAnimationComplete?: () => void;
  duration?: number;
}

export function LogoAnimation({ onAnimationComplete, duration = 3000 }: LogoAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'logo' | 'text' | 'complete'>('logo');

  useEffect(() => {
    // Phase 1: Logo animation (0-1500ms)
    const logoTimer = setTimeout(() => {
      setAnimationPhase('text');
    }, 1500);

    // Phase 2: Text animation (1500-2500ms)
    const textTimer = setTimeout(() => {
      setAnimationPhase('complete');
    }, 2500);

    // Phase 3: Complete and fade out (2500-3000ms)
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onAnimationComplete?.();
    }, duration);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Logo Image Animation */}
        <div 
          className={`transition-all duration-1500 ease-out ${
            animationPhase === 'logo' 
              ? 'scale-100 opacity-100' 
              : 'scale-110 opacity-100'
          }`}
        >
          <div 
            className={`relative transition-all duration-1500 ${
              animationPhase === 'logo' 
                ? 'animate-pulse' 
                : ''
            }`}
          >
            <Image
              src="/logo.png"
              alt="Meghkala Logo"
              width={200}
              height={120}
              className={`transition-all duration-1500 ${
                animationPhase === 'logo' 
                  ? 'opacity-0 scale-50' 
                  : 'opacity-100 scale-100'
              }`}
              style={{
                transition: 'opacity 1.5s ease-out, transform 1.5s ease-out'
              }}
              priority
            />
          </div>
        </div>

        {/* Loading dots */}
        <div 
          className={`transition-all duration-500 delay-2000 ${
            animationPhase === 'complete' 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#e91e63] rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
