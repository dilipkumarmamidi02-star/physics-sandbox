import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, BookOpen, FlaskConical, Search } from "lucide-react";

const EXPERIMENTS = [
  { id: "vernier-caliper", name: "Vernier Caliper", category: "Measurement", level: "Class 11", chapter: "Ch 2: Units and Measurement", topic: "2.6 Measurement of Length", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=2-2" },
  { id: "screw-gauge", name: "Screw Gauge (Micrometer)", category: "Measurement", level: "Class 11", chapter: "Ch 2: Units and Measurement", topic: "2.6 Measurement of Length", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=2-2" },
  { id: "projectile", name: "Projectile Motion", category: "Mechanics", level: "Class 11", chapter: "Ch 4: Motion in a Plane", topic: "4.6 Projectile Motion", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=4-4" },
  { id: "friction", name: "Friction Coefficient", category: "Mechanics", level: "Class 11", chapter: "Ch 5: Laws of Motion", topic: "5.8 Friction", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=5-5" },
  { id: "collisions", name: "Elastic and Inelastic Collisions", category: "Mechanics", level: "Class 11", chapter: "Ch 6: Work, Energy and Power", topic: "6.9 Collisions", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=6-6" },
  { id: "gyroscope", name: "Gyroscope (Rotational Motion)", category: "Mechanics", level: "Class 11", chapter: "Ch 7: System of Particles and Rotational Motion", topic: "7.7 Angular Momentum", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=7-7" },
  { id: "youngs-modulus", name: "Young's Modulus", category: "Mechanics", level: "Class 11", chapter: "Ch 9: Mechanical Properties of Solids", topic: "9.5 Elastic Moduli - Young's Modulus", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=9-9" },
  { id: "springs", name: "Spring-Mass System (SHM)", category: "Mechanics", level: "Class 11", chapter: "Ch 14: Oscillations", topic: "14.4 Simple Harmonic Motion and Spring", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=14-14" },
  { id: "pendulum", name: "Simple Pendulum", category: "Mechanics", level: "Class 11", chapter: "Ch 14: Oscillations", topic: "14.5 Simple Pendulum", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=14-14" },
  { id: "shm-damped", name: "Damped Oscillations", category: "Mechanics", level: "Class 11", chapter: "Ch 14: Oscillations", topic: "14.7 Damped Simple Harmonic Motion", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=14-14" },
  { id: "coupled-pendulum", name: "Coupled Pendulums", category: "Mechanics", level: "Class 11", chapter: "Ch 14: Oscillations", topic: "14.8 Forced Oscillations and Resonance", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=14-14" },
  { id: "waves-string", name: "Waves on a String", category: "Waves", level: "Class 11", chapter: "Ch 15: Waves", topic: "15.3 Transverse and Longitudinal Waves", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=15-15" },
  { id: "sound-waves", name: "Sound Waves and Resonance", category: "Waves", level: "Class 11", chapter: "Ch 15: Waves", topic: "15.6 Speed of a Travelling Wave", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=15-15" },
  { id: "sonometer", name: "Sonometer", category: "Waves", level: "Class 11", chapter: "Ch 15: Waves", topic: "15.7 The Principle of Superposition of Waves", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=15-15" },
  { id: "ohms-law", name: "Ohm's Law", category: "Electricity", level: "Class 12", chapter: "Ch 3: Current Electricity", topic: "3.4 Ohm's Law and its Limitations", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=3-3" },
  { id: "kirchhoff", name: "Kirchhoff's Laws", category: "Electricity", level: "Class 12", chapter: "Ch 3: Current Electricity", topic: "3.12 Kirchhoff's Rules", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=3-3" },
  { id: "meter-bridge", name: "Meter Bridge (Wheatstone)", category: "Electricity", level: "Class 12", chapter: "Ch 3: Current Electricity", topic: "3.14 Metre Bridge", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=3-3" },
  { id: "potentiometer", name: "Potentiometer", category: "Electricity", level: "Class 12", chapter: "Ch 3: Current Electricity", topic: "3.15 Potentiometer", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=3-3" },
  { id: "galvanometer", name: "Galvanometer", category: "Electricity", level: "Class 12", chapter: "Ch 4: Moving Charges and Magnetism", topic: "4.11 The Moving Coil Galvanometer", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=4-4" },
  { id: "solenoid", name: "Solenoid Magnetic Field", category: "Electricity", level: "Class 12", chapter: "Ch 4: Moving Charges and Magnetism", topic: "4.8 The Solenoid and the Toroid", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=4-4" },
  { id: "magnetic-field", name: "Bar Magnet and Magnetic Field", category: "Electricity", level: "Class 12", chapter: "Ch 5: Magnetism and Matter", topic: "5.2 The Bar Magnet", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=5-5" },
  { id: "em-induction", name: "Electromagnetic Induction", category: "Electricity", level: "Class 12", chapter: "Ch 6: Electromagnetic Induction", topic: "6.4 Faraday's Law of Induction", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=6-6" },
  { id: "lcr-resonance", name: "LCR Circuit Resonance", category: "Electricity", level: "Class 12", chapter: "Ch 7: Alternating Current", topic: "7.6 AC Voltage Applied to a Series LCR Circuit", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=7-7" },
  { id: "refraction", name: "Refraction through a Prism", category: "Optics", level: "Class 12", chapter: "Ch 9: Ray Optics and Optical Instruments", topic: "9.6 Refraction through a Prism", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=9-9" },
  { id: "lens-formula", name: "Lens Formula and Magnification", category: "Optics", level: "Class 12", chapter: "Ch 9: Ray Optics and Optical Instruments", topic: "9.5 Refraction at Spherical Surfaces and by Lenses", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=9-9" },
  { id: "interference", name: "Young's Double Slit Interference", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", topic: "10.5 Interference of Light Waves and Young's Experiment", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=10-10" },
  { id: "diffraction", name: "Single Slit Diffraction", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", topic: "10.6 Diffraction", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=10-10" },
  { id: "polarization", name: "Polarisation of Light", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", topic: "10.7 Polarisation", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=10-10" },
  { id: "michelson", name: "Michelson Interferometer", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", topic: "10.4 Coherent and Incoherent Addition of Waves", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=10-10" },
  { id: "laser-diffraction", name: "Laser Diffraction Grating", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", topic: "10.6 Diffraction", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=10-10" },
  { id: "photoelectric", name: "Photoelectric Effect", category: "Modern Physics", level: "Class 12", chapter: "Ch 11: Dual Nature of Radiation and Matter", topic: "11.3 Photoelectric Effect", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=11-11" },
  { id: "hydrogen-spectrum", name: "Hydrogen Atom Spectrum", category: "Modern Physics", level: "Class 12", chapter: "Ch 12: Atoms", topic: "12.5 The Line Spectra of the Hydrogen Atom", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=12-12" },
  { id: "nuclear-decay", name: "Radioactive Nuclear Decay", category: "Modern Physics", level: "Class 12", chapter: "Ch 13: Nuclei", topic: "13.6 Radioactivity", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=13-13" },
  { id: "pn-junction", name: "PN Junction Diode", category: "Modern Physics", level: "Class 12", chapter: "Ch 14: Semiconductor Electronics", topic: "14.5 p-n Junction and 14.6 Semiconductor Diode", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=14-14" },
  { id: "hall-effect", name: "Hall Effect", category: "B.Tech", level: "B.Tech", chapter: "Ch 14: Semiconductor Electronics", topic: "14.4 Extrinsic Semiconductor", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=14-14" },
  { id: "compton", name: "Compton Scattering", category: "B.Tech", level: "B.Tech", chapter: "Ch 11: Dual Nature of Radiation and Matter", topic: "11.7 Particle Nature of Light: The Photon", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=11-11" },
  { id: "xray-diffraction", name: "X-Ray Diffraction (Bragg's Law)", category: "B.Tech", level: "B.Tech", chapter: "Ch 10: Wave Optics", topic: "10.6 Diffraction", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=10-10" },
  { id: "stefan-boltzmann", name: "Stefan-Boltzmann Law", category: "B.Tech", level: "B.Tech", chapter: "Ch 11: Thermal Properties of Matter", topic: "11.8 Heat Transfer - Radiation", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=11-11" },
  { id: "quantum-tunneling", name: "Quantum Tunneling", category: "B.Tech", level: "B.Tech", chapter: "Ch 11: Dual Nature of Radiation and Matter", topic: "11.8 Wave Nature of Matter (de Broglie)", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=11-11" },
  { id: "wave-function", name: "Particle in a Box (Wave Function)", category: "B.Tech", level: "B.Tech", chapter: "Ch 11: Dual Nature of Radiation and Matter", topic: "11.8 Wave Nature of Matter (de Broglie)", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=11-11" },
  { id: "superconductivity", name: "Superconductivity", category: "B.Tech", level: "B.Tech", chapter: "Ch 14: Semiconductor Electronics", topic: "14.2 Classification of Metals, Conductors and Semiconductors", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=14-14" },
];

const CATEGORIES = ["All", "Measurement", "Mechanics", "Waves", "Electricity", "Optics", "Modern Physics", "B.Tech"];
const LEVELS = ["All", "Class 11", "Class 12", "B.Tech"];
const categoryColors = { Measurement: "from-slate-400 to-slate-600", Mechanics: "from-emerald-500 to-teal-600", Waves: "from-blue-500 to-cyan-600", Electricity: "from-yellow-400 to-amber-600", Optics: "from-orange-400 to-red-500", "Modern Physics": "from-purple-500 to-fuchsia-600", "B.Tech": "from-rose-500 to-red-700" };
const levelColors = { "Class 11": "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30", "Class 12": "bg-blue-500/10 text-blue-400 border border-blue-500/30", "B.Tech": "bg-purple-500/10 text-purple-400 border border-purple-500/30" };

export default function Learn() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const filtered = EXPERIMENTS.filter(e => {
    const q = search.toLowerCase();
    return (e.name.toLowerCase().includes(q) || e.chapter.toLowerCase().includes(q) || e.topic.toLowerCase().includes(q)) &&
      (category === "All" || e.category === category) && (level === "All" || e.level === level);
  });
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">NCERT Physics Learning Hub</h1>
          <p className="text-slate-400 mb-4">All {EXPERIMENTS.length} experiments strictly mapped to exact NCERT chapter and topic</p>
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input type="text" placeholder="Search by experiment, chapter or topic..." value={search}
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
                <div className={"w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 " + (categoryColors[exp.category] || "from-slate-500 to-slate-600")}>
                  <FlaskConical className="w-4 h-4 text-white" />
                </div>
                <span className={"text-xs px-2 py-0.5 rounded-full shrink-0 " + (levelColors[exp.level] || "bg-slate-700 text-slate-300")}>{exp.level}</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{exp.name}</h3>
              <p className="text-slate-500 text-xs mb-2">{exp.category}</p>
              <div className="flex-1 mb-3 space-y-1">
                <div className="flex items-start gap-1 text-xs text-cyan-400">
                  <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                  <span className="font-medium">{exp.chapter}</span>
                </div>
                <p className="text-xs text-slate-400 pl-4">{exp.topic}</p>
              </div>
              <div className="flex flex-col gap-2">
                <a href={exp.ncertUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-colors">
                  <BookOpen className="w-3 h-3" /> Read NCERT Chapter <ExternalLink className="w-3 h-3" />
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
