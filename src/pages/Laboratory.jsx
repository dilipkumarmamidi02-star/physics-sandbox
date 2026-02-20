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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  BookOpen, Search, ChevronRight, Play, Clock, Users, Star,
  Atom, Zap, Waves, Eye, Thermometer, Magnet, Sparkles, Info, ExternalLink
} from 'lucide-react';
import { CATEGORY_INFO, PHYSICS_CONSTANTS } from '@/components/physics/ExperimentsData';
import TopicDetailModal from '@/components/learn/TopicDetailModal';

const COURSES = [
  {
    id: 'mechanics',
    title: 'Classical Mechanics',
    description: 'Learn the fundamentals of motion, forces, and energy',
    icon: 'Atom',
    lessons: 12,
    duration: '4 hours',
    level: 'Beginner',
    color: 'from-emerald-500 to-teal-500',
    topics: ['Newton\'s Laws', 'Work & Energy', 'Momentum', 'Rotational Motion'],
    ncertUrl: 'https://ncert.nic.in/textbook.php?keph1=0-7'
  },
  {
    id: 'waves',
    title: 'Waves & Oscillations',
    description: 'Understand wave phenomena, sound, and harmonic motion',
    icon: 'Waves',
    lessons: 10,
    duration: '3.5 hours',
    level: 'Intermediate',
    color: 'from-blue-500 to-indigo-500',
    topics: ['Simple Harmonic Motion', 'Wave Properties', 'Sound Waves', 'Resonance'],
    ncertUrl: 'https://ncert.nic.in/textbook.php?keph2=0-6'
  },
  {
    id: 'optics',
    title: 'Light & Optics',
    description: 'Explore reflection, refraction, and optical instruments',
    icon: 'Eye',
    lessons: 14,
    duration: '5 hours',
    level: 'Intermediate',
    color: 'from-amber-500 to-orange-500',
    topics: ['Reflection', 'Refraction', 'Lenses', 'Wave Optics', 'Polarization'],
    ncertUrl: 'https://ncert.nic.in/textbook.php?leph1=0-10'
  },
  {
    id: 'electricity',
    title: 'Electricity & Circuits',
    description: 'Master electrical circuits, current, and electromagnetic phenomena',
    icon: 'Zap',
    lessons: 15,
    duration: '5.5 hours',
    level: 'Intermediate',
    color: 'from-yellow-500 to-amber-500',
    topics: ['Electric Field', 'Circuits', 'Capacitors', 'Magnetic Fields'],
    ncertUrl: 'https://ncert.nic.in/textbook.php?leph1=0-10'
  },
  {
    id: 'thermodynamics',
    title: 'Thermodynamics',
    description: 'Study heat, temperature, and the laws of thermodynamics',
    icon: 'Thermometer',
    lessons: 8,
    duration: '3 hours',
    level: 'Intermediate',
    color: 'from-red-500 to-rose-500',
    topics: ['Heat Transfer', 'Laws of Thermodynamics', 'Entropy', 'Heat Engines'],
    ncertUrl: 'https://ncert.nic.in/textbook.php?keph2=0-6'
  },
  {
    id: 'modern',
    title: 'Modern Physics',
    description: 'Dive into quantum mechanics, relativity, and nuclear physics',
    icon: 'Sparkles',
    lessons: 18,
    duration: '7 hours',
    level: 'Advanced',
    color: 'from-purple-500 to-pink-500',
    topics: ['Quantum Theory', 'Photoelectric Effect', 'Nuclear Physics', 'Relativity'],
    ncertUrl: 'https://ncert.nic.in/textbook.php?leph2=0-9'
  }
];

const iconMap = {
  Atom, Waves, Eye, Zap, Thermometer, Sparkles, Magnet
};

