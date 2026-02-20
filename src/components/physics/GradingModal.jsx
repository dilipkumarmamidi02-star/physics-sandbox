import { entities, integrations } from '@/lib/localStore';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Star, BarChart2, MessageSquare, FileText, User } from 'lucide-react';
import { format } from 'date-fns';

function ReadingsTable({ readings }) {
  if (!readings?.length) return <p className="text-slate-500 text-sm text-center py-4">No readings recorded</p>;

  const inputKeys = Object.keys(readings[0]?.inputs || {});
  const outputKeys = Object.keys(readings[0]?.outputs || {});
  const allKeys = [...inputKeys, ...outputKeys];

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800 border-b border-white/10">
            <th className="px-3 py-2 text-left text-slate-400 font-medium">#</th>
            {inputKeys.map(k => (
              <th key={k} className="px-3 py-2 text-left text-cyan-400 font-medium">{k}</th>
            ))}
            {outputKeys.map(k => (
              <th key={k} className="px-3 py-2 text-left text-emerald-400 font-medium">{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {readings.map((r, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/3">
              <td className="px-3 py-2 text-slate-500">{i + 1}</td>
              {inputKeys.map(k => (
                <td key={k} className="px-3 py-2 text-slate-300">
                  {typeof r.inputs[k] === 'number' ? r.inputs[k].toFixed(3) : r.inputs[k]}
                </td>
              ))}
              {outputKeys.map(k => (
                <td key={k} className="px-3 py-2 text-white font-mono">
                  {typeof r.outputs[k] === 'number' ? r.outputs[k].toFixed(4) : r.outputs[k]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GradingModal({ submission, assignment, open, onClose }) {
  const queryClient = useQueryClient();
  const [score, setScore] = useState(submission?.score ?? '');
  const [feedback, setFeedback] = useState(submission?.teacher_feedback ?? '');

  const gradeMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const me = await Promise.resolve(null);
      return entities.StudentSubmission.update(id, {
        ...data,
        graded_by: me.email,
        graded_at: new Date().toISOString(),
        status: 'graded'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['submissions']);
      onClose();
    }
  });

  if (!submission) return null;

  const maxScore = assignment?.max_score || 100;
  const pct = score !== '' ? Math.round((Number(score) / maxScore) * 100) : null;
  const gradeLabel = pct === null ? '–' : pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';

  const gradeColor = pct === null ? 'text-slate-400'
    : pct >= 80 ? 'text-green-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400';

  const handleSave = () => {
    gradeMutation.mutate({
      id: submission.id,
      data: { score: Number(score), max_score: maxScore, teacher_feedback: feedback }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Grade Submission
          </DialogTitle>
          <div className="flex items-center gap-3 mt-1">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">{submission.student_name || submission.student_email}</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400">{submission.experiment_name}</span>
            {submission.submitted_at && (
              <span className="text-slate-500 text-sm">
                Submitted {format(new Date(submission.submitted_at), 'MMM d, HH:mm')}
              </span>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="data" className="mt-2">
          <TabsList className="bg-slate-800 border border-white/10">
            <TabsTrigger value="data" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <BarChart2 className="w-3 h-3 mr-1" /> Data & Readings
            </TabsTrigger>
            <TabsTrigger value="answers" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <FileText className="w-3 h-3 mr-1" /> Answers
            </TabsTrigger>
            <TabsTrigger value="grade" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <Star className="w-3 h-3 mr-1" /> Grade
            </TabsTrigger>
          </TabsList>

          {/* Data Tab */}
          <TabsContent value="data" className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Recorded Readings</h4>
              <Badge className="bg-slate-700 text-slate-300">{submission.readings?.length || 0} rows</Badge>
            </div>
            <ReadingsTable readings={submission.readings} />

            {submission.student_notes && (
              <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Student Notes / Conclusion
                </h4>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{submission.student_notes}</p>
              </div>
            )}
          </TabsContent>

          {/* Answers Tab */}
          <TabsContent value="answers" className="mt-4 space-y-4">
            {submission.answers?.length ? submission.answers.map((ans, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                <p className="text-sm font-medium text-slate-300 mb-2">Q{i + 1}: {ans.question}</p>
                <p className="text-sm text-slate-400 whitespace-pre-wrap">{ans.answer || <em className="text-slate-600">No answer provided</em>}</p>
              </div>
            )) : (
              <p className="text-slate-500 text-sm text-center py-8">No questions were part of this assignment</p>
            )}
          </TabsContent>

          {/* Grade Tab */}
          <TabsContent value="grade" className="mt-4 space-y-5">
            {/* Score */}
            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-slate-300">Score (out of {maxScore})</label>
                <div className={`text-3xl font-bold ${gradeColor}`}>{gradeLabel}</div>
              </div>

              <div className="flex items-center gap-4">
                <Input
                  type="number" min="0" max={maxScore}
                  value={score}
                  onChange={e => setScore(e.target.value)}
                  placeholder="0"
                  className="bg-slate-700 border-white/10 text-white text-xl font-bold w-28 text-center"
                />
                <span className="text-slate-500">/ {maxScore}</span>
                {pct !== null && (
                  <div className="flex-1">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs text-right text-slate-500 mt-1">{pct}%</div>
                  </div>
                )}
              </div>

              {/* Quick score buttons */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {[100, 90, 80, 70, 60, 50].map(v => (
                  <Button
                    key={v} type="button" size="sm" variant="ghost"
                    className="text-xs border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400"
                    onClick={() => setScore(Math.round((v / 100) * maxScore))}
                  >
                    {v}%
                  </Button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-slate-400" /> Feedback for Student
              </label>
              <Textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Write detailed feedback about the student's experiment, accuracy, methodology, improvements..."
                rows={5}
                className="bg-slate-800 border-white/10 text-white resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={gradeMutation.isPending || score === ''}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {gradeMutation.isPending ? 'Saving...' : 'Submit Grade'}
              </Button>
              <Button type="button" variant="outline" className="border-white/10 text-slate-300" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
