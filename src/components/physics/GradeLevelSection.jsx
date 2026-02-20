import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, GraduationCap, BookOpen, Briefcase, ChevronRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { EXPERIMENTS_DATA, GRADE_INFO, CATEGORY_INFO } from './ExperimentsData';

export default function GradeLevelSection() {
  const levels = [
    {
      id: 'class11',
      title: 'Class 11',
      subtitle: 'Foundation Physics',
      description: 'Master fundamental concepts with interactive mechanics, waves, and thermodynamics experiments.',
      icon: BookOpen,
      experiments: EXPERIMENTS_DATA.filter(e => e.grade === 'class11'),
      ...GRADE_INFO.class11
    },
    {
      id: 'class12',
      title: 'Class 12',
      subtitle: 'Advanced Physics',
      description: 'Dive deeper into electricity, magnetism, optics, and modern physics concepts.',
      icon: GraduationCap,
      experiments: EXPERIMENTS_DATA.filter(e => e.grade === 'class12'),
      ...GRADE_INFO.class12
    },
    {
      id: 'btech',
      title: 'B.Tech',
      subtitle: 'Engineering Physics',
      description: 'Explore quantum mechanics, solid-state physics, and advanced engineering applications.',
      icon: Briefcase,
      experiments: EXPERIMENTS_DATA.filter(e => e.grade === 'btech'),
      ...GRADE_INFO.btech
    }
  ];

  return (
    <section className="py-20 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20 text-emerald-400">
            <GraduationCap className="w-4 h-4 mr-2" />
            For All Levels
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Learning Path
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From high school fundamentals to advanced engineering concepts - 
            we have experiments tailored for every level of physics education.
          </p>
        </motion.div>

        {/* Level Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {levels.map((level, index) => {
            const Icon = level.icon;
            const categories = [...new Set(level.experiments.map(e => e.category))];

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <GlassCard className="h-full group" hover>
                  <div className={`h-2 bg-gradient-to-r ${level.color} rounded-t-2xl`} />
                  <div className="p-8">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${level.color} shadow-lg shadow-cyan-500/20`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <Badge className="bg-white/5 border-white/10 text-white">
                        {level.experiments.length} Labs
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-1">{level.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">{level.subtitle}</p>

                    {/* Description */}
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {level.description}
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {categories.slice(0, 4).map(cat => (
                        <span 
                          key={cat}
                          className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400 flex items-center gap-1"
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: CATEGORY_INFO[cat]?.color }}
                          />
                          {CATEGORY_INFO[cat]?.name}
                        </span>
                      ))}
                      {categories.length > 4 && (
                        <span className="text-xs px-2 py-1 text-slate-500">
                          +{categories.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Sample Experiments */}
                    <div className="space-y-2 mb-6">
                      {level.experiments.slice(0, 3).map(exp => (
                        <Link 
                          key={exp.id} 
                          to={createPageUrl(`Simulator?id=${exp.id}`)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group/item"
                        >
                          <span className="text-sm text-slate-300 group-hover/item:text-cyan-400 transition-colors">
                            {exp.name}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover/item:text-cyan-400 transition-colors" />
                        </Link>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link to={createPageUrl(`Laboratory?grade=${level.id}`)}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${level.color} hover:opacity-90 text-white shadow-lg`}
                      >
                        Explore {level.title} Labs
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
