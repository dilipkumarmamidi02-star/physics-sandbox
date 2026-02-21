import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, BookOpen, FlaskConical, Search } from "lucide-react";

const EXPERIMENTS = [
  { id: "vernier-caliper", name: "Vernier Caliper", category: "Measurement", level: "Class 11", chapter: "Ch 2: Units & Measurement", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=2-2" },
  { id: "screw-gauge", name: "Screw Gauge", category: "Measurement", level: "Class 11", chapter: "Ch 2: Units & Measurement", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=2-2" },
  { id: "pendulum", name: "Simple Pendulum", category: "Mechanics", level: "Class 11", chapter: "Ch 14: Oscillations", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=14-14" },
  { id: "projectile", name: "Projectile Motion", category: "Mechanics", level: "Class 11", chapter: "Ch 4: Motion in a Plane", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=4-4" },
  { id: "friction", name: "Friction Coefficient", category: "Mechanics", level: "Class 11", chapter: "Ch 5: Laws of Motion", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=5-5" },
  { id: "springs", name: "Spring Constant (SHM)", category: "Mechanics", level: "Class 11", chapter: "Ch 14: Oscillations", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=14-14" },
  { id: "collisions", name: "Collisions", category: "Mechanics", level: "Class 11", chapter: "Ch 6: Work, Energy & Power", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=6-6" },
  { id: "youngs-modulus", name: "Youngs Modulus", category: "Mechanics", level: "Class 11", chapter: "Ch 9: Mechanical Properties of Solids", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=9-9" },
  { id: "gyroscope", name: "Gyroscope", category: "Mechanics", level: "Class 11", chapter: "Ch 7: System of Particles & Rotational Motion", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=7-7" },
  { id: "waves-string", name: "Waves on String", category: "Waves", level: "Class 11", chapter: "Ch 15: Waves", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=15-15" },
  { id: "sound-waves", name: "Sound Waves", category: "Waves", level: "Class 11", chapter: "Ch 15: Waves", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=15-15" },
  { id: "sonometer", name: "Sonometer", category: "Waves", level: "Class 11", chapter: "Ch 15: Waves", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=15-15" },
  { id: "shm-damped", name: "Damped Oscillations", category: "Waves", level: "Class 11", chapter: "Ch 14: Oscillations", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=14-14" },
  { id: "coupled-pendulum", name: "Coupled Pendulum", category: "Waves", level: "Class 11", chapter: "Ch 14: Oscillations", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=14-14" },
  { id: "ohms-law", name: "Ohms Law", category: "Electricity", level: "Class 12", chapter: "Ch 3: Current Electricity", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=3-3" },
  { id: "kirchhoff", name: "Kirchhoffs Laws", category: "Electricity", level: "Class 12", chapter: "Ch 3: Current Electricity", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=3-3" },
  { id: "potentiometer", name: "Potentiometer", category: "Electricity", level: "Class 12", chapter: "Ch 3: Current Electricity", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=3-3" },
  { id: "meter-bridge", name: "Meter Bridge", category: "Electricity", level: "Class 12", chapter: "Ch 3: Current Electricity", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=3-3" },
  { id: "galvanometer", name: "Galvanometer", category: "Electricity", level: "Class 12", chapter: "Ch 4: Moving Charges & Magnetism", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=4-4" },
  { id: "magnetic-field", name: "Magnetic Field", category: "Electricity", level: "Class 12", chapter: "Ch 5: Magnetism & Matter", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=5-5" },
  { id: "solenoid", name: "Solenoid", category: "Electricity", level: "Class 12", chapter: "Ch 4: Moving Charges & Magnetism", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=4-4" },
  { id: "em-induction", name: "Electromagnetic Induction", category: "Electricity", level: "Class 12", chapter: "Ch 6: Electromagnetic Induction", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=6-6" },
  { id: "lcr-resonance", name: "LCR Resonance", category: "Electricity", level: "Class 12", chapter: "Ch 7: Alternating Current", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=7-7" },
  { id: "pn-junction", name: "PN Junction Diode", category: "Electricity", level: "Class 12", chapter: "Ch 14: Semiconductor Electronics", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=14-14" },
  { id: "refraction", name: "Refraction through Prism", category: "Optics", level: "Class 12", chapter: "Ch 9: Ray Optics & Optical Instruments", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=9-9" },
  { id: "lens-formula", name: "Lens Formula", category: "Optics", level: "Class 12", chapter: "Ch 9: Ray Optics & Optical Instruments", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=9-9" },
  { id: "interference", name: "Wave Interference", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=10-10" },
  { id: "diffraction", name: "Diffraction", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=10-10" },
  { id: "polarization", name: "Polarization of Light", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=10-10" },
  { id: "michelson", name: "Michelson Interferometer", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=10-10" },
  { id: "laser-diffraction", name: "Laser Diffraction", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=10-10" },
  { id: "photoelectric", name: "Photoelectric Effect", category: "Modern Physics", level: "Class 12", chapter: "Ch 11: Dual Nature of Radiation & Matter", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=11-11" },
  { id: "hydrogen-spectrum", name: "Hydrogen Spectrum", category: "Modern Physics", level: "Class 12", chapter: "Ch 12: Atoms", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=12-12" },
  { id: "nuclear-decay", name: "Nuclear Decay", category: "Modern Physics", level: "Class 12", chapter: "Ch 13: Nuclei", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=13-13" },
  { id: "hall-effect", name: "Hall Effect", category: "B.Tech", level: "B.Tech", chapter: "Ch 14: Semiconductor Electronics", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=14-14" },
  { id: "compton", name: "Compton Scattering", category: "B.Tech", level: "B.Tech", chapter: "Ch 11: Dual Nature of Radiation & Matter", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=11-11" },
  { id: "xray-diffraction", name: "X-Ray Diffraction", category: "B.Tech", level: "B.Tech", chapter: "Ch 10: Wave Optics", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=10-10" },
  { id: "stefan-boltzmann", name: "Stefan-Boltzmann Law", category: "B.Tech", level: "B.Tech", chapter: "Ch 11: Thermal Properties of Matter", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=11-11" },
  { id: "quantum-tunneling", name: "Quantum Tunneling", category: "B.Tech", level: "B.Tech", chapter: "Ch 11: Dual Nature of Radiation & Matter", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=11-11" },
  { id: "wave-function", name: "Particle in a Box", category: "B.Tech", level: "B.Tech", chapter: "Ch 11: Dual Nature of Radiation & Matter", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=11-11" },
  { id: "superconductivity", name: "Superconductivity", category: "B.Tech", level: "B.Tech", chapter: "Ch 14: Semiconductor Electronics", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=14-14" },
];

const CATEGORIES = ["All", "Measurement", "Mechanics", "Waves", "Electricity", "Optics", "Modern Physics", "B.Tech"];
const LEVELS = ["All", "Class 11", "Class 12", "B.Tech"];
const categoryColors = { Measurement: "from-slate-500 to-slate-600", Mechanics: "from-emerald-500 to-teal-500", Waves: "from-blue-500 to-cyan-500", Electricity: "from-yellow-500 to-amber-500", Optics: "from-orange-500 to-red-500", "Modern Physics": "from-purple-500 to-pink-500", "B.Tech": "from-rose-500 to-red-600" };
const levelColors = { "Class 11": "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", "Class 12": "bg-blue-500/10 text-blue-400 border border-blue-500/20", "B.Tech": "bg-purple-500/10 text-purple-400 border border-purple-500/20" };

export default function Learn() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const filtered = EXPERIMENTS.filter(e => {
    const q = search.toLowerCase();
    return (e.name.toLowerCase().includes(q) || e.chapter.toLowerCase().includes(q)) &&
      (category === "All" || e.category === category) &&
      (level === "All" || e.level === level);
  });
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">NCERT Physics Learning Hub</h1>
          <p className="text-slate-400 mb-4">All 41 experiments linked directly to their NCERT chapters</p>
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 max-w-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search experiments or NCERT chapters..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder-slate-500 outline-none flex-1 text-sm" />
          </div>
        </motion.div>
        <div className="flex flex-wrap gap-2 mb-3">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={"px-3 py-1 rounded-full text-xs font-medium transition-all " + (category === c ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>{c}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={"px-3 py-1 rounded-full text-xs font-medium transition-all " + (level === l ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>{l}</button>
          ))}
        </div>
        <p className="text-slate-500 text-sm mb-4">{filtered.length} experiments found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="bg-slate-900 border border-slate-700 rounded-xl p-4 hover:border-slate-500 transition-all flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className={"w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center " + (categoryColors[exp.category] || "from-slate-500 to-slate-600")}>
                  <FlaskConical className="w-4 h-4 text-white" />
                </div>
                <span className={"text-xs px-2 py-0.5 rounded-full " + (levelColors[exp.level] || "bg-slate-700 text-slate-300")}>{exp.level}</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{exp.name}</h3>
              <p className="text-slate-500 text-xs mb-2">{exp.category}</p>
              <div className="flex items-start gap-1 text-xs text-slate-400 mb-3 flex-1">
                <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                <span>{exp.chapter}</span>
              </div>
              <div className="flex flex-col gap-2">
                <a href={exp.ncertUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-colors">
                  <BookOpen className="w-3 h-3" /> NCERT Chapter <ExternalLink className="w-3 h-3" />
                </a>
                <a href={"/#/Simulator?id=" + exp.id}
                  className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors">
                  <FlaskConical className="w-3 h-3" /> Open Simulation
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
