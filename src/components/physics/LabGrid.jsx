import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid3x3, List, Sparkles } from 'lucide-react';
import ExperimentCard from './ExperimentCard';
import { EXPERIMENTS_DATA, GRADE_INFO, CATEGORY_INFO } from './ExperimentsData';

export default function LabGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filteredExperiments = useMemo(() => {
    return EXPERIMENTS_DATA.filter(exp => {
      const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           exp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGrade === 'all' || exp.grade === selectedGrade;
      const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
      return matchesSearch && matchesGrade && matchesCategory;
    });
  }, [searchQuery, selectedGrade, selectedCategory]);

  const grades = [
    { id: 'all', name: 'All Levels', count: EXPERIMENTS_DATA.length },
    ...Object.entries(GRADE_INFO).map(([id, info]) => ({
      id,
      name: info.name,
      count: EXPERIMENTS_DATA.filter(e => e.grade === id).length,
      color: info.color
    }))
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    ...Object.entries(CATEGORY_INFO).map(([id, info]) => ({
      id,
      name: info.name,
      color: info.color
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50 focus:ring-cyan-500/20"
          />
        </div>

        {/* View toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-cyan-500 hover:bg-cyan-600' : 'border-white/10 text-slate-400 hover:text-white'}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-cyan-500 hover:bg-cyan-600' : 'border-white/10 text-slate-400 hover:text-white'}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grade Filters */}
      <div className="flex flex-wrap gap-2">
        {grades.map((grade) => (
          <Button
            key={grade.id}
            variant="outline"
            size="sm"
            onClick={() => setSelectedGrade(grade.id)}
            className={`rounded-full transition-all ${
              selectedGrade === grade.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent'
                : 'border-white/10 text-slate-400 hover:text-white hover:border-white/30'
            }`}
          >
            {grade.name}
            <Badge variant="secondary" className="ml-2 bg-white/10 text-inherit">
              {grade.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs rounded-full transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {cat.color && (
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            )}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span>Showing {filteredExperiments.length} experiments</span>
      </div>

      {/* Experiments Grid */}
      <motion.div 
        layout
        className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "flex flex-col gap-4"
        }
      >
        <AnimatePresence mode="popLayout">
          {filteredExperiments.map((experiment, index) => (
            <ExperimentCard 
              key={experiment.id} 
              experiment={experiment} 
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredExperiments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Search className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No experiments found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
}
