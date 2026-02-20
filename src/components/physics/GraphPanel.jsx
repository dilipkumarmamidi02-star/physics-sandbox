import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Brush, ReferenceLine
} from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, EyeOff, ZoomIn } from 'lucide-react';

const COLORS = ['#00d4ff', '#7928ca', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#a78bfa'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-white/10 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">x = {typeof label === 'number' ? label.toFixed(4) : label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(4) : p.value}</p>
      ))}
    </div>
  );
};

export default function GraphPanel({ readings, experiment, runs = [] }) {
  const allKeys = useMemo(() => {
    if (!readings.length && !runs.length) return { inputs: [], outputs: [] };
    const src = readings.length ? readings[0] : runs[0]?.readings[0];
    if (!src) return { inputs: [], outputs: [] };
    return {
      inputs: Object.keys(src.inputs || {}),
      outputs: Object.keys(src.outputs || {})
    };
  }, [readings, runs]);

  const allVars = [...allKeys.inputs, ...allKeys.outputs];

  const [xAxis, setXAxis] = useState('');
  const [yAxes, setYAxes] = useState([]);
  const [showPoints, setShowPoints] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [chartType, setChartType] = useState('line'); // 'line' | 'scatter'

  // set defaults when data arrives
  React.useEffect(() => {
    if (allVars.length >= 2 && !xAxis) {
      setXAxis(allVars[0]);
      setYAxes([allVars[1]]);
    }
  }, [allVars.join(',')]);

  const toggleY = (key) => {
    setYAxes(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Build chart data from current readings + all saved runs
  const chartData = useMemo(() => {
    const toPoints = (rds, label) =>
      rds.map((r, i) => {
        const row = { ...r.inputs, ...r.outputs, _run: label, _idx: i };
        return row;
      });

    if (runs.length > 0) {
      return runs.map((run, ri) => ({
        label: run.label || `Run ${ri + 1}`,
        points: toPoints(run.readings, run.label || `Run ${ri + 1}`),
        color: COLORS[ri % COLORS.length]
      }));
    }
    return [{ label: 'Current', points: toPoints(readings, 'Current'), color: COLORS[0] }];
  }, [readings, runs]);

  const isEmpty = chartData.every(d => d.points.length === 0);

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Interactive Graph</h3>
        {runs.length > 0 && (
          <Badge className="bg-purple-500/20 text-purple-400">{runs.length} runs</Badge>
        )}
      </div>

      {/* Axis selectors */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">X Axis</p>
          <div className="flex flex-wrap gap-1">
            {allVars.map(k => (
              <button
                key={k}
                onClick={() => setXAxis(k)}
                className={`text-xs px-2 py-1 rounded-md border transition-all ${
                  xAxis === k
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'border-white/10 text-slate-400 hover:border-white/30'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Y Axis (multi-select)</p>
          <div className="flex flex-wrap gap-1">
            {allVars.filter(k => k !== xAxis).map((k, i) => (
              <button
                key={k}
                onClick={() => toggleY(k)}
                className={`text-xs px-2 py-1 rounded-md border transition-all`}
                style={{
                  background: yAxes.includes(k) ? `${COLORS[i]}30` : 'transparent',
                  borderColor: yAxes.includes(k) ? COLORS[i] : 'rgba(255,255,255,0.1)',
                  color: yAxes.includes(k) ? COLORS[i] : '#94a3b8'
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart controls */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={chartType === 'line' ? 'default' : 'outline'}
          className={chartType === 'line' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'border-white/10 text-slate-400'}
          onClick={() => setChartType('line')}
        >Line</Button>
        <Button
          size="sm"
          variant={chartType === 'scatter' ? 'default' : 'outline'}
          className={chartType === 'scatter' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'border-white/10 text-slate-400'}
          onClick={() => setChartType('scatter')}
        >Scatter</Button>
        <Button
          size="sm"
          variant="outline"
          className="border-white/10 text-slate-400"
          onClick={() => setShowPoints(p => !p)}
        >
          {showPoints ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
          Points
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-white/10 text-slate-400"
          onClick={() => setShowLines(p => !p)}
        >
          {showLines ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
          Lines
        </Button>
      </div>

      {/* Chart */}
      {isEmpty || !xAxis || yAxes.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-slate-500 text-sm">
          <div className="text-center">
            <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>Record data points and select axes to plot</p>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartType === 'line' ? chartData[0]?.points : undefined}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey={xAxis}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: xAxis, position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Brush dataKey={xAxis} height={20} stroke="#334155" fill="#0f172a" travellerWidth={8} />
              {chartData.map((run, ri) =>
                yAxes.map((yKey, yi) => (
                  <Line
                    key={`${ri}-${yKey}`}
                    data={run.points}
                    dataKey={yKey}
                    name={runs.length > 1 ? `${run.label} – ${yKey}` : yKey}
                    stroke={runs.length > 1 ? run.color : COLORS[yi % COLORS.length]}
                    strokeWidth={2}
                    dot={showPoints ? { r: 4, fill: runs.length > 1 ? run.color : COLORS[yi % COLORS.length] } : false}
                    activeDot={{ r: 6 }}
                    type="monotone"
                    strokeDasharray={!showLines ? '0' : undefined}
                    connectNulls
                  />
                ))
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
  import React, { useState } from 'react';
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

