import React, { useState } from 'react';
export default function Learn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [detailCourse, setDetailCourse] = useState(null);

  const filteredCourses = COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <Badge className="mb-1 bg-purple-500/10 text-purple-400 border-purple-500/20">
                <Star className="w-3 h-3 mr-1" />
                Learning Hub
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Physics Courses
              </h1>
            </div>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Master physics concepts through structured courses with theory, examples, and interactive experiments.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
              <Button
                key={level}
                variant="outline"
                onClick={() => setSelectedLevel(level)}
                className={`capitalize ${
                  selectedLevel === level
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
                    : 'border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, index) => {
              const Icon = iconMap[course.icon] || Atom;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full group" glow glowColor="purple">
                    <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${course.color} shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className={`
                          ${course.level === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            course.level === 'Intermediate' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                            'bg-red-500/20 text-red-400 border-red-500/30'}
                        `}>
                          {course.level}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {course.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.topics.slice(0, 3).map(topic => (
                          <span 
                            key={topic}
                            className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400"
                          >
                            {topic}
                          </span>
                        ))}
                        {course.topics.length > 3 && (
                          <span className="text-xs px-2 py-1 text-slate-500">
                            +{course.topics.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 flex-1"
                          onClick={() => setDetailCourse(course.id)}
                        >
                          <Info className="w-4 h-4 mr-2" />
                          Learn More
                        </Button>
                        <a href={course.ncertUrl} target="_blank" rel="noopener noreferrer" title="Read NCERT Textbook">
                          <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                        <Link to={createPageUrl(`Laboratory?category=${course.id}`)}>
                          <Button className={`bg-gradient-to-r ${course.color} hover:opacity-90`}>
                            <Play className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <TopicDetailModal courseId={detailCourse} open={!!detailCourse} onClose={() => setDetailCourse(null)} />

        {/* Physics Constants Reference */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Atom className="w-5 h-5 text-cyan-400" />
              Physics Constants Reference
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(PHYSICS_CONSTANTS).slice(0, 8).map(([key, constant]) => (
                <div 
                  key={key}
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-mono text-cyan-400">{key}</span>
                    <Badge className="bg-white/5 text-slate-400 text-xs">{constant.unit}</Badge>
                  </div>
                  <p className="text-sm font-mono text-white mb-1">
                    {constant.value.toExponential(3)}
                  </p>
                  <p className="text-xs text-slate-500">{constant.name}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
