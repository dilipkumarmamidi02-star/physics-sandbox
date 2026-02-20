import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GlassCard({ 
  children, 
  className, 
  hover = true,
  glow = false,
  glowColor = "cyan",
  onClick,
  ...props 
}) {
  const glowColors = {
    cyan: "hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]",
    purple: "hover:shadow-[0_0_30px_rgba(121,40,202,0.3)]",
    green: "hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    amber: "hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]",
    pink: "hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]"
  };

  return (
    <motion.div
      className={cn(
        "relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10",
        "transition-all duration-500",
        hover && "hover:bg-white/10 hover:border-white/20 hover:-translate-y-1",
        glow && glowColors[glowColor],
        onClick && "cursor-pointer",
        className
      )}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      {...props}
    >
      {glow && (
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500",
          "bg-gradient-to-r",
          glowColor === "cyan" && "from-cyan-500/10 to-blue-500/10",
          glowColor === "purple" && "from-purple-500/10 to-pink-500/10",
          glowColor === "green" && "from-emerald-500/10 to-teal-500/10",
          hover && "group-hover:opacity-100"
        )} />
      )}
      {children}
    </motion.div>
  );
}
"use client"
