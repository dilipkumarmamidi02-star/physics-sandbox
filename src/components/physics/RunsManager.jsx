import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { GitCompare, Trash2, Eye, EyeOff, Save, BarChart3 } from 'lucide-react';
import {
  Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

const COLORS = ['#00d4ff', '#7928ca', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#a78bfa'];

function calcStats(values) {
  const nums = values.filter(v => typeof v === 'number' && !isNaN(v));
  if (!nums.length) return null;
  const n = nums.length;
  const mean = nums.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(nums.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(n - 1, 1));
  return { mean: mean.toFixed(5), stdDev: stdDev.toFixed(5), min: Math.min(...nums).toFixed(5), max: Math.max(...nums).toFixed(5), n };
}

export default function RunsManager({ currentReadings, currentControls, experiment, runs, setRuns }) {
  const [runLabel, setRunLabel] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const saveCurrentRun = () => {
    if (!currentReadings.length) return;
    const label = runLabel.trim() || `Run ${runs.length + 1}`;
    setRuns(prev => [...prev, {
      id: Date.now(),
      label,
      readings: currentReadings.map(r => ({ ...r })),
      controls: { ...currentControls },
      color: COLORS[runs.length % COLORS.length],
      visible: true,
      timestamp: new Date().toLocaleTimeString()
    }]);
    setRunLabel('');
  };

  const toggleVisibility = (id) => setRuns(prev => prev.map(r => r.id === id ? { ...r, visible: !r.visible } : r));
  const deleteRun = (id) => setRuns(prev => prev.filter(r => r.id !== id));

  // Build comparison table: for each output key, show mean±std per run
  const allOutputKeys = runs.length > 0 && runs[0].readings.length > 0
    ? Object.keys(runs[0].readings[0].outputs || {})
    : [];

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <GitCompare className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Run Comparison</h3>
        <Badge className="bg-white/5 text-slate-400">{runs.length} saved</Badge>
        {runs.length >= 2 && (
          <Button size="sm" variant="ghost" className="text-xs text-slate-400 ml-auto" onClick={() => setShowComparison(!showComparison)}>
            <BarChart3 className="w-3 h-3 mr-1" /> {showComparison ? 'Hide' : 'Compare Table'}
          </Button>
        )}
      </div>

      {/* Save current run */}
      <div className="flex gap-2 mb-4">
        <Input
          value={runLabel}
          onChange={e => setRunLabel(e.target.value)}
          placeholder="Run label (optional)..."
          className="text-sm h-8"
          onKeyDown={e => e.key === 'Enter' && saveCurrentRun()}
        />
        <Button
          size="sm"
          onClick={saveCurrentRun}
          disabled={!currentReadings.length}
          className="bg-gradient-to-r from-purple-500 to-pink-500 shrink-0"
        >
          <Save className="w-3 h-3 mr-1" />
          Save Run
        </Button>
      </div>

      {runs.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-4">
          Record data, then save runs to compare them on the graph
        </p>
      ) : (
        <div className="space-y-2">
          {runs.map((run) => (
            <div key={run.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: run.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: run.color }}>{run.label}</p>
                <p className="text-xs text-slate-500">{run.readings.length} pts · {run.timestamp}</p>
              </div>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toggleVisibility(run.id)}>
                {run.visible ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:text-red-300" onClick={() => deleteRun(run.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Side-by-side comparison table */}
      {showComparison && runs.length >= 2 && allOutputKeys.length > 0 && (
        <div className="mt-5">
          <p className="text-xs text-slate-400 mb-2 font-semibold">📊 Summary Statistics Comparison</p>
          <div className="overflow-x-auto">
            <UITable>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-medium text-xs">Output</TableHead>
                  {runs.map(r => (
                    <TableHead key={r.id} className="text-xs" style={{ color: r.color }}>
                      {r.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allOutputKeys.map(key => (
                  <React.Fragment key={key}>
                    <TableRow className="border-white/5 bg-white/2">
                      <TableCell colSpan={runs.length + 1} className="text-xs text-purple-400 font-semibold py-1">{key}</TableCell>
                    </TableRow>
                    {['mean', 'stdDev', 'min', 'max', 'n'].map(stat => (
                      <TableRow key={stat} className="border-white/5 hover:bg-white/5">
                        <TableCell className="text-slate-500 text-xs capitalize pl-4">{stat === 'stdDev' ? 'Std Dev' : stat}</TableCell>
                        {runs.map(r => {
                          const vals = r.readings.map(rd => rd.outputs?.[key]).filter(v => typeof v === 'number');
                          const s = calcStats(vals);
                          return (
                            <TableCell key={r.id} className="font-mono text-xs text-white">
                              {s ? s[stat] : '–'}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </UITable>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">Visible runs are overlaid in the Graph tab above</p>
        </div>
      )}
    </GlassCard>
  );
}
  import { drawPendulum } from './BaseSims';
