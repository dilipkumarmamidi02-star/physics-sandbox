import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/ui/GlassCard';

import {
  Clock,
  Target,
  Move,
  Waves,
  Zap,
  Activity,
  Volume2,
  GitBranch,
  Ruler,
  Minus,
  Gauge,
  Triangle,
  Circle,
  Layers,
  Sun,
  Filter,
  RotateCw,
  RefreshCw,
  TrendingDown,
  Link as LinkIcon,
  Compass,
  Lightbulb,
  Sparkles,
  Rainbow,
  Grid3x3,
  Square,
  Thermometer,
  Crosshair,
  Scan,
  Atom,
  Workflow,
  Box,
  Snowflake,
  Eye,
  Cog,
  Magnet
} from 'lucide-react';

import { GRADE_INFO, CATEGORY_INFO } from './ExperimentsData';

const iconMap = {
  Clock,
  Target,
  Move,
  Waves,
  Zap,
  Activity,
  Volume2,
  GitBranch,
  Ruler,
  Minus,
  Gauge,
  Triangle,
  Circle,
  Layers,
  Sun,
  Filter,
  RotateCw,
  RefreshCw,
  TrendingDown,
  Link: LinkIcon,
  Compass,
  Lightbulb,
  Sparkles,
  Rainbow,
  Grid3x3,
  Square,
  Thermometer,
  Crosshair,
  Scan,
  Atom,
  Workflow,
  Box,
  Snowflake,
  Eye,
  Cog,
  Magnet
};

const ExperimentCard = forwardRef(({ experiment, index }, ref) => {
  const IconComponent = iconMap[experiment.icon] || Atom;

  const gradeInfo =
    GRADE_INFO[experiment.grade] || {
      color: 'from-cyan-500 to-blue-500',
      name: 'Physics'
    };

  const categoryInfo =
    CATEGORY_INFO[experiment.category] || {
      color: '#06b6d4',
      name: 'General'
    };

  const difficultyColors = {
    beginner:
      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',

    intermediate:
      'bg-amber-500/20 text-amber-400 border border-amber-500/30',

    advanced:
      'bg-red-500/20 text-red-400 border border-red-500/30'
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.5
      }}
    >
      <Link to={`/Simulator?id=${experiment.id}`}>
        <GlassCard
          className="group h-full overflow-hidden cursor-pointer"
          glow
          glowColor={
            experiment.grade === 'class11'
              ? 'green'
              : experiment.grade === 'class12'
              ? 'cyan'
              : 'purple'
          }
        >
          <div
            className={`h-1 bg-gradient-to-r ${gradeInfo.color}`}
          />

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${gradeInfo.color} shadow-lg`}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${difficultyColors[experiment.difficulty]}`}
                >
                  {experiment.difficulty}
                </Badge>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {experiment.name}
            </h3>

            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
              {experiment.description}
            </p>

            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: categoryInfo.color
                }}
              />

              <span className="text-xs text-slate-500">
                {categoryInfo.name}
              </span>

              <span className="text-slate-600">•</span>

              <span className="text-xs text-slate-500">
                {gradeInfo.name}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Start Simulation →
              </span>

              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i <
                      (experiment.difficulty === 'beginner'
                        ? 1
                        : experiment.difficulty === 'intermediate'
                        ? 2
                        : 3)
                        ? 'bg-cyan-400'
                        : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
});

ExperimentCard.displayName = 'ExperimentCard';

export default ExperimentCard;
