// components/common/HeroSection.tsx
"use client";

import { motion } from 'framer-motion';
import { Button } from './Button';

export function HeroSection() {
  return (
    <div className="relative z-0 min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/home.png"
          alt="Handcrafted Art Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <span className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
            Contemporary Collection
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6"
        >
          Art That Speaks
        </motion.h1>
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-12"
        >
          Discover unique, handcrafted pieces that transform spaces and inspire conversations. Curated for the modern connoisseur.
        </motion.p>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button href="/products" size="lg" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:shadow-xl border border-white/30 px-8 py-4 text-lg font-semibold">
            Explore The Collection
          </Button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  );
}
