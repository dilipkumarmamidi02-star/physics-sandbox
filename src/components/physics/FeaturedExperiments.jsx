import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, TrendingUp, Clock, Layers, Lightbulb, Workflow, Atom } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { EXPERIMENTS_DATA, GRADE_INFO, CATEGORY_INFO } from './ExperimentsData';

const iconMap = {
  Clock, Layers, Lightbulb, Workflow, Atom
};

export default function FeaturedExperiments() {
  // Pick featured experiments - one from each grade
  const featured = [
    EXPERIMENTS_DATA.find(e => e.id === 'pendulum'),
    EXPERIMENTS_DATA.find(e => e.id === 'interference'),
    EXPERIMENTS_DATA.find(e => e.id === 'photoelectric'),
    EXPERIMENTS_DATA.find(e => e.id === 'quantum-tunneling')
  ].filter(Boolean);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-3"
            >
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-amber-400">Featured</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white mb-2"
            >
              Popular Experiments
            </motion.h2>
            <p className="text-slate-400 max-w-lg">
              Start with these most-loved experiments by students worldwide
            </p>
          </div>
          <Link to={createPageUrl('Laboratory')}>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 mt-4 md:mt-0">
              View All Experiments
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Featured Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((experiment, index) => {
            const IconComponent = iconMap[experiment.icon] || Atom;
            const gradeInfo = GRADE_INFO[experiment.grade];
            const categoryInfo = CATEGORY_INFO[experiment.category];

            return (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={createPageUrl(`Simulator?id=${experiment.id}`)}>
                  <GlassCard className="group h-full" glow glowColor={index % 2 === 0 ? 'cyan' : 'purple'}>
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradeInfo.color} shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <Badge className="bg-white/5 border-white/10 text-slate-300">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {experiment.name}
                      </h3>
                      <p className="text-slate-400 mb-4 flex-grow">
                        {experiment.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={`bg-gradient-to-r ${gradeInfo.color} text-white border-0`}>
                            {gradeInfo.name}
                          </Badge>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryInfo.color }} />
                            {categoryInfo.name}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
