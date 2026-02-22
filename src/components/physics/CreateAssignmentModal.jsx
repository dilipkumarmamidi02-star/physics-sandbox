import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Plus, Send, Users, BookOpen, Calendar, HelpCircle } from 'lucide-react';
import { EXPERIMENTS_DATA } from '@/components/physics/ExperimentsData';

export default function CreateAssignmentModal({ open, onClose, teacherEmail, students }) {
  const queryClient = useQueryClient();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [customQuestions, setCustomQuestions] = useState(['']);
  const [form, setForm] = useState({
    title: '', experiment_id: '', description: '',
    due_date: '', max_score: 100, student_group_name: ''
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const { data: assignment, error } = await supabase.from('experiment_assignments').insert(data).select().single(); if (error) throw error;

      return assignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assignments']);
      onClose();
      setForm({ title: '', experiment_id: '', description: '', due_date: '', max_score: 100, student_group_name: '' });
      setSelectedStudents([]);
      setCustomQuestions(['']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const exp = EXPERIMENTS_DATA.find(ex => ex.id === form.experiment_id);
    mutation.mutate({
      teacher_email: teacherEmail,
      student_emails: selectedStudents,
      student_group_name: form.student_group_name,
      experiment_id: form.experiment_id,
      experiment_name: exp?.name || '',
      title: form.title,
      description: form.instructions,
      custom_questions: customQuestions.filter(q => q.trim()),
      due_date: form.due_date,
      max_score: Number(form.max_score) || 100,
      status: 'active'
    });
  };

  const toggleStudent = (email) => {
    setSelectedStudents(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const selectAll = () => setSelectedStudents(students.map(s => s.email));
  const clearAll = () => setSelectedStudents([]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Create New Assignment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Title */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Assignment Title *</label>
            <Input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Week 3 – Simple Pendulum Lab"
              className="bg-slate-800 border-white/10 text-white"
              required
            />
          </div>

          {/* Experiment */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Experiment *</label>
            <Select value={form.experiment_id} onValueChange={v => setForm(p => ({ ...p, experiment_id: v }))}>
              <SelectTrigger className="bg-slate-800 border-white/10 text-white">
                <SelectValue placeholder="Select experiment..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10 text-white max-h-60">
                {EXPERIMENTS_DATA.map(exp => (
                  <SelectItem key={exp.id} value={exp.id} className="hover:bg-slate-700">
                    {exp.name} <span className="text-slate-500 ml-1">({exp.grade})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Instructions</label>
            <Textarea
              value={form.instructions}
              onChange={e => setForm(p => ({ ...p, instructions: e.target.value }))}
              placeholder="Explain what students should do, observe, and record..."
              rows={3}
              className="bg-slate-800 border-white/10 text-white resize-none"
            />
          </div>

          {/* Custom Questions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-4 h-4" /> Questions for Students
              </label>
              <Button
                type="button" size="sm" variant="ghost"
                className="text-cyan-400 hover:text-cyan-300 text-xs"
                onClick={() => setCustomQuestions(p => [...p, ''])}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Question
              </Button>
            </div>
            <div className="space-y-2">
              {customQuestions.map((q, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={q}
                    onChange={e => {
                      const updated = [...customQuestions];
                      updated[i] = e.target.value;
                      setCustomQuestions(updated);
                    }}
                    placeholder={`Question ${i + 1}`}
                    className="bg-slate-800 border-white/10 text-white"
                  />
                  {customQuestions.length > 1 && (
                    <Button
                      type="button" size="icon" variant="ghost"
                      className="text-red-400 hover:text-red-300 shrink-0"
                      onClick={() => setCustomQuestions(p => p.filter((_, idx) => idx !== i))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Due Date & Score */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                <Calendar className="w-3 h-3 inline mr-1" /> Due Date *
              </label>
              <Input
                type="date"
                value={form.due_date}
                onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                className="bg-slate-800 border-white/10 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Max Score</label>
              <Input
                type="number" min="1" max="1000"
                value={form.max_score}
                onChange={e => setForm(p => ({ ...p, max_score: e.target.value }))}
                className="bg-slate-800 border-white/10 text-white"
              />
            </div>
          </div>

          {/* Students */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-400 flex items-center gap-1">
                <Users className="w-4 h-4" /> Assign Students
                {selectedStudents.length > 0 && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 ml-2">{selectedStudents.length} selected</Badge>
                )}
              </label>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="ghost" className="text-xs text-cyan-400" onClick={selectAll}>All</Button>
                <Button type="button" size="sm" variant="ghost" className="text-xs text-slate-400" onClick={clearAll}>Clear</Button>
              </div>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-800/50 p-3 rounded-lg border border-white/5">
              {students.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-2">No students registered yet</p>
              ) : students.map(student => (
                <label key={student.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded px-2 py-1">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.email)}
                    onChange={() => toggleStudent(student.email)}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <span className="text-sm">{student.full_name}</span>
                  <span className="text-xs text-slate-500">{student.email}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Group Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Student Group Label (optional)</label>
            <Input
              value={form.student_group_name}
              onChange={e => setForm(p => ({ ...p, student_group_name: e.target.value }))}
              placeholder="e.g. Class 12-A, Section B"
              className="bg-slate-800 border-white/10 text-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={mutation.isPending || !form.title || !form.experiment_id}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {mutation.isPending ? 'Creating...' : 'Create Assignment'}
            </Button>
            <Button type="button" variant="outline" className="border-white/10 text-slate-300" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
