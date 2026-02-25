import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/ui/GlassCard';
import GradingModal from './GradingModal';
import { Users, CheckCircle2, Clock, Star, ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const STATUS_COLORS = {
  submitted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  graded: 'bg-green-500/20 text-green-400 border-green-500/30',
  draft: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
};

export default function SubmissionsPanel({ assignment, onBack }) {
  const [search, setSearch] = useState('');
  const [gradingSubmission, setGradingSubmission] = useState(null);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions', assignment.id],
    queryFn: async () => { const q = query(collection(db, 'student_submissions'), where('assignment_id', '==', assignment.id)); const snap = await getDocs(q); return snap.docs.map(d => ({id: d.id, ...d.data()})); },
    enabled: !!assignment.id
  });

  const filtered = submissions.filter(s =>
    !search || s.student_email.includes(search) || s.student_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Build a list that shows all assigned students, even those who haven't submitted
  const assignedStudents = assignment.student_emails || [];
  const submittedEmails = new Set(submissions.map(s => s.student_email));

  const notSubmitted = assignedStudents.filter(e => !submittedEmails.has(e));

  const stats = {
    total: assignedStudents.length,
    submitted: submissions.filter(s => s.status !== 'draft').length,
    graded: submissions.filter(s => s.status === 'graded').length,
    avgScore: (() => {
      const graded = submissions.filter(s => s.status === 'graded' && s.score != null);
      if (!graded.length) return null;
      return (graded.reduce((sum, s) => sum + s.score, 0) / graded.length).toFixed(1);
    })()
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-white">{assignment.title}</h2>
          <p className="text-slate-400 text-sm">{assignment.experiment_name}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Assigned', value: stats.total, icon: Users, color: 'text-slate-300' },
          { label: 'Submitted', value: stats.submitted, icon: CheckCircle2, color: 'text-amber-400' },
          { label: 'Graded', value: stats.graded, icon: Star, color: 'text-green-400' },
          { label: 'Avg Score', value: stats.avgScore ?? '–', icon: Star, color: 'text-cyan-400' }
        ].map(s => (
          <GlassCard key={s.label} className="p-4 text-center" hover={false}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search students..."
          className="bg-slate-800 border-white/10 text-white pl-9"
        />
      </div>

      {/* Submissions list */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-400">Loading submissions...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(sub => (
            <GlassCard key={sub.id} className="p-4" hover={false}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white uppercase">
                    {(sub.student_name || sub.student_email)[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{sub.student_name || sub.student_email}</p>
                    <p className="text-xs text-slate-500">{sub.student_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={`text-xs border ${STATUS_COLORS[sub.status] || STATUS_COLORS.draft}`}>
                    {sub.status}
                  </Badge>

                  {sub.status === 'graded' && sub.score != null && (
                    <span className="text-sm font-bold text-emerald-400">
                      {sub.score}/{sub.max_score || assignment.max_score || 100}
                    </span>
                  )}

                  {sub.submitted_at && (
                    <span className="text-xs text-slate-500">
                      {format(new Date(sub.submitted_at), 'MMM d, HH:mm')}
                    </span>
                  )}

                  <span className="text-xs text-slate-600">{sub.readings?.length || 0} readings</span>

                  <Button
                    size="sm"
                    className={
                      sub.status === 'graded'
                        ? "bg-slate-700 hover:bg-slate-600 text-xs"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-xs"
                    }
                    onClick={() => setGradingSubmission(sub)}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {sub.status === 'graded' ? 'Re-grade' : 'Grade'}
                  </Button>
                </div>
              </div>

              {sub.teacher_feedback && (
                <div className="mt-3 bg-slate-800/50 rounded p-3 border border-white/5 text-xs text-slate-400">
                  <strong className="text-slate-300">Feedback:</strong> {sub.teacher_feedback}
                </div>
              )}
            </GlassCard>
          ))}

          {/* Not submitted */}
          {notSubmitted.filter(e => !search || e.includes(search)).map(email => (
            <GlassCard key={email} className="p-4 opacity-60" hover={false}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-sm text-slate-500 uppercase">
                    {email[0]}
                  </div>
                  <div>
                    <p className="text-slate-400">{email}</p>
                    <p className="text-xs text-slate-600">Not submitted</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <Badge className="text-xs border bg-slate-700/30 text-slate-500 border-slate-600/30">Pending</Badge>
                </div>
              </div>
            </GlassCard>
          ))}

          {filtered.length === 0 && notSubmitted.length === 0 && (
            <GlassCard className="p-8 text-center" hover={false}>
              <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500">No students assigned or no submissions yet</p>
            </GlassCard>
          )}
        </div>
      )}

      {/* Grading Modal */}
      <GradingModal
        submission={gradingSubmission}
        assignment={assignment}
        open={!!gradingSubmission}
        onClose={() => setGradingSubmission(null)}
      />
    </div>
  );
}
