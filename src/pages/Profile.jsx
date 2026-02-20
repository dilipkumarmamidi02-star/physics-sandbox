import { useAuth } from '@/lib/AuthContext';
import { entities, integrations } from '@/lib/localStore';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  User, Mail, Calendar, Award, FlaskConical, Clock,
  Save, Crown, Shield, Atom
} from 'lucide-react';
import { EXPERIMENTS_DATA } from '@/components/physics/ExperimentsData';
import { format } from 'date-fns';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = null;
        setUser(currentUser);
      } catch (e) {
        // Not logged in
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const { data: sessions = [] } = useQuery({
    queryKey: ['profile-sessions', user?.email],
    queryFn: () => entities.ExperimentSession.filter({ user_email: user?.email }, '-created_date', 100),
    enabled: !!user?.email
  });

  const stats = {
    totalExperiments: [...new Set(sessions.map(s => s.experiment_id))].length,
    totalSessions: sessions.length,
    totalTime: sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0),
    totalReadings: sessions.reduce((acc, s) => acc + (s.readings?.length || 0), 0)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10">
          <Atom className="w-16 h-16 text-cyan-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <AnimatedBackground />
        <GlassCard className="p-8 text-center max-w-md mx-4 relative z-10">
          <User className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in Required</h2>
          <p className="text-slate-400 mb-6">
            Please sign in to view your profile.
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
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            My Profile
          </h1>
          <p className="text-slate-400">
            Manage your account and view your statistics
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {user.full_name || 'Physics Explorer'}
                  </h2>
                  <p className="text-slate-400">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {user.role === 'admin' ? (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        <Crown className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Student
                      </Badge>
                    )}
                    <Badge className="bg-white/5 text-slate-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      Joined {user.created_date ? format(new Date(user.created_date), 'MMM yyyy') : 'Recently'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-slate-400">Full Name</Label>
                  <Input 
                    value={user.full_name || ''} 
                    disabled
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-400">Email</Label>
                  <Input 
                    value={user.email || ''} 
                    disabled
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FlaskConical, label: 'Experiments', value: stats.totalExperiments, color: 'cyan' },
                { icon: Award, label: 'Sessions', value: stats.totalSessions, color: 'purple' },
                { icon: Clock, label: 'Time Spent', value: `${Math.round(stats.totalTime / 60)}m`, color: 'emerald' },
                { icon: Atom, label: 'Data Points', value: stats.totalReadings, color: 'amber' }
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-emerald-400">Account Active</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-medium">
                    {Math.round((stats.totalExperiments / EXPERIMENTS_DATA.length) * 100)}%
                  </span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                  onClick={() => logout()}
                >
                  Sign Out
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
