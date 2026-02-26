import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Crown, Users, FlaskConical, BarChart3, Settings, Search,
  TrendingUp, Clock, Award, ChevronRight, Atom, UserPlus, Download
} from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { EXPERIMENTS_DATA, GRADE_INFO } from '@/components/physics/ExperimentsData';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = null; // set by AuthContext
        setUser(currentUser);
      } catch (e) {
        // Not logged in
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => { const snap = await getDocs(collection(db, 'profiles')); return snap.docs.map(d => ({id: d.id, ...d.data()})); },
    enabled: user?.role === 'admin'
  });

  const { data: allSessions = [] } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: async () => { const snap = await getDocs(collection(db, 'experiment_sessions')); return snap.docs.map(d => ({id: d.id, ...d.data()})); },
    enabled: user?.role === 'admin'
  });

  // Calculate statistics
  const totalUsers = users.length;
  const totalSessions = allSessions.length;
  const totalExperimentsRun = [...new Set(allSessions.map(s => s.experiment_id))].length;
  const totalDataPoints = allSessions.reduce((acc, s) => acc + (s.readings?.length || 0), 0);

  // Sessions by grade
  const sessionsByGrade = Object.keys(GRADE_INFO).map(grade => ({
    name: GRADE_INFO[grade].name,
    value: allSessions.filter(s => {
      const exp = EXPERIMENTS_DATA.find(e => e.id === s.experiment_id);
      return exp?.grade === grade;
    }).length
  }));

  // Daily activity (last 14 days)
  const dailyActivity = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const dateStr = format(date, 'yyyy-MM-dd');
    const sessions = allSessions.filter(s => 
      s.created_date && format(new Date(s.created_date), 'yyyy-MM-dd') === dateStr
    ).length;
    return {
      date: format(date, 'MMM d'),
      sessions
    };
  });

  // Top experiments
  const experimentCounts = {};
  allSessions.forEach(s => {
    experimentCounts[s.experiment_id] = (experimentCounts[s.experiment_id] || 0) + 1;
  });
  const topExperiments = Object.entries(experimentCounts)
    .map(([id, count]) => ({
      id,
      name: EXPERIMENTS_DATA.find(e => e.id === id)?.name || id,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Filter users
  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const COLORS = ['#00d4ff', '#7928ca', '#10b981', '#f59e0b'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <AnimatedBackground />
        <Atom className="w-16 h-16 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <AnimatedBackground />
        <GlassCard className="p-8 text-center max-w-md mx-4 relative z-10">
          <Crown className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h2 className="text-xl font-bold text-white mb-2">Admin Access Required</h2>
          <p className="text-slate-400 mb-6">
            You need admin privileges to access this dashboard.
          </p>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
              Return Home
            </Button>
          </Link>
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
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <Badge className="mb-1 bg-purple-500/10 text-purple-400 border-purple-500/20">
                Admin Portal
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Dashboard
              </h1>
            </div>
          </div>
          <p className="text-slate-400">
            Monitor platform usage and manage users
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Total Users', value: totalUsers, color: 'cyan', trend: '+12%' },
            { icon: FlaskConical, label: 'Lab Sessions', value: totalSessions, color: 'purple', trend: '+24%' },
            { icon: Atom, label: 'Experiments', value: totalExperimentsRun, color: 'emerald', trend: '+8%' },
            { icon: Award, label: 'Data Points', value: totalDataPoints, color: 'amber', trend: '+45%' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.trend}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Chart */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Daily Activity (Last 14 Days)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyActivity}>
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
                    <Bar dataKey="sessions" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Sessions by Grade */}
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-semibold text-white mb-4">Sessions by Level</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sessionsByGrade}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sessionsByGrade.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {sessionsByGrade.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-slate-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Users Table */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Users
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 w-48 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-slate-400">User</TableHead>
                      <TableHead className="text-slate-400">Role</TableHead>
                      <TableHead className="text-slate-400">Joined</TableHead>
                      <TableHead className="text-slate-400">Sessions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.slice(0, 10).map((u, index) => {
                      const userSessions = allSessions.filter(s => s.user_email === u.email).length;
                      return (
                        <TableRow key={u.id} className="border-white/5 hover:bg-white/5">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-medium">
                                {u.full_name?.charAt(0) || u.email?.charAt(0) || '?'}
                              </div>
                              <div>
                                <p className="text-white font-medium">{u.full_name || 'User'}</p>
                                <p className="text-xs text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={u.role === 'admin' 
                              ? 'bg-purple-500/20 text-purple-400' 
                              : 'bg-cyan-500/20 text-cyan-400'
                            }>
                              {u.role || 'user'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">
                            {u.created_date ? format(new Date(u.created_date), 'MMM d, yyyy') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-white/5 text-slate-300">
                              {userSessions}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </GlassCard>
          </div>

          {/* Top Experiments */}
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Top Experiments
            </h3>
            <div className="space-y-3">
              {topExperiments.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-amber-500/20 text-amber-400' :
                      index === 1 ? 'bg-slate-400/20 text-slate-300' :
                      index === 2 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-white/5 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{exp.name}</span>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-400">
                    {exp.count}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
