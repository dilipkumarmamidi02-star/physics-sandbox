import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Calculator, Info, BookOpen } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ResultsPanel({ experiment, results }) {
  if (!experiment) return null;

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return Math.abs(value) < 0.01 || Math.abs(value) > 10000 
        ? value.toExponential(3) 
        : value.toFixed(3);
    }
    return value;
  };

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Calculator className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Results</h3>
      </div>

      {/* Live Results */}
      {Object.keys(results).length > 0 && (
        <div className="space-y-3 mb-6">
          {Object.entries(results).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5"
            >
              <span className="text-sm text-slate-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border-0 font-mono">
                {formatValue(value)}
              </Badge>
            </motion.div>
          ))}
        </div>
      )}

      {/* Theory Section */}
      {experiment.theory && (
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Formula</span>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <code className="text-sm text-amber-200 font-mono break-all">
              {experiment.theory}
            </code>
          </div>
        </div>
      )}

      {/* Objective */}
      {experiment.objective && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 cursor-help">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-300 line-clamp-2">{experiment.objective}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs bg-slate-800 border-slate-700">
              <p className="text-sm">{experiment.objective}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </GlassCard>
  );
}
