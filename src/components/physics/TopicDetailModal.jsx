import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Clock, Lightbulb, Globe, Star, History, Users } from 'lucide-react';

const TOPIC_CONTENT = {
  mechanics: {
    title: 'Classical Mechanics',
    history: 'Classical mechanics has roots dating back to ancient Greece, where Aristotle developed theories of motion. The field was revolutionized in the 17th century by Galileo Galilei, who first performed systematic experiments. Sir Isaac Newton synthesized these ideas into his three laws of motion in 1687 in his groundbreaking work "Principia Mathematica."',
    inventors: ['Isaac Newton (Laws of Motion, 1687)', 'Galileo Galilei (Kinematics, 1632)', 'Johannes Kepler (Planetary Laws, 1609)', 'Leonhard Euler (Analytical Mechanics, 1750)', 'Joseph-Louis Lagrange (Lagrangian Mechanics, 1788)'],
    applications: [
      'Vehicle design and crash safety analysis',
      'Satellite and rocket trajectory calculations',
      'Sports science — ball trajectories, biomechanics',
      'Bridge and building structural engineering',
      'Robotics and automated manufacturing',
      'Earthquake engineering and seismology'
    ],
    examples: [
      'A cricket ball follows a parabolic path due to projectile motion',
      'Car brakes use friction to convert kinetic energy to heat',
      'A swing operates as a simple pendulum with periodic motion',
      'The Moon orbits Earth due to gravitational centripetal force'
    ],
    advantages: 'Classical mechanics provides an extremely accurate model for objects at everyday speeds and scales. It forms the foundation for all engineering disciplines and allows precise prediction of motion, making it indispensable in design and manufacturing.',
    color: 'from-emerald-500 to-teal-500'
  },
  waves: {
    title: 'Waves & Oscillations',
    history: 'The study of waves began with early Greek philosophers. Robert Hooke and Christiaan Huygens developed wave theory in the 17th century. Jean Baptiste Joseph Fourier\'s analysis (1822) showed any wave can be expressed as a sum of sinusoids. Heinrich Hertz experimentally demonstrated electromagnetic waves in 1888.',
    inventors: ['Christiaan Huygens (Wave Theory of Light, 1678)', 'Robert Hooke (Law of Elasticity, 1660)', 'Joseph Fourier (Fourier Analysis, 1822)', 'Heinrich Hertz (EM Waves, 1888)', 'Lord Rayleigh (Acoustics, 1877)'],
    applications: [
      'Medical ultrasound imaging and sonography',
      'SONAR for submarine and ocean depth detection',
      'Musical instruments — strings, pipes, membranes',
      'Earthquake seismic wave analysis',
      'WiFi and cellular communication signals',
      'Noise-cancelling headphone technology'
    ],
    examples: [
      'Sound from a guitar string vibrating at specific frequencies',
      'Ocean waves transferring energy across the sea',
      'MRI machines use resonance phenomena',
      'Microwave ovens heat food using resonant molecular vibrations'
    ],
    advantages: 'Wave theory unifies the understanding of sound, light, seismic activity, and electromagnetic signals under a single framework. This enables technologies from medical imaging to telecommunications.',
    color: 'from-blue-500 to-indigo-500'
  },
  optics: {
    title: 'Light & Optics',
    history: 'Ancient Egyptians and Greeks studied optics, but the modern science began with Ibn al-Haytham\'s "Book of Optics" (1011 AD), which first described light as traveling in straight lines. René Descartes and Snell formalized refraction laws. Newton showed white light contains all colors (1666). Huygens proposed the wave theory, and Young\'s double slit (1801) confirmed it. Maxwell unified optics with electromagnetism (1865).',
    inventors: ['Ibn al-Haytham (Book of Optics, 1011)', 'Willebrord Snell (Snell\'s Law, 1621)', 'Isaac Newton (Optics, 1704)', 'Thomas Young (Double Slit, 1801)', 'James Clerk Maxwell (EM Theory, 1865)'],
    applications: [
      'Eyeglasses, contact lenses, and corrective surgery',
      'Telescopes, microscopes, and camera lenses',
      'Fiber optic internet communication',
      'Laser surgery (LASIK) and medical procedures',
      'Photography and cinematography',
      'Barcode scanners and CD/DVD players'
    ],
    examples: [
      'Rainbow formation — white light splitting through water droplets',
      'Mirages in deserts caused by total internal reflection',
      'A spoon appears bent in a glass of water (refraction)',
      'Optical fibers transmit internet data as light pulses'
    ],
    advantages: 'Optics is at the heart of modern communication (fiber optics), medical diagnostics (endoscopes, laser surgery), and precision measurement. It enables technologies that process and transmit information at the speed of light.',
    color: 'from-amber-500 to-orange-500'
  },
  electricity: {
    title: 'Electricity & Magnetism',
    history: 'Ancient Greeks noticed that amber rubbed with fur attracted light objects — the first observation of static electricity. Benjamin Franklin\'s kite experiment (1752) identified lightning as electricity. Alessandro Volta invented the battery (1800). André-Marie Ampère studied magnetic effects of currents (1820). Michael Faraday discovered electromagnetic induction (1831), and James Clerk Maxwell unified electricity, magnetism, and optics in his famous equations (1865).',
    inventors: ['Benjamin Franklin (Charge Concepts, 1752)', 'Alessandro Volta (Battery, 1800)', 'André-Marie Ampère (Ampere\'s Law, 1820)', 'Michael Faraday (Induction, 1831)', 'James Clerk Maxwell (EM Equations, 1865)', 'Nikola Tesla (AC Power, 1887)'],
    applications: [
      'Power generation and electrical grid distribution',
      'Electric motors in vehicles, appliances, and industry',
      'Transformers for efficient power transmission',
      'MRI and medical electrical diagnostics',
      'Computer processors and integrated circuits',
      'Wireless charging and electric vehicles'
    ],
    examples: [
      'Lightning is a massive electrostatic discharge between clouds and earth',
      'Generators in power plants convert mechanical to electrical energy via induction',
      'Your phone charges using electromagnetic induction (wireless) or Ohm\'s law circuits',
      'Household fuses use the heating effect of current for protection'
    ],
    advantages: 'Electricity and magnetism form the backbone of modern civilization. From the power grid to microchips, understanding these principles enables everything from industrial automation to the digital revolution.',
    color: 'from-yellow-500 to-amber-500'
  },
  thermodynamics: {
    title: 'Thermodynamics',
    history: 'The science of heat and temperature emerged during the Industrial Revolution. Sadi Carnot established the theoretical basis for heat engines (1824). Rudolf Clausius formulated the first and second laws of thermodynamics (1850). Lord Kelvin (William Thomson) established the absolute temperature scale. James Prescott Joule demonstrated the equivalence of heat and mechanical work. Ludwig Boltzmann connected thermodynamics to statistical mechanics (1870s).',
    inventors: ['Sadi Carnot (Heat Engines, 1824)', 'Rudolf Clausius (Laws of Thermodynamics, 1850)', 'Lord Kelvin (Temperature Scale, 1848)', 'James Joule (Mechanical Equivalent, 1843)', 'Ludwig Boltzmann (Statistical Mechanics, 1870s)'],
    applications: [
      'Steam turbines and power plant efficiency',
      'Refrigerators and air conditioning (heat pumps)',
      'Internal combustion engines (cars, aircraft)',
      'Rocket propulsion and jet engines',
      'Climate science and atmospheric modeling',
      'Material processing and metallurgy'
    ],
    examples: [
      'A refrigerator pumps heat from cold inside to warm outside',
      'A pressure cooker reaches higher temperatures using increased pressure',
      'Car engine converts fuel heat to mechanical work (~25–35% efficiency)',
      'Hot air balloons rise because warm air is less dense (buoyancy)'
    ],
    advantages: 'The laws of thermodynamics set absolute limits on energy conversion efficiency. This knowledge is critical for designing more efficient engines, power plants, and cooling systems, directly impacting energy consumption and climate change.',
    color: 'from-red-500 to-rose-500'
  },
  modern: {
    title: 'Modern Physics',
    history: 'Classical physics failed to explain several observations at the turn of the 20th century. Max Planck resolved the ultraviolet catastrophe by introducing quantum hypothesis (1900). Albert Einstein explained the photoelectric effect (1905) and proposed Special Relativity (1905) and General Relativity (1915). Niels Bohr proposed the quantum model of the atom (1913). Werner Heisenberg and Erwin Schrödinger formalized quantum mechanics (1925–1926). The Manhattan Project (1940s) led to both nuclear weapons and nuclear power.',
    inventors: ['Max Planck (Quantum Theory, 1900)', 'Albert Einstein (Relativity & Photoelectric Effect, 1905)', 'Niels Bohr (Atomic Model, 1913)', 'Werner Heisenberg (Uncertainty Principle, 1927)', 'Erwin Schrödinger (Wave Equation, 1926)', 'Marie Curie (Radioactivity, 1898)'],
    applications: [
      'Nuclear power plants generating ~10% of world electricity',
      'Medical PET scans and nuclear medicine (radioactive tracers)',
      'Semiconductors and transistors in all electronics',
      'Lasers for surgery, communication, and manufacturing',
      'GPS satellites (require relativistic corrections)',
      'Magnetic Resonance Imaging (MRI) using quantum spin'
    ],
    examples: [
      'LED lights operate on quantum energy-level transitions',
      'Radiocarbon dating uses known decay rates to date ancient artifacts',
      'Nuclear medicine uses radioactive isotopes to image and treat cancer',
      'Solar cells convert photons to electricity via photoelectric effect'
    ],
    advantages: 'Modern physics unlocks energy from atomic nuclei, enables quantum computers, and explains the fundamental structure of matter. Technologies from smartphones to medical imaging rely on quantum mechanical principles discovered in the 20th century.',
    color: 'from-purple-500 to-pink-500'
  }
};

export default function TopicDetailModal({ courseId, open, onClose }) {
  const content = TOPIC_CONTENT[courseId];
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-white/10 text-white max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${content.color}`}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            {content.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-6 pb-4">
            {/* History */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-amber-400">Historical Background</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{content.history}</p>
            </section>

            {/* Inventors */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-cyan-400">Key Inventors & Scientists</h3>
              </div>
              <div className="space-y-1.5">
                {content.inventors.map((inv, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Star className="w-3 h-3 text-cyan-400 mt-1 shrink-0" />
                    <span className="text-slate-300">{inv}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Applications */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-emerald-400">Real-Life Applications</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {content.applications.map((app, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white/5 text-sm">
                    <span className="text-emerald-400 mt-0.5 shrink-0">→</span>
                    <span className="text-slate-300">{app}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Real-Life Examples */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-purple-400" />
                <h3 className="font-semibold text-purple-400">Everyday Examples</h3>
              </div>
              <div className="space-y-2">
                {content.examples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm">
                    <span className="text-purple-400 font-bold shrink-0">{i + 1}.</span>
                    <span className="text-slate-300">{ex}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Advantages */}
            <section className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-cyan-400">Why Study This?</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{content.advantages}</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
