import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, Database, Download, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown, BarChart3, Filter } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import {
  Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

function calcStats(values) {
  const nums = values.filter(v => typeof v === 'number' && !isNaN(v));
  if (!nums.length) return null;
  const n = nums.length;
  const mean = nums.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(nums.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(n - 1, 1));
  return { mean, stdDev, min: Math.min(...nums), max: Math.max(...nums), n };
}

export default function DataTable({ readings, onAddReading, onClearReadings, onExport }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [filter, setFilter] = useState('');
  const [showStats, setShowStats] = useState(false);

  const formatValue = (value) => {
    if (typeof value === 'number') return value.toFixed(4);
    return String(value ?? '');
  };

  const inputKeys = readings.length > 0 ? Object.keys(readings[0].inputs || {}) : [];
  const outputKeys = readings.length > 0 ? Object.keys(readings[0].outputs || {}) : [];
  const allKeys = [...inputKeys, ...outputKeys];
  const columns = readings.length > 0 ? ['#', ...allKeys] : [];

  const getVal = (reading, key) => {
    if (reading.inputs?.[key] !== undefined) return reading.inputs[key];
    if (reading.outputs?.[key] !== undefined) return reading.outputs[key];
    return null;
  };

  const filtered = useMemo(() => {
    let rows = readings;
    if (filter.trim()) {
      rows = rows.filter(r =>
        allKeys.some(k => {
          const v = getVal(r, k);
          return String(v ?? '').toLowerCase().includes(filter.toLowerCase());
        })
      );
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const va = getVal(a, sortKey) ?? 0;
        const vb = getVal(b, sortKey) ?? 0;
        return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
      });
    }
    return rows;
  }, [readings, filter, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 text-slate-500" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-cyan-400" /> : <ArrowDown className="w-3 h-3 text-cyan-400" />;
  };

  return (
    <GlassCard className="p-6" hover={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Data Log</h3>
          <Badge className="bg-white/5 text-slate-400">{readings.length} readings</Badge>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={onAddReading} className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
            <Plus className="w-4 h-4 mr-1" /> Record
          </Button>
          {readings.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => setShowStats(!showStats)} className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
              <BarChart3 className="w-4 h-4 mr-1" /> Stats
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onExport} disabled={readings.length === 0} className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
          <Button size="sm" variant="outline" onClick={onClearReadings} disabled={readings.length === 0} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter */}
      {readings.length > 0 && (
        <div className="relative mb-4">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter readings..."
            className="pl-8 h-8 text-xs bg-white/5 border-white/10 text-white"
          />
        </div>
      )}

      {readings.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Table className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No readings recorded yet</p>
          <p className="text-sm mt-1">Click "Record" to add a data point</p>
          <p className="text-xs mt-2 text-slate-600">Data is saved persistently until you export and delete it.</p>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          {showStats && (
            <div className="mb-4 overflow-x-auto">
              <div className="min-w-max">
                <p className="text-xs text-slate-400 mb-2 font-semibold">📊 Column Statistics</p>
                <div className="flex gap-3">
                  {allKeys.map(k => {
                    const vals = filtered.map(r => getVal(r, k));
                    const s = calcStats(vals);
                    if (!s) return null;
                    const isInput = inputKeys.includes(k);
                    return (
                      <div key={k} className={`p-3 rounded-lg border text-xs min-w-32 ${isInput ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-purple-500/20 bg-purple-500/5'}`}>
                        <p className={`font-semibold mb-1 ${isInput ? 'text-cyan-400' : 'text-purple-400'}`}>{k}</p>
                        <p className="text-slate-300">Mean: <span className="font-mono">{s.mean.toFixed(4)}</span></p>
                        <p className="text-slate-400">Std: <span className="font-mono">{s.stdDev.toFixed(4)}</span></p>
                        <p className="text-slate-400">Min: <span className="font-mono">{s.min.toFixed(4)}</span></p>
                        <p className="text-slate-400">Max: <span className="font-mono">{s.max.toFixed(4)}</span></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <UITable>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  {columns.map(col => (
                    <TableHead
                      key={col}
                      className={`text-slate-400 font-medium ${col !== '#' ? 'cursor-pointer hover:text-white select-none' : ''}`}
                      onClick={col !== '#' ? () => handleSort(col) : undefined}
                    >
                      <span className="flex items-center gap-1">
                        <span className={inputKeys.includes(col) ? 'text-cyan-400' : outputKeys.includes(col) ? 'text-purple-400' : ''}>
                          {col === '#' ? '#' : col.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {col !== '#' && <SortIcon k={col} />}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((reading, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-white/5 hover:bg-white/5"
                  >
                    <TableCell className="text-slate-500">{index + 1}</TableCell>
                    {Object.values(reading.inputs || {}).map((val, i) => (
                      <TableCell key={`in-${i}`} className="text-cyan-400 font-mono">{formatValue(val)}</TableCell>
                    ))}
                    {Object.values(reading.outputs || {}).map((val, i) => (
                      <TableCell key={`out-${i}`} className="text-purple-400 font-mono">{formatValue(val)}</TableCell>
                    ))}
                  </motion.tr>
                ))}
              </TableBody>
            </UITable>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Inputs
            <span className="w-2 h-2 rounded-full bg-purple-400 ml-2" /> Outputs
            {filter && <span className="text-amber-400 ml-2">Filtered: {filtered.length}/{readings.length}</span>}
          </div>
        </>
      )}
    </GlassCard>
  );
}
