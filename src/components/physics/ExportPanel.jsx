import React from 'react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';
import { Download, FileJson, FileText, BarChart3 } from 'lucide-react';

export default function ExportPanel({ readings, experiment, runs = [] }) {
  const allData = runs.length > 0
    ? runs.flatMap(run => run.readings.map(r => ({ ...r.inputs, ...r.outputs, _run: run.label })))
    : readings.map((r, i) => ({ '#': i + 1, ...r.inputs, ...r.outputs }));

  const exportCSV = () => {
    if (!allData.length) return;
    const headers = Object.keys(allData[0]);
    const rows = allData.map(r => headers.map(h => r[h] ?? '').join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    download(csv, `${experiment?.name || 'data'}_export.csv`, 'text/csv');
  };

  const exportJSON = () => {
    if (!allData.length) return;
    const payload = {
      experiment: experiment?.name,
      grade: experiment?.grade,
      exported_at: new Date().toISOString(),
      runs: runs.length > 0 ? runs.map(r => ({ label: r.label, readings: r.readings })) : [{ label: 'Current', readings }],
      summary: allData
    };
    download(JSON.stringify(payload, null, 2), `${experiment?.name || 'data'}_export.json`, 'application/json');
  };

  const exportStats = () => {
    if (!readings.length) return;
    const outputKeys = Object.keys(readings[0].outputs || {});
    const lines = ['Statistical Analysis Report', `Experiment: ${experiment?.name}`, `Date: ${new Date().toLocaleString()}`, ''];
    outputKeys.forEach(key => {
      const vals = readings.map(r => Number(r.outputs[key])).filter(v => !isNaN(v));
      if (!vals.length) return;
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const std = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, vals.length - 1));
      lines.push(`Variable: ${key}`);
      lines.push(`  N = ${vals.length}`);
      lines.push(`  Mean = ${mean.toFixed(6)}`);
      lines.push(`  Std Dev = ${std.toFixed(6)}`);
      lines.push(`  Min = ${Math.min(...vals).toFixed(6)}`);
      lines.push(`  Max = ${Math.max(...vals).toFixed(6)}`);
      lines.push('');
    });
    download(lines.join('\n'), `${experiment?.name || 'data'}_stats.txt`, 'text/plain');
  };

  function download(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  const disabled = allData.length === 0;

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <Download className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Export Data</h3>
      </div>

      <div className="space-y-2">
        <Button
          className="w-full justify-start bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
          variant="ghost"
          onClick={exportCSV}
          disabled={disabled}
        >
          <FileText className="w-4 h-4 mr-3" />
          <div className="text-left">
            <p className="text-sm font-medium">Export as CSV</p>
            <p className="text-xs text-slate-400">Raw data table, open in Excel / Sheets</p>
          </div>
        </Button>
        <Button
          className="w-full justify-start bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
          variant="ghost"
          onClick={exportJSON}
          disabled={disabled}
        >
          <FileJson className="w-4 h-4 mr-3" />
          <div className="text-left">
            <p className="text-sm font-medium">Export as JSON</p>
            <p className="text-xs text-slate-400">Structured data with metadata</p>
          </div>
        </Button>
        <Button
          className="w-full justify-start bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20"
          variant="ghost"
          onClick={exportStats}
          disabled={disabled}
        >
          <BarChart3 className="w-4 h-4 mr-3" />
          <div className="text-left">
            <p className="text-sm font-medium">Export Statistics Report</p>
            <p className="text-xs text-slate-400">Mean, std dev, variance as text</p>
          </div>
        </Button>
      </div>

      {disabled && (
        <p className="text-xs text-slate-500 text-center mt-3">Record readings to enable export</p>
      )}
    </GlassCard>
  );
}
