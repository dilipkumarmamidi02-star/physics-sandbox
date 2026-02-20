import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, History, Lightbulb, TrendingUp, Globe, 
  ChevronDown, ChevronUp 
} from 'lucide-react';

export default function ExperimentTheory({ experiment }) {
  const [expandedSection, setExpandedSection] = useState('theory');

  const theoryData = getTheoryData(experiment.id);

  const sections = [
    { id: 'theory', label: 'Theory', icon: BookOpen, content: theoryData.theory },
    { id: 'history', label: 'History', icon: History, content: theoryData.history },
    { id: 'applications', label: 'Applications', icon: Globe, content: theoryData.applications },
    { id: 'advantages', label: 'Advantages', icon: TrendingUp, content: theoryData.advantages },
    { id: 'realWorld', label: 'Real-World Uses', icon: Lightbulb, content: theoryData.realWorld }
  ];

  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-cyan-500" />
        Complete Theory & Background
      </h2>

      <div className="space-y-2">
        {sections.map(section => (
          <div key={section.id}>
            <Button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              variant="ghost"
              className="w-full justify-between hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <section.icon className="w-4 h-4" />
                <span>{section.label}</span>
              </div>
              {expandedSection === section.id ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </Button>

            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-white/5 rounded-lg mt-2 space-y-2 text-slate-300">
                    {Array.isArray(section.content) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {section.content.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="leading-relaxed">{section.content}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function getTheoryData(experimentId) {
  const theoryDatabase = {
    'friction': {
      theory: "Friction is the resistive force that opposes relative motion between two surfaces in contact. It arises from electromagnetic interactions between molecules at the surfaces. There are two main types: static friction (prevents motion) and kinetic friction (opposes ongoing motion). The friction force is proportional to the normal force: f = μN, where μ is the coefficient of friction.",
      history: "The systematic study of friction began with Leonardo da Vinci (1452-1519), who first noted that friction is independent of contact area. Guillaume Amontons (1699) rediscovered these laws, and Charles-Augustin de Coulomb (1785) distinguished between static and kinetic friction, establishing Coulomb's law of friction that forms the basis of modern tribology.",
      applications: [
        "Automotive braking systems - friction between brake pads and rotors",
        "Walking and running - friction between shoes and ground prevents slipping",
        "Machine design - bearings and lubricants reduce unwanted friction",
        "Rock climbing - high friction rubber on shoes and chalk on hands",
        "Writing instruments - friction between pen/pencil and paper",
        "Fasteners - nuts, bolts, and screws rely on friction to stay tight"
      ],
      advantages: [
        "Enables controlled motion and stopping of vehicles",
        "Allows us to grip and hold objects",
        "Prevents structures from sliding apart",
        "Generates heat for warming (rubbing hands)",
        "Essential for power transmission (belts, gears, clutches)",
        "Enables walking, running, and all locomotion"
      ],
      realWorld: [
        "Train wheels on rails - carefully designed friction coefficient",
        "Truck brakes - heavy-duty friction materials for stopping power",
        "Conveyor belts in factories - friction drives material movement",
        "Elevator cables - friction ensures safe operation",
        "Sports equipment - tennis racket strings, golf club grips",
        "Climbing equipment - carabiners, ropes, harnesses"
      ]
    },
    'pendulum': {
      theory: "A simple pendulum consists of a mass (bob) suspended by a massless string from a fixed point. For small angles (< 15°), it undergoes simple harmonic motion with period T = 2π√(L/g), independent of mass and amplitude. The restoring force is the component of gravity along the arc.",
      history: "Galileo Galilei (1602) discovered the isochronism of the pendulum - that period is independent of amplitude for small swings. Christiaan Huygens (1656) invented the pendulum clock and derived the exact period formula. Jean Bernard Léon Foucault (1851) used a pendulum to demonstrate Earth's rotation.",
      applications: [
        "Timekeeping - pendulum clocks were the most accurate timepieces for 300 years",
        "Seismometers - detect earthquake vibrations",
        "Metronomes - provide steady beats for musicians",
        "Foucault pendulum - demonstrates Earth's rotation",
        "Ballistic pendulum - measures projectile velocity",
        "Pendulum wave demonstration - physics education"
      ],
      advantages: [
        "Simple and inexpensive to construct",
        "Period depends only on length and gravity",
        "Excellent for demonstrating harmonic motion",
        "Can measure local gravitational acceleration",
        "Minimal energy loss in vacuum",
        "Predictable and repeatable motion"
      ],
      realWorld: [
        "Grandfather clocks in homes and museums",
        "Earthquake detection networks worldwide",
        "Construction site plumb bobs for vertical alignment",
        "Wrecking balls in demolition (damped pendulum)",
        "Playground swings follow pendulum motion",
        "Metronomes for music practice and performance"
      ]
    },
    'projectile': {
      theory: "Projectile motion is the motion of an object thrown or projected into the air, subject only to gravity. It follows a parabolic trajectory with independent horizontal (uniform) and vertical (accelerated) motion components. Range R = v²sin(2θ)/g is maximum at 45°.",
      history: "Aristotle incorrectly believed projectiles moved in straight lines then fell vertically. Galileo (1638) demonstrated that projectile motion is parabolic and established the independence of horizontal and vertical components. His work laid the foundation for Newtonian mechanics.",
      applications: [
        "Ballistics - artillery, missiles, and firearms trajectory calculation",
        "Sports - basketball arcs, football passes, javelin throws",
        "Water fountains - designing decorative water arcs",
        "Ski jumping - optimizing takeoff angle and speed",
        "Golf - understanding ball flight and optimizing drives",
        "Space mission planning - orbital insertion trajectories"
      ],
      advantages: [
        "Predicts landing point of thrown objects",
        "Optimizes range for sports and military applications",
        "Simple physics with practical importance",
        "Helps design safer structures (catch fences, nets)",
        "Essential for understanding orbital mechanics",
        "Enables accurate long-range targeting"
      ],
      realWorld: [
        "Military artillery fire control systems",
        "Basketball shot analysis and training systems",
        "Water park slide exit trajectories for safety",
        "Ski jump design and athlete safety",
        "Firefighting - water jet trajectory optimization",
        "Package delivery by drone - drop calculations"
      ]
    },
    'ohms-law': {
      theory: "Ohm's Law states that the current through a conductor is directly proportional to the voltage across it and inversely proportional to its resistance: V = IR. It's fundamental to understanding electrical circuits and applies to ohmic materials at constant temperature.",
      history: "Georg Simon Ohm (1827) published his mathematical description of electrical conduction. Initially met with skepticism, his work was later recognized as foundational. He received the Copley Medal (1841) and the ohm unit was named in his honor at the 1881 International Electrical Congress.",
      applications: [
        "Circuit design - calculating component values",
        "Power distribution - voltage drop calculations",
        "Electronic devices - resistor selection",
        "Electrical safety - fuse and breaker sizing",
        "Heating elements - toasters, ovens, water heaters",
        "LED circuits - current limiting resistors"
      ],
      advantages: [
        "Simple linear relationship for calculations",
        "Universally applicable to resistive elements",
        "Foundation for more complex circuit analysis",
        "Enables power consumption calculations (P=VI)",
        "Essential for electrical engineering",
        "Helps optimize energy efficiency"
      ],
      realWorld: [
        "Smartphone charger design and safety",
        "Home electrical wiring and circuit breakers",
        "Electric vehicle battery management systems",
        "Solar panel array sizing and optimization",
        "Industrial motor control systems",
        "Medical device power supply design"
      ]
    }
  };

  return theoryDatabase[experimentId] || {
    theory: experiment.theory || "Detailed theory content coming soon.",
    history: "Historical background will be added.",
    applications: ["Applications will be listed here."],
    advantages: ["Advantages will be described here."],
    realWorld: ["Real-world examples coming soon."]
  };
}
