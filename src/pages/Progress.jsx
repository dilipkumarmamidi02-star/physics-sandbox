import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress as ProgressBar } from '@/components/ui/progress';
import {
  BarChart3, Trophy, Clock, Target, Flame, Calendar,
  TrendingUp, Award, FlaskConical, ChevronRight, Atom
} from 'lucide-react';
import { EXPERIMENTS_DATA, GRADE_INFO, CATEGORY_INFO } from '@/components/physics/ExperimentsData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { format } from 'date-fns';

export default function Progress() {
  const { user } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = null;
        setUser(currentUser);
      } catch (e) {
        // Not logged in
      }
    };
    loadUser();
  }, []);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions', user?.email],
    queryFn: async () => { const { data } = await supabase.from('experiment_sessions').select('*').eq('user_email', user?.email).order('created_at', { ascending: false }).limit(100); return data || []; },
    enabled: !!user?.email
  });

  // Calculate stats
  const totalExperiments = sessions.length;
  const uniqueExperiments = [...new Set(sessions.map(s => s.experiment_id))].length;
  const totalTime = sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);
  const totalReadings = sessions.reduce((acc, s) => acc + (s.readings?.length || 0), 0);

  // Progress by grade
  const gradeProgress = Object.keys(GRADE_INFO).map(grade => {
    const gradeExperiments = EXPERIMENTS_DATA.filter(e => e.grade === grade);
    const completed = sessions.filter(s => gradeExperiments.some(e => e.id === s.experiment_id));
    return {
      grade,
      ...GRADE_INFO[grade],
      total: gradeExperiments.length,
      completed: [...new Set(completed.map(c => c.experiment_id))].length,
      percentage: Math.round(([...new Set(completed.map(c => c.experiment_id))].length / gradeExperiments.length) * 100)
    };
  });

  // Activity chart data
  const activityData = sessions.slice(0, 30).reverse().map(s => ({
    date: (() => { const d = new Date(s.created_at || Date.now()); const ist = new Date(d.getTime() + (5.5 * 60 * 60 * 1000)); return ist.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }); })(),
    readings: s.readings?.length || 0,
    duration: Math.round((s.duration_seconds || 0) / 60)
  }));

  // Recent sessions
  const recentSessions = sessions.slice(0, 5);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <AnimatedBackground />
        <GlassCard className="p-8 text-center max-w-md mx-4 relative z-10">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in to Track Progress</h2>
          <p className="text-slate-400 mb-6">
            Create an account to save your experiment history and track your learning journey.
          </p>
          <Button 
            onClick={() => (window.location.href = "/ConnectTeacher")}
            className="bg-gradient-to-r from-cyan-500 to-blue-500"
          >
            Sign In
          </Button>
        </GlassCard>
      </div>
    );
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                My Progress
              </h1>
              <p className="text-slate-400">
                Track your physics learning journey
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-2">
                <Flame className="w-4 h-4 mr-2" />
                {totalExperiments} Sessions
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FlaskConical, label: 'Experiments Done', value: uniqueExperiments, color: 'cyan' },
            { icon: Clock, label: 'Total Time', value: `${Math.round(totalTime / 60)}m`, color: 'purple' },
            { icon: Target, label: 'Data Points', value: totalReadings, color: 'emerald' },
            { icon: Trophy, label: 'Completion', value: `${Math.round((uniqueExperiments / EXPERIMENTS_DATA.length) * 100)}%`, color: 'amber' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Chart */}
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Activity Overview
              </h3>
              <div className="h-64">
                {activityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorReadings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="readings" 
                        stroke="#00d4ff" 
                        fillOpacity={1}
                        fill="url(#colorReadings)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    No activity data yet
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Grade Progress */}
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Progress by Level
              </h3>
              <div className="space-y-6">
                {gradeProgress.map((grade, index) => (
                  <motion.div
                    key={grade.grade}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`bg-gradient-to-r ${grade.color} text-white border-0`}>
                          {grade.name}
                        </Badge>
                        <span className="text-sm text-slate-400">
                          {grade.completed}/{grade.total} experiments
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white">{grade.percentage}%</span>
                    </div>
                    <ProgressBar value={grade.percentage} className="h-2 bg-white/5" />
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Sessions */}
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Recent Sessions
              </h3>
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session, index) => (
                    <Link 
                      key={session.id}
                      to={createPageUrl(`Simulator?id=${session.experiment_id}`)}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                            {session.experiment_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(() => { const d = new Date(session.created_at || Date.now()); const ist = new Date(d.getTime() + (5.5 * 60 * 60 * 1000)); return ist.toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }); })()}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Atom className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No sessions yet</p>
                  <Link to={createPageUrl('Laboratory')}>
                    <Button variant="link" className="text-cyan-400 mt-2">
                      Start your first experiment
                    </Button>
                  </Link>
                </div>
              )}
            </GlassCard>

            {/* Achievements */}
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Achievements
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🔬', label: 'First Experiment', unlocked: totalExperiments >= 1 },
                  { icon: '📊', label: '10 Data Points', unlocked: totalReadings >= 10 },
                  { icon: '⚡', label: 'Speed Runner', unlocked: totalTime >= 300 },
                  { icon: '🎯', label: '5 Unique Labs', unlocked: uniqueExperiments >= 5 },
                  { icon: '🌟', label: 'Class 11 Pro', unlocked: gradeProgress[0].percentage >= 50 },
                  { icon: '🏆', label: 'Master', unlocked: uniqueExperiments >= 20 }
                ].map((achievement, index) => (
                  <motion.div
                    key={achievement.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg text-center ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30' 
                        : 'bg-white/5 opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <p className="text-xs text-slate-300 mt-1">{achievement.label}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
