import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen, FlaskConical, Calendar, CheckCircle2, Clock,
  Send, ArrowLeft, AlertCircle, Star, MessageSquare, FileText, BarChart2
} from 'lucide-react';
import { format, isPast } from 'date-fns';

function SubmitModal({ assignment, existingSubmission, user, open, onClose }) {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState(
    (assignment?.custom_questions || []).map(q => ({ question: q, answer: existingSubmission?.answers?.find(a => a.question === q)?.answer || '' }))
  );
  const [notes, setNotes] = useState(existingSubmission?.student_notes || '');

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      if (existingSubmission?.id) {
        await updateDoc(doc(db, 'student_submissions', existingSubmission.id), data);
      }
      await addDoc(collection(db, 'student_submissions'), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-submissions']);
      onClose();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate({
      assignment_id: assignment.id,
      student_email: user.email,
      student_name: user.full_name,
      experiment_id: assignment.experiment_id,
      experiment_name: assignment.experiment_name,
      answers,
      student_notes: notes,
      submitted_at: new Date().toISOString(),
      status: 'submitted',
      max_score: assignment.max_score || 100
    });
  };

  if (!assignment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Send className="w-5 h-5 text-cyan-400" />
            Submit Assignment
          </DialogTitle>
          <p className="text-slate-400 text-sm">{assignment.title} — {assignment.experiment_name}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {answers.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-1">
                <FileText className="w-4 h-4 text-slate-400" /> Questions
              </h4>
              {answers.map((ans, i) => (
                <div key={i}>
                  <label className="block text-sm text-slate-300 mb-1">Q{i + 1}: {ans.question}</label>
                  <Textarea
                    value={ans.answer}
                    onChange={e => {
                      const updated = [...answers];
                      updated[i] = { ...updated[i], answer: e.target.value };
                      setAnswers(updated);
                    }}
                    placeholder="Your answer..."
                    rows={3}
                    className="bg-slate-800 border-white/10 text-white resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-1 flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-slate-400" /> Conclusion / Notes
            </label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Write your conclusion, observations, and any notes from the experiment..."
              rows={4}
              className="bg-slate-800 border-white/10 text-white resize-none"
            />
          </div>

          {assignment.instructions && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-blue-300 font-medium mb-1">Assignment Instructions</p>
              <p className="text-sm text-slate-300">{assignment.instructions}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitMutation.isPending ? 'Submitting...' : existingSubmission ? 'Update Submission' : 'Submit'}
            </Button>
            <Button type="button" variant="outline" className="border-white/10 text-slate-300" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function StudentAssignments() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [submitTarget, setSubmitTarget] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    
  }, []);

  const { data: allAssignments = [] } = useQuery({
    queryKey: ['student-assignments', user?.email],
    queryFn: async () => { const snap = await getDocs(collection(db, 'experiment_assignments')); return snap.docs.map(d => ({id: d.id, ...d.data()})); },
    enabled: !!user?.email
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['my-submissions', user?.email],
    queryFn: async () => { const q = query(collection(db, 'student_submissions'), where('student_email', '==', user?.email)); const snap = await getDocs(q); return snap.docs.map(d => ({id: d.id, ...d.data()})); },
    enabled: !!user?.email
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <AnimatedBackground />
        <GlassCard className="p-8 text-center relative z-10">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
          <p className="text-slate-400">Please sign in to view your assignments.</p>
        </GlassCard>
      </div>
    );
  }

  // Only show assignments where this student is included
  const myAssignments = allAssignments.filter(a =>
    a.student_emails?.includes(user.email)
  );

  const submittedAssignmentIds = new Set(submissions.filter(s => s.status !== 'draft').map(s => s.assignment_id));
  const pending = myAssignments.filter(a => !submittedAssignmentIds.has(a.id));
  const submitted = myAssignments.filter(a => submittedAssignmentIds.has(a.id));

  const getSubmission = (assignmentId) => submissions.find(s => s.assignment_id === assignmentId);
  const getExistingSubmission = (assignmentId) => submissions.find(s => s.assignment_id === assignmentId && s.status !== 'draft');

  const renderAssignmentCard = (assignment, isSubmitted) => {
    const sub = getSubmission(assignment.id);
    const dueDateObj = assignment.due_date ? new Date(assignment.due_date) : null;
    const isOverdue = dueDateObj && isPast(dueDateObj) && !isSubmitted;

    return (
      <motion.div
        key={assignment.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-5" hover={false}>
          <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
            <div>
              <h3 className="font-bold text-white mb-1">{assignment.title}</h3>
              <div className="flex items-center gap-2 text-sm">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400">{assignment.experiment_name}</span>
                {assignment.student_group_name && (
                  <span className="text-slate-500">• {assignment.student_group_name}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {isSubmitted ? (
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Submitted
                </Badge>
              ) : (
                <Badge className={`border ${isOverdue ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                  <Clock className="w-3 h-3 mr-1" /> {isOverdue ? 'Overdue' : 'Pending'}
                </Badge>
              )}
              {sub?.status === 'graded' && sub.score != null && (
                <span className="text-emerald-400 font-bold text-sm">
                  <Star className="w-3 h-3 inline mr-1" />{sub.score}/{sub.max_score || assignment.max_score || 100}
                </span>
              )}
            </div>
          </div>

          {assignment.instructions && (
            <p className="text-sm text-slate-400 mb-3 line-clamp-2">{assignment.instructions}</p>
          )}

          {assignment.custom_questions?.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
              <FileText className="w-3 h-3" />
              {assignment.custom_questions.length} question{assignment.custom_questions.length > 1 ? 's' : ''} to answer
            </div>
          )}

          {sub?.teacher_feedback && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-3">
              <p className="text-xs text-emerald-400 font-medium mb-1">
                <MessageSquare className="w-3 h-3 inline mr-1" /> Teacher Feedback
              </p>
              <p className="text-sm text-slate-300">{sub.teacher_feedback}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {dueDateObj && (
                <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
                  <Calendar className="w-3 h-3" />
                  Due {format(dueDateObj, 'MMM d, yyyy')}
                </span>
              )}
              <span>Max {assignment.max_score || 100} pts</span>
            </div>

            <div className="flex gap-2">
              <Link to={`${createPageUrl('Simulator')}?id=${assignment.experiment_id}`}>
                <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs">
                  <FlaskConical className="w-3 h-3 mr-1" /> Run Experiment
                </Button>
              </Link>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-xs"
                onClick={() => setSubmitTarget({ assignment, existing: getExistingSubmission(assignment.id) })}
              >
                <Send className="w-3 h-3 mr-1" />
                {isSubmitted ? 'Update' : 'Submit'}
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Assignments</h1>
          <p className="text-slate-400">Complete assigned experiments and submit your results.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: myAssignments.length, color: 'text-slate-300' },
            { label: 'Pending', value: pending.length, color: 'text-amber-400' },
            { label: 'Submitted', value: submitted.length, color: 'text-green-400' }
          ].map(s => (
            <GlassCard key={s.label} className="p-4 text-center" hover={false}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </GlassCard>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800/50 border border-white/10 mb-6">
            <TabsTrigger value="pending" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Clock className="w-4 h-4 mr-2" /> Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="submitted" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Submitted ({submitted.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pending.length === 0 ? (
              <GlassCard className="p-10 text-center" hover={false}>
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-white font-semibold">All caught up!</p>
                <p className="text-slate-400 text-sm">No pending assignments.</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">{pending.map(a => renderAssignmentCard(a, false))}</div>
            )}
          </TabsContent>

          <TabsContent value="submitted">
            {submitted.length === 0 ? (
              <GlassCard className="p-10 text-center" hover={false}>
                <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400">No submissions yet. Complete an experiment and submit!</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">{submitted.map(a => renderAssignmentCard(a, true))}</div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Submit Modal */}
      {submitTarget && (
        <SubmitModal
          assignment={submitTarget.assignment}
          existingSubmission={submitTarget.existing}
          user={user}
          open={!!submitTarget}
          onClose={() => setSubmitTarget(null)}
        />
      )}
    </div>
  );
}
