import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Atom } from 'lucide-react';

export default function RoleSelect() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-lg mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/30">
            <Atom className="w-10 h-10 text-white animate-spin-slow" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            PHX-MASTER
          </h1>
          <p className="text-slate-400 text-lg">Virtual Physics Laboratory</p>
          <p className="text-slate-500 text-sm mt-3">Choose how you want to continue</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Student */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <Link to={createPageUrl('StudentAssignments')}>
              <div className="group cursor-pointer bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">I'm a Student</h2>
                <p className="text-slate-400 text-sm">Access experiments, view assignments from your teacher, and track your progress.</p>
                <div className="mt-5">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium rounded-xl">
                    Enter as Student →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Teacher */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <Link to={createPageUrl('TeacherDashboard')}>
              <div className="group cursor-pointer bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">I'm a Teacher</h2>
                <p className="text-slate-400 text-sm">Create assignments, manage students, and grade experiment submissions.</p>
                <div className="mt-5">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-xl">
                    Enter as Teacher →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-slate-500 text-xs mt-8">
          Your role is remembered from your account. This is just a quick-access shortcut.
        </motion.p>
      </div>
    </div>
  );
}
