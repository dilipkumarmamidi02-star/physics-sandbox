import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, getDocs, doc, query, where } from 'firebase/firestore';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Play, Pause, RotateCcw, Maximize2, Minimize2, 
  Save, Atom, ChevronRight, TrendingUp
} from 'lucide-react';
import AnimatedBackground from '@/components/physics/AnimatedBackground';
import SimulatorCanvas from '@/components/physics/SimulatorCanvas';
import ControlPanel from '@/components/physics/ControlPanel';
import ResultsPanel from '@/components/physics/ResultsPanel';
import DataTable from '@/components/physics/DataTable';
import GlassCard from '@/components/ui/GlassCard';
import { EXPERIMENTS_DATA, GRADE_INFO, CATEGORY_INFO } from '@/components/physics/ExperimentsData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GraphPanel from '@/components/physics/GraphPanel';
import ErrorAnalysis from '@/components/physics/ErrorAnalysis';
import RunsManager from '@/components/physics/RunsManager';
import ExportPanel from '@/components/physics/ExportPanel';

export default function Simulator() {
  const hashSearch = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : window.location.search;
  const urlParams = new URLSearchParams(hashSearch);
  const experimentId = urlParams.get('id');
  
  const experiment = EXPERIMENTS_DATA.find(e => e.id === experimentId);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controls, setControls] = useState({});
  const [results, setResults] = useState({});
  const [readings, setReadings] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [runs, setRuns] = useState([]);
  const [analysisTab, setAnalysisTab] = useState('graph');
  const [persistRecordId, setPersistRecordId] = useState(null);
  const { user } = useAuth();
  const userEmail = user?.email || null;

  // Load persistent readings on mount
  useEffect(() => {
    if (!experiment || !userEmail) return;
    (async () => {
        try {
          const q = query(collection(db, 'persistent_readings'), where('experiment_id', '==', experiment.id), where('user_email', '==', userEmail));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const rec = { id: snap.docs[0].id, ...snap.docs[0].data() };
            setReadings(rec.readings || []);
            setPersistRecordId(rec.id);
          }
        } catch(e) {}
      })();
  }, [experiment?.id, userEmail]);

  useEffect(() => {
    if (experiment) {
      const initialControls = {};
      experiment.controls.forEach(ctrl => {
        initialControls[ctrl.id] = ctrl.default;
      });
      setControls(initialControls);
    }
  }, [experiment]);

  const handleControlChange = useCallback((id, value) => {
    setControls(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleFrame = useCallback((frameResults) => {
    setResults(frameResults);
  }, []);

  // Persist readings to DB
  const persistReadings = useCallback(async (newReadings) => {
    if (!experiment || !userEmail) return;
    if (persistRecordId) {
      await updateDoc(doc(db, 'persistent_readings', persistRecordId), { readings: newReadings });
    } else {
      const ref = await addDoc(collection(db, 'persistent_readings'), {
        experiment_id: experiment.id,
        experiment_name: experiment.name,
        user_email: userEmail,
        readings: newReadings
      });
      setPersistRecordId(ref.id);
    }
  }, [experiment, userEmail, persistRecordId]);

  const handleAddReading = useCallback(() => {
    const newReading = {
      inputs: { ...controls },
      outputs: { ...results },
      timestamp: new Date().toISOString()
    };
    const updated = [...readings, newReading];
    setReadings(updated);
    persistReadings(updated);
  }, [controls, results, readings, persistReadings]);

  const handleClearReadings = useCallback(() => {
    setReadings([]);
    if (persistRecordId) {
      updateDoc(doc(db, 'persistent_readings', persistRecordId), { readings: [] });
    }
  }, [persistRecordId]);

  const handleExport = useCallback(() => {
    if (readings.length === 0) return;
    
    const headers = ['#', ...Object.keys(readings[0].inputs), ...Object.keys(readings[0].outputs)];
    const rows = readings.map((r, i) => [
      i + 1,
      ...Object.values(r.inputs),
      ...Object.values(r.outputs)
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${experiment?.name || 'experiment'}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
    // After export, offer to clear – but don't auto-delete; user must manually clear
  }, [readings, experiment]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setResults({});
    if (experiment) {
      const initialControls = {};
      experiment.controls.forEach(ctrl => {
        initialControls[ctrl.id] = ctrl.default;
      });
      setControls(initialControls);
    }
  }, [experiment]);

  const handleToggleRun = useCallback(() => {
    if (!isRunning) {
      setStartTime(Date.now());
    }
    setIsRunning(prev => !prev);
  }, [isRunning]);

  const saveSession = useCallback(async () => {
    const user = userEmail ? { email: userEmail } : null;
    if (user && experiment) {
      await addDoc(collection(db, 'experiment_sessions'), {
        experiment_id: experiment.id,
        experiment_name: experiment.name,
        user_email: user.email,
        readings: readings,
        duration_seconds: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0,
        completed: true,
        grade: experiment.grade
      });
    }
  }, [experiment, readings, startTime]);

  if (!experiment) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <AnimatedBackground />
        <GlassCard className="p-8 text-center max-w-md mx-4 relative z-10">
          <Atom className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-bold text-white mb-2">Experiment Not Found</h2>
          <p className="text-slate-400 mb-6">
            The experiment you're looking for doesn't exist or has been removed.
          </p>
          <Link to={createPageUrl('Laboratory')}>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Laboratory
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const gradeInfo = GRADE_INFO[experiment.grade];
  const categoryInfo = CATEGORY_INFO[experiment.category];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to={createPageUrl('Laboratory')}>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`bg-gradient-to-r ${gradeInfo.color} text-white border-0 text-xs`}>
                      {gradeInfo.name}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryInfo.color }} />
                      {categoryInfo.name}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">{experiment.name}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.history.back()} className="border-white/10 text-slate-300 hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveSession}
                  className="hidden sm:flex border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="border-white/10 text-slate-400 hover:text-white"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${isFullscreen ? 'hidden' : ''}`}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Canvas & Controls Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Canvas */}
              <GlassCard className="overflow-hidden" hover={false}>
                <div className="aspect-video relative">
                  <SimulatorCanvas
                    experiment={experiment}
                    controls={controls}
                    isRunning={isRunning}
                    onFrame={handleFrame}
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.history.back()} className="border-white/10 text-slate-300 hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                      <Button
                        size="lg"
                        onClick={handleToggleRun}
                        className={isRunning 
                          ? "bg-red-500 hover:bg-red-600" 
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        }
                      >
                        {isRunning ? (
                          <>
                            <Pause className="w-5 h-5 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleReset}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>

                    <Badge className={`${isRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'} px-3 py-1`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                      {isRunning ? 'Running' : 'Paused'}
                    </Badge>
                  </div>
                </div>
              </GlassCard>

              {/* Data Table */}
              <DataTable
                readings={readings}
                onAddReading={handleAddReading}
                onClearReadings={handleClearReadings}
                onExport={handleExport}
              />

              {/* Analysis Panel – full width below canvas */}
              <div>
                <div className="flex gap-1 mb-3 bg-white/5 rounded-xl p-1 border border-white/10">
                  {[
                    { id: 'graph', label: '📈 Graph' },
                    { id: 'error', label: '📊 Error Analysis' },
                    { id: 'runs', label: '🔀 Compare Runs' },
                    { id: 'export', label: '💾 Export' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setAnalysisTab(t.id)}
                      className={`flex-1 text-xs py-2 px-2 rounded-lg font-medium transition-all ${
                        analysisTab === t.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {analysisTab === 'graph' && (
                  <GraphPanel
                    readings={readings}
                    experiment={experiment}
                    runs={runs.filter(r => r.visible)}
                  />
                )}
                {analysisTab === 'error' && (
                  <ErrorAnalysis
                    readings={readings}
                    experiment={experiment}
                  />
                )}
                {analysisTab === 'runs' && (
                  <RunsManager
                    currentReadings={readings}
                    currentControls={controls}
                    experiment={experiment}
                    runs={runs}
                    setRuns={setRuns}
                  />
                )}
                {analysisTab === 'export' && (
                  <ExportPanel
                    readings={readings}
                    experiment={experiment}
                    runs={runs}
                  />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Tabs defaultValue="controls" className="w-full">
                <TabsList className="w-full bg-white/5 border border-white/10">
                  <TabsTrigger value="controls" className="flex-1 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                    Controls
                  </TabsTrigger>
                  <TabsTrigger value="results" className="flex-1 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                    Results
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="controls" className="mt-4">
                  <ControlPanel
                    experiment={experiment}
                    controls={controls}
                    onControlChange={handleControlChange}
                  />
                </TabsContent>
                <TabsContent value="results" className="mt-4">
                  <ResultsPanel
                    experiment={experiment}
                    results={results}
                  />
                </TabsContent>
              </Tabs>

              {/* Quick Info */}
              <GlassCard className="p-4" hover={false}>
                <h4 className="text-sm font-medium text-slate-400 mb-3">About this Experiment</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {experiment.description}
                </p>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Fullscreen Mode */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-slate-950 p-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 border-white/20 text-white hover:bg-white/10"
            >
              <Minimize2 className="w-5 h-5" />
            </Button>
            <div className="w-full h-full">
              <SimulatorCanvas
                experiment={experiment}
                controls={controls}
                isRunning={isRunning}
                onFrame={handleFrame}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
