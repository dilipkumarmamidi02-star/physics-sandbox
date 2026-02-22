import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Search, UserPlus, CheckCircle2, Clock, XCircle, BookOpen, Users, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ConnectTeacher() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user?.role === 'teacher' || user?.role === 'admin') {
      navigate('/');
    }
  }, [user]);
  const queryClient = useQueryClient();

  const { data: allUsers = [] } = useQuery({
    queryKey: ['all-users-connect'],
    queryFn: async () => { const { data } = await supabase.from('profiles').select('*'); return data || []; },
    enabled: !!user
  });

  const { data: myLinks = [] } = useQuery({
    queryKey: ['my-teacher-links', user?.email],
    queryFn: async () => { const { data } = await supabase.from('teacher_student_links').select('*').eq('student_email', user?.email); return data || []; },
    enabled: !!user?.email
  });

  const requestMutation = useMutation({
    mutationFn: async (teacher) => { await supabase.from('teacher_student_links').insert({
      student_email: user.email,
      student_name: user.name || user.email,
      teacher_email: teacher.email,
      teacher_name: teacher.name || teacher.email,
      status: 'pending'
    }); },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-teacher-links']);
      toast.success('Request sent! Waiting for teacher approval.');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async (linkId) => { await supabase.from('teacher_student_links').delete().eq('id', linkId); },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-teacher-links']);
      toast.info('Request cancelled.');
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <AnimatedBackground />
        <GlassCard className="p-8 text-center z-10 relative">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <p className="text-slate-300">Please sign in first.</p>
          <Button className="mt-4 bg-cyan-500" onClick={() => (window.location.href = "/ConnectTeacher")}>Sign In</Button>
        </GlassCard>
      </div>
    );
  }

  const teachers = allUsers.filter(u => (u.role === 'teacher' || u.role === 'admin') && u.email !== user?.email);
  const filtered = teachers.filter(t =>
    (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.institution || '').toLowerCase().includes(search.toLowerCase())
  );

  const getLinkStatus = (teacherEmail) => myLinks.find(l => l.teacher_email === teacherEmail);

  const linkedTeachers = myLinks.filter(l => l.status === 'approved');
  const pendingLinks = myLinks.filter(l => l.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Connect with Teachers</h1>
          <p className="text-slate-400">Find and link with your teachers. Once connected, you'll receive assignment notifications automatically.</p>
        </motion.div>

        {/* My connections */}
        {(linkedTeachers.length > 0 || pendingLinks.length > 0) && (
          <GlassCard className="p-5 mb-6" hover={false}>
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> My Connections
            </h3>
            <div className="space-y-2">
              {linkedTeachers.map(link => (
                <div key={link.id} className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{link.teacher_name}</p>
                    <p className="text-xs text-slate-400">{link.teacher_email}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
                </div>
              ))}
              {pendingLinks.map(link => (
                <div key={link.id} className="flex items-center gap-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{link.teacher_name}</p>
                    <p className="text-xs text-slate-400">{link.teacher_email}</p>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mr-2">Pending</Badge>
                  <Button
                    size="sm" variant="ghost"
                    className="text-red-400 hover:text-red-300 h-7 px-2"
                    onClick={() => cancelMutation.mutate(link.id)}
                  >
                    <XCircle className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search teachers by name, email, or institution..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* Teachers list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <GlassCard className="p-8 text-center" hover={false}>
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No teachers found. Ask your teacher to register on PHX-MASTER.</p>
            </GlassCard>
          ) : filtered.map(teacher => {
            const link = getLinkStatus(teacher.email);
            return (
              <motion.div key={teacher.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-4 flex items-center gap-4" hover={false}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {(teacher.name || teacher.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{teacher.name || 'Teacher'}</p>
                    <p className="text-sm text-slate-400 truncate">{teacher.email}</p>
                    {teacher.institution && <p className="text-xs text-slate-500">{teacher.institution}</p>}
                  </div>
                  <div>
                    {!link ? (
                      <Button
                        size="sm"
                        onClick={() => requestMutation.mutate(teacher)}
                        disabled={requestMutation.isPending}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Connect
                      </Button>
                    ) : link.status === 'approved' ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                      </Badge>
                    ) : link.status === 'pending' ? (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <XCircle className="w-3 h-3 mr-1" /> Rejected
                      </Badge>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
