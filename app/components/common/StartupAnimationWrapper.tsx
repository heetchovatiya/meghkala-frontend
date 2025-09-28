"use client";

import { LogoAnimation } from './LogoAnimation';
import { useStartupAnimation } from '@/hooks/useStartupAnimation';

interface StartupAnimationWrapperProps {
  children: React.ReactNode;
}

export function StartupAnimationWrapper({ children }: StartupAnimationWrapperProps) {
  const { showAnimation, handleAnimationComplete } = useStartupAnimation();

  return (
    <>
      {showAnimation && (
        <LogoAnimation onAnimationComplete={handleAnimationComplete} />
      )}
      {children}
    </>
  );
}
