import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { 
  Atom, Target, TrendingUp, Users, Award, 
  BookOpen, Zap, Globe, CheckCircle2, Sparkles 
} from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Atom,
      title: '30+ Interactive Experiments',
      description: 'Comprehensive physics simulations covering mechanics, optics, electricity, magnetism, and modern physics',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Target,
      title: 'Real-World Applications',
      description: 'Every simulation is designed to solve practical physics problems with industry-standard accuracy',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics, achievements, and performance metrics',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Multi-Level Learning',
      description: 'Tailored content for Class 11, Class 12, and B.Tech students with adaptive difficulty',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const advantages = [
    'Cost-effective alternative to physical lab equipment',
    'Safe environment to conduct potentially dangerous experiments',
    'Repeat experiments unlimited times for better understanding',
    'Real-time data visualization and analysis',
    'Accessible 24/7 from anywhere with internet',
    'Environmentally friendly - no chemical waste or materials',
    'Instant feedback and error correction',
    'Collaborative learning with shared experiments'
  ];

  const applications = [
    {
      title: 'Educational Institutions',
      description: 'Schools, colleges, and universities can use this platform as a supplementary teaching tool',
      icon: BookOpen
    },
    {
      title: 'Remote Learning',
      description: 'Perfect for online education and distance learning programs',
      icon: Globe
    },
    {
      title: 'Self-Study & Preparation',
      description: 'Students can practice and prepare for competitive exams like JEE, NEET, and GATE',
      icon: Award
    },
    {
      title: 'Research & Development',
      description: 'Quick prototyping and testing of physics concepts before physical implementation',
      icon: Zap
    }
  ];

  const technologies = [
    'React 18 with Hooks for dynamic UI',
    'Canvas API for high-performance simulations',
    'TailwindCSS for responsive design',
    'Framer Motion for smooth animations',
    'Recharts for data visualization',
    'Base44 Backend for data persistence',
    'Real-time physics calculations'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            About PHX-MASTER
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
            Virtual Physics Laboratory
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            A comprehensive, immersive platform for learning physics through interactive 
            simulations, designed to bridge the gap between theoretical knowledge and 
            practical understanding.
          </p>
        </motion.div>

        {/* Key Features */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Key Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full" hover glow glowColor="cyan">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Advantages */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Advantages of Virtual Labs
          </motion.h2>
          
          <GlassCard className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">{advantage}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Applications */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Real-World Applications
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6" hover>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                      <app.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{app.title}</h3>
                      <p className="text-slate-400 text-sm">{app.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technologies */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Built With Modern Technologies
          </motion.h2>
          
          <GlassCard className="p-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 px-4 py-2">
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Mission Statement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <GlassCard className="p-12" glow glowColor="purple">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
              Our Mission
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              To democratize physics education by providing accessible, accurate, and engaging 
              virtual laboratory experiences that empower students to explore, experiment, and 
              excel in their understanding of the physical world - anytime, anywhere.
            </p>
          </GlassCard>
        </motion.section>
      </div>
    </div>
  );
}
