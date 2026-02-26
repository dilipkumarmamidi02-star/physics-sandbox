import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  FlaskConical, Save, Plus, Trash2, ChevronDown, ChevronUp,
  BookOpen, Settings2, MessageSquare, Copy, CheckCircle2
} from 'lucide-react';
import { EXPERIMENTS_DATA } from '@/components/physics/ExperimentsData';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function TemplateBuilder() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1); // 1: select experiment, 2: customize, 3: review
  const [selectedExp, setSelectedExp] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [customObjective, setCustomObjective] = useState('');
  const [customQuestions, setCustomQuestions] = useState(['']);
  const [modifiedControls, setModifiedControls] = useState([]);
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    Promise.resolve(null).then(u => {
      setUser(u);
    }).catch(() => {});
  }, []);

  const { data: myTemplates = [] } = useQuery({
    queryKey: ['my-templates', user?.email],
    queryFn: async () => { const q = query(collection(db, 'experiment_templates'), where('teacher_email', '==', user?.email)); const snap = await getDocs(q); return snap.docs.map(d => ({id: d.id, ...d.data()})); },
    enabled: !!user?.email
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data) => { const ref = await addDoc(collection(db, 'experiment_templates'), {...data, created_at: new Date().toISOString()}); return {id: ref.id, ...data}; },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-templates']);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id) => { await deleteDoc(doc(db, 'experiment_templates', id)); },
    onSuccess: () => queryClient.invalidateQueries(['my-templates'])
  });

  const handleSelectExperiment = (exp) => {
    setSelectedExp(exp);
    setTemplateName(`${exp.name} – Custom`);
    setCustomObjective(exp.objective || '');
    setModifiedControls(exp.controls.map(c => ({ ...c })));
    setStep(2);
  };

  const updateControl = (idx, field, value) => {
    const updated = [...modifiedControls];
    updated[idx] = { ...updated[idx], [field]: value };
    setModifiedControls(updated);
  };

  const addQuestion = () => setCustomQuestions([...customQuestions, '']);
  const updateQuestion = (i, val) => {
    const q = [...customQuestions];
    q[i] = val;
    setCustomQuestions(q);
  };
  const removeQuestion = (i) => setCustomQuestions(customQuestions.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!selectedExp || !templateName || !user) return;
    createTemplateMutation.mutate({
      template_name: templateName,
      base_experiment_id: selectedExp.id,
      base_experiment_name: selectedExp.name,
      teacher_email: user.email,
      grade: selectedExp.grade,
      custom_objective: customObjective,
      custom_questions: customQuestions.filter(q => q.trim()),
      modified_controls: modifiedControls,
      is_public: false
    });
  };

  const filteredExps = EXPERIMENTS_DATA.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
              <Settings2 className="w-8 h-8 text-cyan-400" />
              Template Builder
            </h1>
            <p className="text-slate-400">Create custom experiment templates for your lesson plans</p>
          </div>
          <Link to={createPageUrl('TeacherDashboard')}>
            <Button variant="outline" className="border-slate-600">← Dashboard</Button>
          </Link>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-4 mb-8">
          {[
            { n: 1, label: 'Select Experiment' },
            { n: 2, label: 'Customize' },
            { n: 3, label: 'Save & Assign' }
          ].map(s => (
            <React.Fragment key={s.n}>
              <div
                className={`flex items-center gap-2 cursor-pointer ${step >= s.n ? 'text-cyan-400' : 'text-slate-500'}`}
                onClick={() => step > s.n && setStep(s.n)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  step > s.n ? 'bg-cyan-500 border-cyan-500 text-white' :
                  step === s.n ? 'border-cyan-400 text-cyan-400' : 'border-slate-600 text-slate-600'
                }`}>
                  {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
              </div>
              {s.n < 3 && <div className={`flex-1 h-px ${step > s.n ? 'bg-cyan-500' : 'bg-slate-700'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* STEP 1: Select Experiment */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold mb-4">Select Base Experiment</h2>
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search experiments..."
                    className="mb-4"
                  />
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {filteredExps.map(exp => (
                      <button
                        key={exp.id}
                        onClick={() => handleSelectExperiment(exp)}
                        className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{exp.name}</p>
                            <p className="text-sm text-slate-400">{exp.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 ml-4">
                            <Badge className="bg-blue-500/20 text-blue-400 text-xs">{exp.grade}</Badge>
                            <Badge className="bg-purple-500/20 text-purple-400 text-xs">{exp.category}</Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* STEP 2: Customize */}
            {step === 2 && selectedExp && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                {/* Template Name */}
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold mb-4">Template Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400 block mb-1">Template Name *</label>
                      <Input
                        value={templateName}
                        onChange={e => setTemplateName(e.target.value)}
                        placeholder="e.g. Friction Lab – Chapter 5"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 block mb-1">Custom Learning Objective</label>
                      <Textarea
                        value={customObjective}
                        onChange={e => setCustomObjective(e.target.value)}
                        rows={3}
                        placeholder="What should students achieve with this template?"
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* Control Ranges */}
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-cyan-400" />
                    Modify Control Ranges
                  </h2>
                  <p className="text-slate-400 text-sm mb-4">Set custom min/max/default values for each parameter</p>
                  <div className="space-y-4">
                    {modifiedControls.map((ctrl, idx) => (
                      <div key={ctrl.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-semibold text-cyan-300">{ctrl.label}</p>
                          <Badge className="bg-slate-700 text-slate-300">{ctrl.unit}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {['min', 'max', 'default'].map(field => (
                            <div key={field}>
                              <label className="text-xs text-slate-500 block mb-1 capitalize">{field}</label>
                              <Input
                                type="number"
                                value={ctrl[field]}
                                onChange={e => updateControl(idx, field, parseFloat(e.target.value))}
                                className="text-sm h-8"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="mt-3">
                          <label className="text-xs text-slate-500 block mb-1">Step size</label>
                          <Input
                            type="number"
                            value={ctrl.step}
                            onChange={e => updateControl(idx, 'step', parseFloat(e.target.value))}
                            className="text-sm h-8 w-28"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Custom Questions */}
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    Custom Questions
                  </h2>
                  <p className="text-slate-400 text-sm mb-4">Students must answer these after completing the experiment</p>
                  <div className="space-y-3">
                    {customQuestions.map((q, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-slate-500 text-sm mt-2 w-5 shrink-0">{i + 1}.</span>
                        <Input
                          value={q}
                          onChange={e => updateQuestion(i, e.target.value)}
                          placeholder={`Question ${i + 1}…`}
                          className="flex-1"
                        />
                        {customQuestions.length > 1 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 shrink-0"
                            onClick={() => removeQuestion(i)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" className="border-dashed border-slate-600 w-full" onClick={addQuestion}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </GlassCard>

                <div className="flex gap-3">
                  <Button variant="outline" className="border-slate-600" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                    onClick={() => setStep(3)}
                    disabled={!templateName.trim()}
                  >
                    Review & Save →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && selectedExp && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Review Template</h2>

                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="font-semibold">{templateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Experiment:</span>
                      <span>{selectedExp.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Grade:</span>
                      <Badge>{selectedExp.grade}</Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm mb-2">Custom Objective:</p>
                    <p className="bg-white/5 rounded-lg p-3 text-sm">{customObjective || 'None set'}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm mb-2">Modified Controls:</p>
                    <div className="space-y-2">
                      {modifiedControls.map(ctrl => (
                        <div key={ctrl.id} className="flex justify-between text-sm bg-white/5 rounded-lg p-2">
                          <span className="text-slate-300">{ctrl.label}</span>
                          <span className="text-cyan-400">
                            [{ctrl.min} – {ctrl.max}], default: {ctrl.default} {ctrl.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm mb-2">Questions ({customQuestions.filter(q => q.trim()).length}):</p>
                    {customQuestions.filter(q => q.trim()).map((q, i) => (
                      <p key={i} className="text-sm bg-white/5 rounded p-2 mb-1">{i + 1}. {q}</p>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="border-slate-600" onClick={() => setStep(2)}>
                      ← Edit
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                      onClick={handleSave}
                      disabled={createTemplateMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {createTemplateMutation.isPending ? 'Saving…' : saved ? '✓ Saved!' : 'Save Template'}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>

          {/* Sidebar: My Templates */}
          <div className="lg:col-span-1">
            <GlassCard className="p-5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                My Templates ({myTemplates.length})
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {myTemplates.map(tmpl => (
                  <div key={tmpl.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{tmpl.template_name}</p>
                        <p className="text-xs text-slate-400">{tmpl.base_experiment_name}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          <Badge className="bg-blue-500/20 text-blue-400 text-xs">{tmpl.grade}</Badge>
                          {tmpl.custom_questions?.length > 0 && (
                            <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                              {tmpl.custom_questions.length}Q
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 h-7 w-7 shrink-0"
                        onClick={() => deleteTemplateMutation.mutate(tmpl.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {myTemplates.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-6">
                    No templates yet.<br />Create your first one!
                  </p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
