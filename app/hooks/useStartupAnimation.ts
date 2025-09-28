"use client";

import { useState, useEffect } from "react";

export function useStartupAnimation() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [hasShownAnimation, setHasShownAnimation] = useState(false);

  useEffect(() => {
    // Check if animation has been shown before in this session
    const hasShown = sessionStorage.getItem("meghkala-startup-animation");

    if (!hasShown) {
      setShowAnimation(true);
      setHasShownAnimation(true);
      // Mark as shown in session storage
      sessionStorage.setItem("meghkala-startup-animation", "true");
    }
  }, []);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  return {
    showAnimation,
    hasShownAnimation,
    handleAnimationComplete,
  };
}
