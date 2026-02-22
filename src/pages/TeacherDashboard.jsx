import { useAuth } from '@/lib/AuthContext';
import { entities, integrations } from '@/lib/localStore';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Users, BookOpen, TrendingUp, CheckCircle2, AlertCircle,
  Plus, FlaskConical, Star, Clock, BarChart2, UserCheck
} from 'lucide-react';
import { format } from 'date-fns';
import CreateAssignmentModal from '@/components/physics/CreateAssignmentModal';
import AssignmentCard from '@/components/physics/AssignmentCard';
import SubmissionsPanel from '@/components/physics/SubmissionsPanel';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState(null);

  useEffect(() => {
    
  }, []);

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments', user?.email],
    queryFn: () => entities.ExperimentAssignment.filter({ teacher_email: user?.email }),
    enabled: !!user?.email
  });

  const { data: allSubmissions = [] } = useQuery({
    queryKey: ['all-submissions'],
    queryFn: () => entities.StudentSubmission.list('-created_date', 200),
    enabled: !!user?.email
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => entities.User.list(),
    enabled: !!user
  });

  const { data: allSessions = [] } = useQuery({
    queryKey: ['all-sessions'],
    queryFn: () => entities.ExperimentSession.list('-created_date', 100),
    enabled: !!user
  });

  const { data: studentRequests = [], refetch: refetchRequests } = useQuery({
    queryKey: ['student-requests', user?.email],
    queryFn: () => entities.TeacherStudentLink.filter({ teacher_email: user?.email }),
    enabled: !!user?.email
  });

  const handleLinkAction = async (linkId, action) => {
    await entities.TeacherStudentLink.update(linkId, { status: action });
    refetchRequests();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'teacher' && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Teacher Access Only</h1>
          <p className="text-slate-400">This dashboard requires a teacher or admin role.</p>
        </div>
      </div>
    );
  }

  const approvedStudentEmails = new Set(studentRequests.filter(r => r.status === 'approved').map(r => r.student_email));
  const students = allUsers.filter(u => (u.role === 'student' || u.role === 'user') && (approvedStudentEmails.size === 0 || approvedStudentEmails.has(u.email)));
  const myStudentSessions = allSessions.filter(s =>
    students.some(st => st.email === s.user_email)
  );

  const totalSubmissions = allSubmissions.filter(s =>
    assignments.some(a => a.id === s.assignment_id)
  );
  const gradedCount = totalSubmissions.filter(s => s.status === 'graded').length;

  const stats = [
    { label: 'Connected Students', value: approvedStudentEmails.size, icon: Users, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/20' },
    { label: 'Active Assignments', value: assignments.filter(a => a.status === 'active').length, icon: BookOpen, color: 'text-purple-400', bg: 'from-purple-500/20 to-pink-500/20' },
    { label: 'Submissions', value: totalSubmissions.length, icon: FlaskConical, color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/20' },
    { label: 'Graded', value: gradedCount, icon: Star, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-teal-500/20' }
  ];

  const getSubmissionsForAssignment = (assignmentId) =>
    allSubmissions.filter(s => s.assignment_id === assignmentId && s.status !== 'draft').length;

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const pastAssignments = assignments.filter(a => a.status !== 'active');

  // If viewing submissions for a specific assignment
  if (viewingAssignment) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <AnimatedBackground />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SubmissionsPanel
            assignment={viewingAssignment}
            onBack={() => setViewingAssignment(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage assignments, track submissions, and grade student work.</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Assignment
          </Button>
        </div>

        {/* Student Connection Requests */}
        {studentRequests.filter(r => r.status === 'pending').length > 0 && (
          <GlassCard className="p-5 mb-6 border border-amber-500/30" hover={false}>
            <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Student Connection Requests ({studentRequests.filter(r => r.status === 'pending').length})
            </h3>
            <div className="space-y-2">
              {studentRequests.filter(r => r.status === 'pending').map(req => (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {(req.student_name || req.student_email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{req.student_name || 'Student'}</p>
                    <p className="text-xs text-slate-400">{req.student_email}</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs" onClick={() => handleLinkAction(req.id, 'approved')}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 h-7 px-3 text-xs" onClick={() => handleLinkAction(req.id, 'rejected')}>
                    Reject
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className={`p-5 bg-gradient-to-br ${s.bg}`} hover={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{s.label}</p>
                    <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                  <s.icon className={`w-10 h-10 opacity-60 ${s.color}`} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Assignments */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="active">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-slate-800/50 border border-white/10">
                  <TabsTrigger value="active" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                    <Clock className="w-4 h-4 mr-1" /> Active ({activeAssignments.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="data-[state=active]:bg-slate-500/20 data-[state=active]:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Past ({pastAssignments.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="active">
                {activeAssignments.length === 0 ? (
                  <GlassCard className="p-10 text-center" hover={false}>
                    <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400">No active assignments. Create one to get started!</p>
                    <Button className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600" onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" /> Create Assignment
                    </Button>
                  </GlassCard>
                ) : (
                  <div className="space-y-4">
                    {activeAssignments.map(a => (
                      <AssignmentCard
                        key={a.id}
                        assignment={a}
                        submissionsCount={getSubmissionsForAssignment(a.id)}
                        onViewSubmissions={() => setViewingAssignment(a)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {pastAssignments.length === 0 ? (
                  <GlassCard className="p-10 text-center" hover={false}>
                    <p className="text-slate-400">No past assignments yet.</p>
                  </GlassCard>
                ) : (
                  <div className="space-y-4">
                    {pastAssignments.map(a => (
                      <AssignmentCard
                        key={a.id}
                        assignment={a}
                        submissionsCount={getSubmissionsForAssignment(a.id)}
                        onViewSubmissions={() => setViewingAssignment(a)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Recent Activity */}
            <GlassCard className="p-5" hover={false}>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Recent Activity
              </h3>
              <div className="space-y-3">
                {totalSubmissions.slice(0, 6).map(sub => (
                  <div key={sub.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-300 truncate">{sub.student_name || sub.student_email}</p>
                      <p className="text-xs text-slate-500 truncate">{sub.experiment_name}</p>
                    </div>
                    <div className="text-right ml-3 shrink-0">
                      <Badge className={`text-xs border ${sub.status === 'graded' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                        {sub.status}
                      </Badge>
                      {sub.score != null && (
                        <p className="text-xs text-emerald-400 mt-1">{sub.score}/{sub.max_score}</p>
                      )}
                    </div>
                  </div>
                ))}
                {totalSubmissions.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">No submissions yet</p>
                )}
              </div>
            </GlassCard>

            {/* Student Lab Sessions */}
            <GlassCard className="p-5" hover={false}>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" /> Lab Sessions
              </h3>
              <div className="space-y-2">
                {myStudentSessions.slice(0, 5).map(session => (
                  <div key={session.id} className="flex items-center justify-between text-sm py-1 border-b border-white/5">
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-300 truncate text-xs">{session.user_email}</p>
                      <p className="text-slate-500 truncate text-xs">{session.experiment_name}</p>
                    </div>
                    <Badge className={`text-xs shrink-0 ml-2 ${session.completed ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {session.completed ? 'Done' : 'Active'}
                    </Badge>
                  </div>
                ))}
                {myStudentSessions.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-2">No lab sessions yet</p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <CreateAssignmentModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        teacherEmail={user?.email}
        students={students}
      />
    </div>
  );
}
