import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Atom, Zap, Waves, Eye, Thermometer, Sparkles } from "lucide-react";

const COURSES = [
  {
    title: "Classical Mechanics",
    description: "Newton laws, motion, energy, momentum",
    icon: "Atom",
    color: "from-emerald-500 to-teal-500",
    topics: ["Newton Laws", "Work & Energy", "Momentum", "Rotational Motion"],
    ncertUrl: "https://ncert.nic.in/textbook.php?keph1=0-7",
    level: "Class 11"
  },
  {
    title: "Waves & Oscillations",
    description: "SHM, wave properties, sound, resonance",
    icon: "Waves",
    color: "from-blue-500 to-indigo-500",
    topics: ["Simple Harmonic Motion", "Wave Properties", "Sound Waves", "Resonance"],
    ncertUrl: "https://ncert.nic.in/textbook.php?keph2=0-6",
    level: "Class 11"
  },
  {
    title: "Light & Optics",
    description: "Reflection, refraction, lenses, wave optics",
    icon: "Eye",
    color: "from-amber-500 to-orange-500",
    topics: ["Reflection", "Refraction", "Lenses", "Wave Optics"],
    ncertUrl: "https://ncert.nic.in/textbook.php?leph1=0-10",
    level: "Class 12"
  },
  {
    title: "Electricity & Magnetism",
    description: "Electric fields, circuits, magnetic fields",
    icon: "Zap",
    color: "from-yellow-500 to-amber-500",
    topics: ["Electric Field", "Circuits", "Capacitors", "Magnetic Fields"],
    ncertUrl: "https://ncert.nic.in/textbook.php?leph1=0-10",
    level: "Class 12"
  },
  {
    title: "Thermodynamics",
    description: "Heat, temperature, laws of thermodynamics",
    icon: "Thermometer",
    color: "from-red-500 to-rose-500",
    topics: ["Heat Transfer", "Laws of Thermodynamics", "Entropy", "Heat Engines"],
    ncertUrl: "https://ncert.nic.in/textbook.php?keph2=0-6",
    level: "Class 11"
  },
  {
    title: "Modern Physics",
    description: "Quantum mechanics, nuclear physics, relativity",
    icon: "Sparkles",
    color: "from-purple-500 to-pink-500",
    topics: ["Quantum Theory", "Photoelectric Effect", "Nuclear Physics", "Relativity"],
    ncertUrl: "https://ncert.nic.in/textbook.php?leph2=0-9",
    level: "Class 12"
  }
];

const iconMap = { Atom, Waves, Eye, Zap, Thermometer, Sparkles };

export default function Learn() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Physics Learning Hub</h1>
          <p className="text-slate-400">Study theory with official NCERT textbooks, then practice with our simulations</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course, i) => {
            const Icon = iconMap[course.icon];
            return (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-slate-500 transition-all"
              >
                <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + course.color + " flex items-center justify-center mb-4"}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-slate-500 font-medium">{course.level}</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-2">{course.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.topics.map(t => (
                    <span key={t} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <a
                  href={course.ncertUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={"w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r " + course.color + " text-white text-sm font-medium hover:opacity-90 transition-opacity"}
                >
                  <BookOpen className="w-4 h-4" />
                  Read NCERT Chapter
                  <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
