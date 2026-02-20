import React from 'react';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import HeroSection from '@/components/physics/HeroSection';
import FeaturedExperiments from '@/components/physics/FeaturedExperiments';
import GradeLevelSection from '@/components/physics/GradeLevelSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Atom, Sparkles, ArrowRight, Github, Mail, MessageCircle } from 'lucide-react';



export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <HeroSection />
        <FeaturedExperiments />
        <GradeLevelSection />

        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20 text-cyan-400">
                <Sparkles className="w-4 h-4 mr-2" />
                Ready to Explore?
              </Badge>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Start Your{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Physics Journey
                </span>
              </h2>
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                Join thousands of students mastering physics through interactive simulations.
                No equipment needed — just curiosity.
              </p>
              <Link to={createPageUrl('Laboratory')}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-xl shadow-cyan-500/25 px-8 py-6 text-lg rounded-2xl"
                >
                  Enter the Laboratory
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Atom className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">PHX-MASTER</h3>
                  <p className="text-xs text-slate-500">Physics Sandbox Playground</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <Link to={createPageUrl('Laboratory')} className="text-sm text-slate-400 hover:text-white transition-colors">Laboratory</Link>
                <Link to={createPageUrl('Learn')} className="text-sm text-slate-400 hover:text-white transition-colors">Learn</Link>
                <Link to={createPageUrl('Progress')} className="text-sm text-slate-400 hover:text-white transition-colors">Progress</Link>
              </div>

              <div className="flex items-center gap-3">
                {/* GitHub links */}
                <a href="https://github.com/mamididilipkumar2006-star" target="_blank" rel="noopener noreferrer" title="GitHub - Dilip Kumar (1)">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <Github className="w-5 h-5" />
                  </Button>
                </a>
                <a href="https://github.com/dilipkumarmamidi02-star" target="_blank" rel="noopener noreferrer" title="GitHub - Dilip Kumar (2)">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <Github className="w-5 h-5" />
                  </Button>
                </a>
                {/* WhatsApp */}
                <a href="https://wa.me/916300073034" target="_blank" rel="noopener noreferrer" title="WhatsApp: +91 6300073034">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-green-400">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </a>
                {/* Email */}
                <a href="mailto:dilipkumarmamidi02@gmail.com" title="Email: dilipkumarmamidi02@gmail.com">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-sm text-slate-500">
                © 2026 Batch AE-12 PHX-MASTER. Built for curious minds. |{' '}
                <a href="mailto:24241a66fn@grietcollege.com" className="hover:text-slate-300 transition-colors">Contact</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
