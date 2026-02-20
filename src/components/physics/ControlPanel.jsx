import React from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function ControlPanel({ experiment, controls, onControlChange }) {
  if (!experiment?.controls) return null;

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <Settings2 className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Controls</h3>
      </div>

      <div className="space-y-6">
        {experiment.controls.map((ctrl, index) => {
          const value = controls[ctrl.id] ?? ctrl.default;
          
          return (
            <motion.div
              key={ctrl.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm text-slate-300">{ctrl.label}</Label>
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                  {typeof value === 'number' ? value.toFixed(ctrl.step < 1 ? 2 : 0) : value} {ctrl.unit}
                </Badge>
              </div>
              
              <Slider
                value={[value]}
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                onValueChange={([newValue]) => onControlChange(ctrl.id, newValue)}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>{ctrl.min} {ctrl.unit}</span>
                <span>{ctrl.max} {ctrl.unit}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
