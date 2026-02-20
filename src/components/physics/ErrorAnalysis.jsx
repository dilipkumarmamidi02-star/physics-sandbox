import React, { useMemo, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Activity, TrendingUp, BarChart3 } from 'lucide-react';
import {
  LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

function calcStats(values) {
  if (!values.length) return null;
  const nums = values.map(Number).filter(v => !isNaN(v));
  if (!nums.length) return null;
  const n = nums.length;
  const mean = nums.reduce((a, b) => a + b, 0) / n;
  const variance = nums.reduce((s, v) => s + (v - mean) ** 2, 0) / (n > 1 ? n - 1 : 1);
  const stdDev = Math.sqrt(variance);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = max - min;
  const se = stdDev / Math.sqrt(n);
  const median = [...nums].sort((a, b) => a - b)[Math.floor(n / 2)];
  const cv = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0; // coefficient of variation
  return { mean, stdDev, variance, min, max, range, se, n, median, cv };
}

function linFit(points) {
  if (points.length < 2) return null;
  const n = points.length;
  const sx = points.reduce((a, p) => a + p.x, 0);
  const sy = points.reduce((a, p) => a + p.y, 0);
  const sxy = points.reduce((a, p) => a + p.x * p.y, 0);
  const sxx = points.reduce((a, p) => a + p.x * p.x, 0);
  const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const b = (sy - m * sx) / n;
  const yMean = sy / n;
  const ssTot = points.reduce((a, p) => a + (p.y - yMean) ** 2, 0);
  const ssRes = points.reduce((a, p) => a + (p.y - (m * p.x + b)) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;
  return { m, b, r2 };
}

function pct(measured, theoretical) {
  if (!theoretical || theoretical === 0) return null;
  return Math.abs((measured - theoretical) / theoretical) * 100;
}

const StatRow = ({ label, value, highlight, color }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
    <span className="text-slate-400 text-xs">{label}</span>
    <span className={`font-mono text-xs font-semibold ${color || (highlight ? 'text-cyan-400' : 'text-white')}`}>
      {value}
    </span>
  </div>
);

const ERROR_TYPES = [
  { id: 'standard', label: 'Standard Deviation' },
  { id: 'percentage', label: '% Error vs Theory' },
  { id: 'fit', label: 'Curve Fitting' },
  { id: 'histogram', label: 'Distribution' },
];

export default function ErrorAnalysis({ readings, experiment }) {
  const outputKeys = useMemo(() => {
    if (!readings.length) return [];
    return Object.keys(readings[0].outputs || {});
  }, [readings]);

  const inputKeys = useMemo(() => {
    if (!readings.length) return [];
    return Object.keys(readings[0].inputs || {});
  }, [readings]);

  const [selectedKey, setSelectedKey] = useState('');
  const [theoreticalValue, setTheoreticalValue] = useState('');
  const [activeType, setActiveType] = useState('standard');
  const [fitXKey, setFitXKey] = useState('');
  const [fitYKey, setFitYKey] = useState('');

  React.useEffect(() => {
    if (outputKeys.length && !selectedKey) setSelectedKey(outputKeys[0]);
    if (inputKeys.length && !fitXKey) setFitXKey(inputKeys[0]);
    if (outputKeys.length && !fitYKey) setFitYKey(outputKeys[0]);
  }, [outputKeys.join(','), inputKeys.join(',')]);

  const values = useMemo(() =>
    readings.map(r => r.outputs?.[selectedKey]).filter(v => v !== undefined && typeof v === 'number'),
    [readings, selectedKey]
  );

  const stats = calcStats(values);
  const pctErr = stats && theoreticalValue ? pct(stats.mean, parseFloat(theoreticalValue)) : null;

  // For curve fitting
  const fitPoints = useMemo(() =>
    readings.map(r => ({
      x: r.inputs?.[fitXKey] ?? r.outputs?.[fitXKey],
      y: r.inputs?.[fitYKey] ?? r.outputs?.[fitYKey]
    })).filter(p => typeof p.x === 'number' && typeof p.y === 'number'),
    [readings, fitXKey, fitYKey]
  );
  const fit = fitPoints.length >= 2 ? linFit(fitPoints) : null;
  const fitLine = fit && fitPoints.length >= 2 ? (() => {
    const xs = fitPoints.map(p => p.x);
    const x1 = Math.min(...xs), x2 = Math.max(...xs);
    return [{ x: x1, y: fit.m * x1 + fit.b }, { x: x2, y: fit.m * x2 + fit.b }];
  })() : [];

  // Histogram bins
  const histBins = useMemo(() => {
    if (!values.length || !stats) return [];
    const bins = 8;
    const bw = (stats.max - stats.min) / bins || 1;
    const counts = Array(bins).fill(0);
    values.forEach(v => {
      const i = Math.min(Math.floor((v - stats.min) / bw), bins - 1);
      counts[i]++;
    });
    return counts.map((c, i) => ({
      range: `${(stats.min + i * bw).toFixed(3)}`,
      count: c
    }));
  }, [values, stats]);

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-amber-500/10">
          <Activity className="w-5 h-5 text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Error Analysis</h3>
        <Badge className="bg-white/5 text-slate-400">{readings.length} readings</Badge>
      </div>

      {readings.length < 2 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>Record at least 2 data points for statistical analysis</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Error type tabs */}
          <div className="flex flex-wrap gap-1">
            {ERROR_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  activeType === t.id
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'border-white/10 text-slate-400 hover:border-white/30'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Standard Deviation */}
          {activeType === 'standard' && (
            <>
              <div>
                <p className="text-xs text-slate-400 mb-1.5">Analyze Variable</p>
                <div className="flex flex-wrap gap-1">
                  {outputKeys.map(k => (
                    <button key={k} onClick={() => setSelectedKey(k)}
                      className={`text-xs px-2 py-1 rounded border transition-all ${selectedKey === k ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'border-white/10 text-slate-400 hover:border-white/30'}`}>
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              {stats && (
                <div>
                  <StatRow label="N (readings)" value={stats.n} />
                  <StatRow label="Mean x̄" value={stats.mean.toFixed(6)} highlight />
                  <StatRow label="Median" value={stats.median.toFixed(6)} />
                  <StatRow label="Std Deviation σ" value={stats.stdDev.toFixed(6)} color="text-amber-400" />
                  <StatRow label="Variance σ²" value={stats.variance.toExponential(4)} />
                  <StatRow label="Std Error (SE)" value={stats.se.toFixed(6)} />
                  <StatRow label="Coeff of Variation" value={`${stats.cv.toFixed(2)}%`} />
                  <StatRow label="Min" value={stats.min.toFixed(6)} />
                  <StatRow label="Max" value={stats.max.toFixed(6)} />
                  <StatRow label="Range" value={stats.range.toFixed(6)} />
                  <div className="mt-2 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-center text-cyan-300">
                    x̄ ± σ = {stats.mean.toFixed(4)} ± {stats.stdDev.toFixed(4)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Percentage Error */}
          {activeType === 'percentage' && (
            <>
              <div>
                <p className="text-xs text-slate-400 mb-1.5">Output Variable</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {outputKeys.map(k => (
                    <button key={k} onClick={() => setSelectedKey(k)}
                      className={`text-xs px-2 py-1 rounded border transition-all ${selectedKey === k ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'border-white/10 text-slate-400 hover:border-white/30'}`}>
                      {k}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mb-1">Theoretical / Expected Value</p>
                <Input type="number" value={theoreticalValue} onChange={e => setTheoreticalValue(e.target.value)}
                  placeholder="Enter theoretical value..." className="text-sm h-8" />
              </div>
              {stats && (
                <div>
                  <StatRow label="Measured Mean x̄" value={stats.mean.toFixed(6)} highlight />
                  <StatRow label="Std Deviation σ" value={stats.stdDev.toFixed(6)} color="text-amber-400" />
                  {theoreticalValue && (
                    <>
                      <StatRow label="Theoretical Value" value={parseFloat(theoreticalValue).toFixed(6)} color="text-blue-400" />
                      <StatRow label="Absolute Error" value={Math.abs(stats.mean - parseFloat(theoreticalValue)).toFixed(6)} color="text-orange-400" />
                      {pctErr !== null && (
                        <div className="mt-3 p-3 rounded-lg bg-slate-800 border border-white/10 text-center">
                          <p className="text-slate-400 text-xs mb-1">Percentage Error</p>
                          <p className={`text-3xl font-bold ${pctErr < 2 ? 'text-green-400' : pctErr < 10 ? 'text-amber-400' : 'text-red-400'}`}>
                            {pctErr.toFixed(3)}%
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {pctErr < 2 ? '✓ Excellent accuracy' : pctErr < 10 ? '~ Acceptable accuracy' : '✗ High error – check setup'}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* Curve Fitting */}
          {activeType === 'fit' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">X Axis</p>
                  <div className="flex flex-wrap gap-1">
                    {[...inputKeys, ...outputKeys].map(k => (
                      <button key={k} onClick={() => setFitXKey(k)}
                        className={`text-xs px-2 py-1 rounded border transition-all ${fitXKey === k ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'border-white/10 text-slate-400'}`}>
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Y Axis</p>
                  <div className="flex flex-wrap gap-1">
                    {[...inputKeys, ...outputKeys].map(k => (
                      <button key={k} onClick={() => setFitYKey(k)}
                        className={`text-xs px-2 py-1 rounded border transition-all ${fitYKey === k ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'border-white/10 text-slate-400'}`}>
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {fit && (
                <div className="p-3 rounded-lg bg-slate-800 border border-white/10 text-xs space-y-1">
                  <p className="text-cyan-400 font-semibold">Linear Fit: y = mx + b</p>
                  <p className="text-white">m (slope) = <span className="font-mono">{fit.m.toFixed(5)}</span></p>
                  <p className="text-white">b (intercept) = <span className="font-mono">{fit.b.toFixed(5)}</span></p>
                  <p className={`font-semibold ${fit.r2 > 0.99 ? 'text-green-400' : fit.r2 > 0.9 ? 'text-amber-400' : 'text-red-400'}`}>
                    R² = {fit.r2.toFixed(6)} {fit.r2 > 0.99 ? '(Excellent fit)' : fit.r2 > 0.9 ? '(Good fit)' : '(Poor fit)'}
                  </p>
                </div>
              )}
              {fitPoints.length >= 2 && (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 10 }} name={fitXKey} />
                      <YAxis dataKey="y" stroke="#64748b" tick={{ fontSize: 10 }} name={fitYKey} />
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                      <Scatter data={fitPoints} fill="#00d4ff" />
                      {fitLine.length === 2 && (
                        <Line
                          data={fitLine}
                          type="linear"
                          dataKey="y"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={false}
                          strokeDasharray="5 3"
                        />
                      )}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}

          {/* Histogram */}
          {activeType === 'histogram' && (
            <>
              <div>
                <p className="text-xs text-slate-400 mb-1.5">Variable</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {outputKeys.map(k => (
                    <button key={k} onClick={() => setSelectedKey(k)}
                      className={`text-xs px-2 py-1 rounded border transition-all ${selectedKey === k ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'border-white/10 text-slate-400'}`}>
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              {histBins.length > 0 && (
                <>
                  <div className="flex gap-1 items-end h-28">
                    {histBins.map((b, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-slate-500">{b.count}</span>
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-cyan-500/60 to-purple-500/60 hover:from-cyan-400/80 hover:to-purple-400/80 transition-all"
                          style={{ height: `${histBins.length ? (b.count / Math.max(...histBins.map(x => x.count))) * 80 : 0}px`, minHeight: b.count ? '4px' : '0' }}
                          title={`${b.range}: ${b.count}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    {stats && <><span>{stats.min.toFixed(3)}</span><span className="text-cyan-400">mean: {stats.mean.toFixed(3)}</span><span>{stats.max.toFixed(3)}</span></>}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </GlassCard>
  );
}
