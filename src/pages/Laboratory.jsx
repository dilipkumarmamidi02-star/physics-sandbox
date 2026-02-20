import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import LabGrid from '@/components/physics/LabGrid';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Sparkles } from 'lucide-react';

export default function Laboratory() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <Badge className="mb-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Virtual Lab
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Physics Laboratory
              </h1>
            </div>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Explore our collection of interactive physics experiments. 
            Select any experiment to start simulating and learning.
          </p>
        </motion.div>

        {/* Lab Grid */}
        <LabGrid />
      </div>
    </div>
  );
}
