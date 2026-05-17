import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, BookOpen, FlaskConical, Search, FileText, Video, ChevronDown } from "lucide-react";

const EXPERIMENTS = [
  { id: "vernier-caliper", name: "Vernier Caliper", category: "Measurement", level: "Class 11", chapter: "Ch 2: Units and Measurement", topic: "2.6 Measurement of Length", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=2-2" },
  { id: "screw-gauge", name: "Screw Gauge (Micrometer)", category: "Measurement", level: "Class 11", chapter: "Ch 2: Units and Measurement", topic: "2.6 Measurement of Length", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=2-2" },
  { id: "projectile", name: "Projectile Motion", category: "Mechanics", level: "Class 11", chapter: "Ch 4: Motion in a Plane", topic: "4.6 Projectile Motion", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=4-4" },
  { id: "friction", name: "Friction Coefficient", category: "Mechanics", level: "Class 11", chapter: "Ch 5: Laws of Motion", topic: "5.8 Friction", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=5-5" },
  { id: "collisions", name: "Elastic and Inelastic Collisions", category: "Mechanics", level: "Class 11", chapter: "Ch 6: Work, Energy and Power", topic: "6.9 Collisions", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=6-6" },
  { id: "gyroscope", name: "Gyroscope (Rotational Motion)", category: "Mechanics", level: "Class 11", chapter: "Ch 7: System of Particles and Rotational Motion", topic: "7.7 Angular Momentum", ncertUrl: "https://ncert.nic.in/textbook.php?keph1=7-7" },
  { id: "youngs-modulus", name: "Young's Modulus", category: "Mechanics", level: "Class 11", chapter: "Ch 9: Mechanical Properties of Solids", topic: "9.5 Elastic Moduli", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=9-9" },
  { id: "springs", name: "Spring-Mass System (SHM)", category: "Mechanics", level: "Class 11", chapter: "Ch 14: Oscillations", topic: "14.4 Simple Harmonic Motion and Spring", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=14-14" },
  { id: "pendulum", name: "Simple Pendulum", category: "Mechanics", level: "Class 11", chapter: "Ch 14: Oscillations", topic: "14.5 Simple Pendulum", ncertUrl: "https://ncert.nic.in/textbook.php?keph2=14-14" },
  { id: "ohms-law", name: "Ohm's Law", category: "Electricity", level: "Class 12", chapter: "Ch 3: Current Electricity", topic: "3.4 Ohm's Law", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=3-3" },
  { id: "kirchhoff", name: "Kirchhoff's Laws", category: "Electricity", level: "Class 12", chapter: "Ch 3: Current Electricity", topic: "3.12 Kirchhoff's Rules", ncertUrl: "https://ncert.nic.in/textbook.php?leph1=3-3" },
  { id: "refraction", name: "Refraction through a Prism", category: "Optics", level: "Class 12", chapter: "Ch 9: Ray Optics", topic: "9.6 Refraction through a Prism", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=9-9" },
  { id: "interference", name: "Young's Double Slit", category: "Optics", level: "Class 12", chapter: "Ch 10: Wave Optics", topic: "10.5 Interference", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=10-10" },
  { id: "photoelectric", name: "Photoelectric Effect", category: "Modern Physics", level: "Class 12", chapter: "Ch 11: Dual Nature", topic: "11.3 Photoelectric Effect", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=11-11" },
  { id: "nuclear-decay", name: "Radioactive Decay", category: "Modern Physics", level: "Class 12", chapter: "Ch 13: Nuclei", topic: "13.6 Radioactivity", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=13-13" },
  { id: "pn-junction", name: "PN Junction Diode", category: "Modern Physics", level: "Class 12", chapter: "Ch 14: Semiconductor Electronics", topic: "14.5 p-n Junction", ncertUrl: "https://ncert.nic.in/textbook.php?leph2=14-14" },
];

const PAPERS = [
  // Class 12 CBSE
  { year: 2024, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2024/XII_Physics_2024.pdf" },
  { year: 2023, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2023/XII_Physics_2023.pdf" },
  { year: 2023, class: "Class 12", board: "CBSE", set: "Set 2", url: "https://cbseacademic.nic.in/web_material/QP/2023/XII_Physics_2023_S2.pdf" },
  { year: 2022, class: "Class 12", board: "CBSE", set: "Term 2", url: "https://cbseacademic.nic.in/web_material/QP/2022/XII_Physics_T2_2022.pdf" },
  { year: 2022, class: "Class 12", board: "CBSE", set: "Term 1", url: "https://cbseacademic.nic.in/web_material/QP/2022/XII_Physics_T1_2022.pdf" },
  { year: 2020, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2020/XII_Physics_2020.pdf" },
  { year: 2019, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2019/XII_Physics_2019.pdf" },
  { year: 2019, class: "Class 12", board: "CBSE", set: "Set 2", url: "https://cbseacademic.nic.in/web_material/QP/2019/XII_Physics_2019_S2.pdf" },
  { year: 2018, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2018/XII_Physics_2018.pdf" },
  { year: 2017, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2017/XII_Physics_2017.pdf" },
  { year: 2016, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2016/XII_Physics_2016.pdf" },
  { year: 2015, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2015/XII_Physics_2015.pdf" },
  { year: 2014, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2014/XII_Physics_2014.pdf" },
  { year: 2013, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2013/XII_Physics_2013.pdf" },
  { year: 2012, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2012/XII_Physics_2012.pdf" },
  { year: 2011, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2011/XII_Physics_2011.pdf" },
  { year: 2010, class: "Class 12", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2010/XII_Physics_2010.pdf" },
  // Class 12 Sample Papers
  { year: 2024, class: "Class 12", board: "CBSE Sample", set: "Sample", url: "https://cbseacademic.nic.in/SQP/2023-24/XII_Physics_SQP.pdf" },
  { year: 2023, class: "Class 12", board: "CBSE Sample", set: "Sample", url: "https://cbseacademic.nic.in/SQP/2022-23/XII_Physics_SQP.pdf" },
  { year: 2022, class: "Class 12", board: "CBSE Sample", set: "Sample", url: "https://cbseacademic.nic.in/SQP/2021-22/XII_Physics_SQP.pdf" },
  // Class 11 CBSE
  { year: 2024, class: "Class 11", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2024/XI_Physics_2024.pdf" },
  { year: 2023, class: "Class 11", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2023/XI_Physics_2023.pdf" },
  { year: 2022, class: "Class 11", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2022/XI_Physics_2022.pdf" },
  { year: 2021, class: "Class 11", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2021/XI_Physics_2021.pdf" },
  { year: 2020, class: "Class 11", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2020/XI_Physics_2020.pdf" },
  { year: 2019, class: "Class 11", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2019/XI_Physics_2019.pdf" },
  { year: 2018, class: "Class 11", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2018/XI_Physics_2018.pdf" },
  { year: 2017, class: "Class 11", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2017/XI_Physics_2017.pdf" },
  { year: 2016, class: "Class 11", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2016/XI_Physics_2016.pdf" },
  { year: 2015, class: "Class 11", board: "CBSE", set: "Set 1", url: "https://cbseacademic.nic.in/web_material/QP/2015/XI_Physics_2015.pdf" },
  // JEE
  { year: 2024, class: "JEE Main", board: "NTA", set: "Jan Session", url: "https://jeemain.nta.ac.in/webinfo/Public/GetSampleQP.aspx" },
  { year: 2023, class: "JEE Main", board: "NTA", set: "Jan Session", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2023_JAN_SHIFT1_Physics.pdf" },
  { year: 2022, class: "JEE Main", board: "NTA", set: "Session 1", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2022_JEE_Physics.pdf" },
  { year: 2021, class: "JEE Main", board: "NTA", set: "Feb Session", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2021_JEE_Physics.pdf" },
  { year: 2020, class: "JEE Main", board: "NTA", set: "Jan Session", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2020_JEE_Physics.pdf" },
  { year: 2019, class: "JEE Main", board: "NTA", set: "Jan Session", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2019_JEE_Physics.pdf" },
  { year: 2024, class: "JEE Advanced", board: "IIT", set: "Paper 1", url: "https://jeeadv.ac.in/past_qps/2024/1/EN.pdf" },
  { year: 2023, class: "JEE Advanced", board: "IIT", set: "Paper 1", url: "https://jeeadv.ac.in/past_qps/2023/1/EN.pdf" },
  { year: 2022, class: "JEE Advanced", board: "IIT", set: "Paper 1", url: "https://jeeadv.ac.in/past_qps/2022/1/EN.pdf" },
  { year: 2021, class: "JEE Advanced", board: "IIT", set: "Paper 1", url: "https://jeeadv.ac.in/past_qps/2021/1/EN.pdf" },
  { year: 2020, class: "JEE Advanced", board: "IIT", set: "Paper 1", url: "https://jeeadv.ac.in/past_qps/2020/1/EN.pdf" },
  { year: 2019, class: "JEE Advanced", board: "IIT", set: "Paper 1", url: "https://jeeadv.ac.in/past_qps/2019/1/EN.pdf" },
  { year: 2018, class: "JEE Advanced", board: "IIT", set: "Paper 1", url: "https://jeeadv.ac.in/past_qps/2018/1/EN.pdf" },
  { year: 2017, class: "JEE Advanced", board: "IIT", set: "Paper 1", url: "https://jeeadv.ac.in/past_qps/2017/1/en.pdf" },
  { year: 2016, class: "JEE Advanced", board: "IIT", set: "Paper 1", url: "https://jeeadv.ac.in/past_qps/2016/1/en.pdf" },
  { year: 2024, class: "JEE Advanced", board: "IIT", set: "Paper 2", url: "https://jeeadv.ac.in/past_qps/2024/2/EN.pdf" },
  { year: 2023, class: "JEE Advanced", board: "IIT", set: "Paper 2", url: "https://jeeadv.ac.in/past_qps/2023/2/EN.pdf" },
  { year: 2022, class: "JEE Advanced", board: "IIT", set: "Paper 2", url: "https://jeeadv.ac.in/past_qps/2022/2/EN.pdf" },
  // NEET
  { year: 2024, class: "NEET", board: "NTA", set: "Physics Section", url: "https://neet.nta.nic.in/webinfo/Public/GetSampleQP.aspx" },
  { year: 2023, class: "NEET", board: "NTA", set: "Physics Section", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2023_NEET_Physics.pdf" },
  { year: 2022, class: "NEET", board: "NTA", set: "Physics Section", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2022_NEET_Physics.pdf" },
  { year: 2021, class: "NEET", board: "NTA", set: "Physics Section", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2021_NEET_Physics.pdf" },
  { year: 2020, class: "NEET", board: "NTA", set: "Physics Section", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2020_NEET_Physics.pdf" },
  { year: 2019, class: "NEET", board: "NTA", set: "Physics Section", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2019_NEET_Physics.pdf" },
  { year: 2018, class: "NEET", board: "NTA", set: "Physics Section", url: "https://cdn.digialm.com/EForms/configuredHtml/1258/84258/Exam/PdfQuestion/2018_NEET_Physics.pdf" },
];

const PAPER_CLASSES = ["All", "Class 11", "Class 12", "JEE Main", "JEE Advanced", "NEET"];
const CATEGORIES = ["All", "Measurement", "Mechanics", "Waves", "Electricity", "Optics", "Modern Physics"];
const LEVELS = ["All", "Class 11", "Class 12", "B.Tech"];
const categoryColors = { Measurement: "from-slate-400 to-slate-600", Mechanics: "from-emerald-500 to-teal-600", Waves: "from-blue-500 to-cyan-600", Electricity: "from-yellow-400 to-amber-600", Optics: "from-orange-400 to-red-500", "Modern Physics": "from-purple-500 to-fuchsia-600" };
const levelColors = { "Class 11": "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30", "Class 12": "bg-blue-500/10 text-blue-400 border border-blue-500/30", "B.Tech": "bg-purple-500/10 text-purple-400 border border-purple-500/30" };
const boardColors = { "CBSE": "bg-blue-500/10 text-blue-400", "CBSE Sample": "bg-cyan-500/10 text-cyan-400", "NTA": "bg-green-500/10 text-green-400", "IIT": "bg-orange-500/10 text-orange-400" };

export default function Learn() {
  const [tab, setTab] = useState("experiments");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [paperClass, setPaperClass] = useState("All");
  const [paperSearch, setPaperSearch] = useState("");

  const filtered = EXPERIMENTS.filter(e => {
    const q = search.toLowerCase();
    return (e.name.toLowerCase().includes(q) || e.chapter.toLowerCase().includes(q)) &&
      (category === "All" || e.category === category) && (level === "All" || e.level === level);
  });

  const filteredPapers = PAPERS.filter(p =>
    (paperClass === "All" || p.class === paperClass) &&
    (paperSearch === "" || p.year.toString().includes(paperSearch) || p.board.toLowerCase().includes(paperSearch.toLowerCase()))
  ).sort((a, b) => b.year - a.year);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-1">Physics Learning Hub</h1>
          <p className="text-slate-400">NCERT experiments + Previous year papers from CBSE, JEE & NEET</p>
        </motion.div>

        <div className="flex gap-2 mb-6 border-b border-slate-700 pb-0">
          {[["experiments", "🔬 Experiments & NCERT"], ["papers", "📄 Previous Year Papers"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={"px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all " + (tab === key ? "bg-cyan-500 text-white" : "text-slate-400 hover:text-white")}>
              {label}
            </button>
          ))}
        </div>

        {tab === "experiments" && (
          <>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 max-w-lg mb-4">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input type="text" placeholder="Search experiments..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-white placeholder-slate-500 outline-none flex-1 text-sm" />
            </div>
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
                  <div className="flex-1 mb-3">
                    <div className="flex items-start gap-1 text-xs text-cyan-400">
                      <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="font-medium">{exp.chapter}</span>
                    </div>
                    <p className="text-xs text-slate-400 pl-4 mt-1">{exp.topic}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={exp.ncertUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-colors">
                      <BookOpen className="w-3 h-3" /> Read NCERT <ExternalLink className="w-3 h-3" />
                    </a>
                    <a href={"/#/Simulator?id=" + exp.id}
                      className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors">
                      <FlaskConical className="w-3 h-3" /> Open Simulation
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {tab === "papers" && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {PAPER_CLASSES.map(c => (
                <button key={c} onClick={() => setPaperClass(c)}
                  className={"px-3 py-1.5 rounded-full text-xs font-semibold transition-all " + (paperClass === c ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>{c}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 max-w-sm mb-6">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by year or board..." value={paperSearch} onChange={e => setPaperSearch(e.target.value)}
                className="bg-transparent text-white placeholder-slate-500 outline-none flex-1 text-sm" />
            </div>
            <p className="text-slate-500 text-sm mb-4">{filteredPapers.length} papers found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPapers.map((paper, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/40 transition-all flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg leading-none">{paper.year}</p>
                        <p className="text-slate-400 text-xs">{paper.set}</p>
                      </div>
                    </div>
                    <span className={"text-xs px-2 py-1 rounded-full font-medium " + (boardColors[paper.board] || "bg-slate-700 text-slate-300")}>{paper.board}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{paper.class} Physics</p>
                    <p className="text-slate-400 text-xs">{paper.board} — {paper.set}</p>
                  </div>
                  <a href={paper.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm hover:bg-cyan-500/20 transition-colors font-medium">
                    <FileText className="w-4 h-4" /> Open Paper <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
