export const EXPERIMENTS_DATA = [
  // ============ MEASUREMENT INSTRUMENTS ============
  {
    id: "vernier-caliper",
    name: "Vernier Caliper",
    grade: "class11",
    category: "mechanics",
    icon: "Ruler",
    description: "Measure precise dimensions using Vernier caliper with zero error corrections",
    objective: "To measure diameter of sphere/rod and calculate volume using Vernier caliper",
    difficulty: "beginner",
    controls: [
      { id: "objectSize", label: "Object Size", min: 0.5, max: 25, step: 0.1, unit: "mm", default: 2.3 },
      { id: "lcDivisions", label: "Vernier Divisions", min: 5, max: 50, step: 5, unit: "div", default: 10 },
      { id: "zeroError", label: "Zero Error (+/−)", min: -3, max: 3, step: 1, unit: "div", default: 0 }
    ],
    theory: "LC = 1 MSD − 1 VSD. Reading = MSR + (coinciding VSR × LC). Corrected = Reading − Zero Error"
  },
  {
    id: "screw-gauge",
    name: "Screw Gauge",
    grade: "class11",
    category: "mechanics",
    icon: "Settings",
    description: "Measure wire diameter using screw gauge (micrometer) with pitch and LC calculations",
    objective: "To measure diameter of a thin wire and find its cross-sectional area",
    difficulty: "beginner",
    controls: [
      { id: "pitch", label: "Pitch", min: 0.5, max: 1, step: 0.1, unit: "mm", default: 0.5 },
      { id: "thimbleDivisions", label: "Thimble Divisions", min: 50, max: 100, step: 10, unit: "div", default: 50 },
      { id: "objectDiameter", label: "Wire Diameter", min: 0.1, max: 5, step: 0.01, unit: "mm", default: 1.24 },
      { id: "zeroError", label: "Zero Error (+/−)", min: -5, max: 5, step: 1, unit: "div", default: 0 }
    ],
    theory: "LC = Pitch / Thimble Divisions. Reading = MSR + (CSR × LC). Corrected = Reading − Zero Error"
  },
  // ============ CLASS 11 EXPERIMENTS ============
  {
    id: "pendulum",
    name: "Simple Pendulum",
    grade: "class11",
    category: "mechanics",
    icon: "Clock",
    description: "Study oscillatory motion and measure acceleration due to gravity",
    objective: "To determine the value of 'g' using a simple pendulum",
    difficulty: "beginner",
    controls: [
      { id: "length", label: "Length", min: 0.1, max: 2, step: 0.1, unit: "m", default: 1 },
      { id: "angle", label: "Initial Angle", min: 5, max: 30, step: 1, unit: "°", default: 15 },
      { id: "gravity", label: "Gravity", min: 1, max: 20, step: 0.1, unit: "m/s²", default: 9.8 }
    ],
    formulas: {
      period: (L, g) => 2 * Math.PI * Math.sqrt(L / g),
      frequency: (T) => 1 / T
    },
    theory: "T = 2π√(L/g) where T is period, L is length, g is acceleration due to gravity"
  },
  {
    id: "projectile",
    name: "Projectile Motion",
    grade: "class11",
    category: "mechanics",
    icon: "Target",
    description: "Analyze trajectory of objects under gravity",
    objective: "To study the parabolic path of a projectile and verify range formula",
    difficulty: "beginner",
    controls: [
      { id: "velocity", label: "Initial Velocity", min: 5, max: 50, step: 1, unit: "m/s", default: 20 },
      { id: "angle", label: "Launch Angle", min: 10, max: 80, step: 1, unit: "°", default: 45 },
      { id: "height", label: "Initial Height", min: 0, max: 20, step: 0.5, unit: "m", default: 0 }
    ],
    formulas: {
      range: (v, θ, g) => (v * v * Math.sin(2 * θ * Math.PI / 180)) / g,
      maxHeight: (v, θ, g) => (v * v * Math.sin(θ * Math.PI / 180) ** 2) / (2 * g),
      timeOfFlight: (v, θ, g) => (2 * v * Math.sin(θ * Math.PI / 180)) / g
    },
    theory: "Range R = v²sin(2θ)/g, Max Height H = v²sin²θ/2g"
  },
  {
    id: "friction",
    name: "Friction Coefficient",
    grade: "class11",
    category: "mechanics",
    icon: "Move",
    description: "Measure static, kinetic, and rolling friction coefficients with realistic surfaces",
    objective: "To determine coefficient of friction between various surfaces and objects",
    difficulty: "beginner",
    controls: [
      { id: "mass", label: "Block Mass", min: 0.5, max: 10, step: 0.5, unit: "kg", default: 2 },
      { id: "angle", label: "Incline Angle", min: 5, max: 60, step: 1, unit: "°", default: 30 },
      { id: "mu", label: "Friction Multiplier", min: 0.5, max: 1.5, step: 0.1, unit: "", default: 1 },
      { id: "surfaceType", label: "Surface Type", min: 1, max: 5, step: 1, unit: "", default: 1 },
      { id: "frictionType", label: "Friction Type", min: 1, max: 3, step: 1, unit: "", default: 1 }
    ],
    formulas: {
      normalForce: (m, θ, g) => m * g * Math.cos(θ * Math.PI / 180),
      frictionForce: (N, μ) => μ * N,
      acceleration: (m, θ, μ, g) => g * (Math.sin(θ * Math.PI / 180) - μ * Math.cos(θ * Math.PI / 180))
    },
    theory: "f = μN, where f is friction force, μ is coefficient, N is normal force. Static friction (μₛ) prevents motion, kinetic friction (μₖ) opposes ongoing motion, and rolling friction (μᵣ) is much smaller for wheels."
  },
  {
    id: "springs",
    name: "Spring Oscillation",
    grade: "class11",
    category: "mechanics",
    icon: "Waves",
    description: "Study Hooke's law and spring constants",
    objective: "To verify Hooke's law and determine spring constant",
    difficulty: "beginner",
    controls: [
      { id: "mass", label: "Mass", min: 0.1, max: 2, step: 0.1, unit: "kg", default: 0.5 },
      { id: "k", label: "Spring Constant", min: 10, max: 200, step: 10, unit: "N/m", default: 50 },
      { id: "amplitude", label: "Amplitude", min: 0.02, max: 0.2, step: 0.01, unit: "m", default: 0.1 }
    ],
    formulas: {
      period: (m, k) => 2 * Math.PI * Math.sqrt(m / k),
      frequency: (m, k) => (1 / (2 * Math.PI)) * Math.sqrt(k / m),
      maxVelocity: (A, ω) => A * ω
    },
    theory: "F = -kx (Hooke's Law), T = 2π√(m/k)"
  },
  {
    id: "collisions",
    name: "Elastic Collisions",
    grade: "class11",
    category: "mechanics",
    icon: "Zap",
    description: "Study momentum and energy conservation in collisions",
    objective: "To verify conservation of momentum and kinetic energy",
    difficulty: "intermediate",
    controls: [
      { id: "m1", label: "Mass 1", min: 0.5, max: 5, step: 0.5, unit: "kg", default: 1 },
      { id: "m2", label: "Mass 2", min: 0.5, max: 5, step: 0.5, unit: "kg", default: 2 },
      { id: "v1", label: "Velocity 1", min: 1, max: 20, step: 1, unit: "m/s", default: 10 },
      { id: "v2", label: "Velocity 2", min: -10, max: 10, step: 1, unit: "m/s", default: 0 }
    ],
    formulas: {
      v1Final: (m1, m2, v1, v2) => ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2),
      v2Final: (m1, m2, v1, v2) => ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2),
      momentum: (m, v) => m * v
    },
    theory: "m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂' (Conservation of Momentum)"
  },
  {
    id: "waves-string",
    name: "Standing Waves",
    grade: "class11",
    category: "waves",
    icon: "Activity",
    description: "Visualize standing waves on a string",
    objective: "To study the formation of standing waves and resonance",
    difficulty: "intermediate",
    controls: [
      { id: "length", label: "String Length", min: 0.5, max: 3, step: 0.1, unit: "m", default: 1 },
      { id: "tension", label: "Tension", min: 10, max: 200, step: 10, unit: "N", default: 50 },
      { id: "density", label: "Linear Density", min: 0.001, max: 0.01, step: 0.001, unit: "kg/m", default: 0.005 },
      { id: "harmonic", label: "Harmonic", min: 1, max: 8, step: 1, unit: "", default: 1 }
    ],
    formulas: {
      velocity: (T, μ) => Math.sqrt(T / μ),
      frequency: (n, L, v) => (n * v) / (2 * L),
      wavelength: (L, n) => (2 * L) / n
    },
    theory: "v = √(T/μ), fₙ = nv/2L for nth harmonic"
  },
  {
    id: "sonometer",
    name: "Sonometer",
    grade: "class11",
    category: "waves",
    icon: "Music",
    description: "Determine frequency of tuning fork using sonometer – Melde's experiment",
    objective: "To study variation of frequency with length, tension and linear density",
    difficulty: "intermediate",
    controls: [
      { id: "tension", label: "Tension", min: 1, max: 20, step: 0.5, unit: "N", default: 4 },
      { id: "length", label: "Vibrating Length", min: 0.1, max: 1, step: 0.05, unit: "m", default: 0.5 },
      { id: "wireLinearDensity", label: "Linear Density", min: 0.0005, max: 0.005, step: 0.0001, unit: "kg/m", default: 0.001 },
      { id: "harmonic", label: "Harmonic Mode", min: 1, max: 5, step: 1, unit: "", default: 1 }
    ],
    theory: "f = (n/2L)√(T/μ). Nodes = n+1, Antinodes = n"
  },
  {
    id: "youngs-modulus",
    name: "Young's Modulus",
    grade: "class11",
    category: "mechanics",
    icon: "BarChart2",
    description: "Determine Young's modulus of elasticity by Searle's method",
    objective: "To find Young's modulus of wire using Searle's apparatus",
    difficulty: "intermediate",
    controls: [
      { id: "load", label: "Load", min: 0.5, max: 10, step: 0.5, unit: "kg", default: 2 },
      { id: "length", label: "Wire Length", min: 50, max: 300, step: 10, unit: "cm", default: 100 },
      { id: "area", label: "Cross-section Area", min: 0.1, max: 5, step: 0.1, unit: "mm²", default: 0.5 },
      { id: "material", label: "Material", min: 1, max: 5, step: 1, unit: "", default: 1 }
    ],
    theory: "Y = (F × L) / (A × ΔL) = Stress / Strain"
  },
  {
    id: "sound-waves",
    name: "Sound Resonance",
    grade: "class11",
    category: "waves",
    icon: "Volume2",
    description: "Study resonance in air columns",
    objective: "To determine the speed of sound using resonance tube",
    difficulty: "intermediate",
    controls: [
      { id: "frequency", label: "Tuning Fork Freq", min: 200, max: 1000, step: 50, unit: "Hz", default: 512 },
      { id: "temperature", label: "Temperature", min: 10, max: 40, step: 1, unit: "°C", default: 25 },
      { id: "diameter", label: "Tube Diameter", min: 2, max: 8, step: 0.5, unit: "cm", default: 4 }
    ],
    formulas: {
      speedOfSound: (T) => 331.4 + 0.6 * T,
      wavelength: (v, f) => v / f,
      endCorrection: (d) => 0.3 * d
    },
    theory: "v = 331.4 + 0.6T m/s, λ = v/f"
  },

  // ============ CLASS 12 EXPERIMENTS ============
  {
    id: "ohms-law",
    name: "Ohm's Law Verification",
    grade: "class12",
    category: "electricity",
    icon: "Zap",
    description: "Verify Ohm's law and measure resistance",
    objective: "To verify Ohm's law and determine resistance of a wire",
    difficulty: "beginner",
    controls: [
      { id: "voltage", label: "Voltage", min: 0, max: 12, step: 0.5, unit: "V", default: 6 },
      { id: "resistance", label: "Resistance", min: 10, max: 1000, step: 10, unit: "Ω", default: 100 }
    ],
    formulas: {
      current: (V, R) => V / R,
      power: (V, I) => V * I
    },
    theory: "V = IR (Ohm's Law), P = VI"
  },
  {
    id: "kirchhoff",
    name: "Kirchhoff's Laws",
    grade: "class12",
    category: "electricity",
    icon: "GitBranch",
    description: "Verify Kirchhoff's current and voltage laws",
    objective: "To verify KCL and KVL in electrical circuits",
    difficulty: "intermediate",
    controls: [
      { id: "emf1", label: "EMF 1", min: 1, max: 12, step: 0.5, unit: "V", default: 6 },
      { id: "emf2", label: "EMF 2", min: 1, max: 12, step: 0.5, unit: "V", default: 4 },
      { id: "r1", label: "R1", min: 10, max: 200, step: 10, unit: "Ω", default: 50 },
      { id: "r2", label: "R2", min: 10, max: 200, step: 10, unit: "Ω", default: 100 },
      { id: "r3", label: "R3", min: 10, max: 200, step: 10, unit: "Ω", default: 75 }
    ],
    formulas: {
      totalCurrent: (E1, E2, R1, R2, R3) => (E1 - E2) / (R1 + R2 + R3)
    },
    theory: "ΣI = 0 (KCL), ΣV = 0 (KVL)"
  },
  {
    id: "potentiometer",
    name: "Potentiometer EMF",
    grade: "class12",
    category: "electricity",
    icon: "Ruler",
    description: "Compare EMFs using potentiometer",
    objective: "To compare EMF of two cells using potentiometer",
    difficulty: "intermediate",
    controls: [
      { id: "emf1", label: "Cell 1 EMF", min: 1, max: 3, step: 0.1, unit: "V", default: 1.5 },
      { id: "emf2", label: "Cell 2 EMF", min: 1, max: 3, step: 0.1, unit: "V", default: 1.1 },
      { id: "wireLength", label: "Wire Length", min: 50, max: 200, step: 10, unit: "cm", default: 100 },
      { id: "rheostat", label: "Rheostat", min: 1, max: 50, step: 1, unit: "Ω", default: 20 }
    ],
    formulas: {
      balanceLength1: (E1, E2, L) => L * E1 / (E1 + E2),
      ratio: (l1, l2) => l1 / l2
    },
    theory: "E₁/E₂ = l₁/l₂ (Potentiometer principle)"
  },
  {
    id: "meter-bridge",
    name: "Meter Bridge",
    grade: "class12",
    category: "electricity",
    icon: "Minus",
    description: "Determine unknown resistance using meter bridge",
    objective: "To find unknown resistance using Wheatstone bridge principle",
    difficulty: "intermediate",
    controls: [
      { id: "knownR", label: "Known Resistance", min: 10, max: 500, step: 10, unit: "Ω", default: 100 },
      { id: "unknownR", label: "Unknown R (Actual)", min: 10, max: 500, step: 10, unit: "Ω", default: 150 },
      { id: "wireResistance", label: "Wire Resistance", min: 0.1, max: 2, step: 0.1, unit: "Ω/m", default: 1 }
    ],
    formulas: {
      balancePoint: (R, S) => 100 * R / (R + S),
      unknownResistance: (R, l) => R * (100 - l) / l
    },
    theory: "R/S = l/(100-l), Wheatstone bridge balance"
  },
  {
    id: "galvanometer",
    name: "Galvanometer Conversion",
    grade: "class12",
    category: "electricity",
    icon: "Gauge",
    description: "Convert galvanometer to ammeter/voltmeter",
    objective: "To convert a galvanometer into ammeter and voltmeter",
    difficulty: "advanced",
    controls: [
      { id: "Ig", label: "Full Scale Current", min: 0.001, max: 0.1, step: 0.001, unit: "A", default: 0.01 },
      { id: "G", label: "Galvanometer Resistance", min: 10, max: 200, step: 5, unit: "Ω", default: 50 },
      { id: "I", label: "Ammeter Range", min: 0.1, max: 10, step: 0.1, unit: "A", default: 1 },
      { id: "V", label: "Voltmeter Range", min: 1, max: 50, step: 1, unit: "V", default: 10 }
    ],
    formulas: {
      shuntResistance: (Ig, G, I) => (Ig * G) / (I - Ig),
      seriesResistance: (V, Ig, G) => (V / Ig) - G
    },
    theory: "S = IgG/(I-Ig) for ammeter, R = V/Ig - G for voltmeter"
  },
  {
    id: "refraction",
    name: "Glass Prism Refraction",
    grade: "class12",
    category: "optics",
    icon: "Triangle",
    description: "Study refraction through glass prism",
    objective: "To determine refractive index of glass prism",
    difficulty: "intermediate",
    controls: [
      { id: "prismAngle", label: "Prism Angle", min: 30, max: 90, step: 5, unit: "°", default: 60 },
      { id: "incidentAngle", label: "Incident Angle", min: 20, max: 70, step: 1, unit: "°", default: 45 },
      { id: "refractiveIndex", label: "Refractive Index", min: 1.3, max: 1.8, step: 0.05, unit: "", default: 1.5 }
    ],
    formulas: {
      deviation: (A, i, r, e) => i + e - A,
      minDeviation: (n, A) => 2 * Math.asin(n * Math.sin(A * Math.PI / 360)) * 180 / Math.PI - A,
      refractiveIndex: (A, Dm) => Math.sin((A + Dm) * Math.PI / 360) / Math.sin(A * Math.PI / 360)
    },
    theory: "n = sin((A+Dm)/2) / sin(A/2)"
  },
  {
    id: "lens-formula",
    name: "Convex Lens",
    grade: "class12",
    category: "optics",
    icon: "Circle",
    description: "Verify lens formula and find focal length",
    objective: "To determine focal length of convex lens by u-v method",
    difficulty: "beginner",
    controls: [
      { id: "focalLength", label: "Focal Length", min: 5, max: 30, step: 1, unit: "cm", default: 15 },
      { id: "objectDistance", label: "Object Distance", min: 10, max: 60, step: 1, unit: "cm", default: 30 },
      { id: "objectHeight", label: "Object Height", min: 1, max: 5, step: 0.5, unit: "cm", default: 2 }
    ],
    formulas: {
      imageDistance: (f, u) => (f * u) / (u - f),
      magnification: (v, u) => -v / u,
      imageHeight: (m, h) => m * h
    },
    theory: "1/f = 1/v - 1/u (Lens Formula)"
  },
  {
    id: "interference",
    name: "Young's Double Slit",
    grade: "class12",
    category: "optics",
    icon: "Layers",
    description: "Study interference pattern in double slit experiment",
    objective: "To determine wavelength of light using interference",
    difficulty: "advanced",
    controls: [
      { id: "wavelength", label: "Wavelength", min: 400, max: 700, step: 10, unit: "nm", default: 550 },
      { id: "slitSeparation", label: "Slit Separation", min: 0.1, max: 1, step: 0.05, unit: "mm", default: 0.5 },
      { id: "screenDistance", label: "Screen Distance", min: 50, max: 200, step: 10, unit: "cm", default: 100 }
    ],
    formulas: {
      fringeWidth: (λ, D, d) => (λ * D) / d,
      pathDifference: (d, θ) => d * Math.sin(θ),
      intensity: (I0, φ) => 4 * I0 * Math.cos(φ / 2) ** 2
    },
    theory: "β = λD/d (Fringe width formula)"
  },
  {
    id: "diffraction",
    name: "Single Slit Diffraction",
    grade: "class12",
    category: "optics",
    icon: "Sun",
    description: "Study diffraction pattern from single slit",
    objective: "To study single slit diffraction and measure slit width",
    difficulty: "advanced",
    controls: [
      { id: "wavelength", label: "Wavelength", min: 400, max: 700, step: 10, unit: "nm", default: 600 },
      { id: "slitWidth", label: "Slit Width", min: 0.05, max: 0.5, step: 0.01, unit: "mm", default: 0.1 },
      { id: "screenDistance", label: "Screen Distance", min: 50, max: 200, step: 10, unit: "cm", default: 100 }
    ],
    formulas: {
      centralMaxWidth: (λ, D, a) => (2 * λ * D) / a,
      minima: (a, θ, λ, n) => a * Math.sin(θ) === n * λ
    },
    theory: "a sin θ = nλ for minima"
  },
  {
    id: "polarization",
    name: "Malus Law",
    grade: "class12",
    category: "optics",
    icon: "Filter",
    description: "Verify Malus law of polarization",
    objective: "To verify Malus law using polaroids",
    difficulty: "intermediate",
    controls: [
      { id: "intensity", label: "Initial Intensity", min: 100, max: 1000, step: 50, unit: "lux", default: 500 },
      { id: "angle", label: "Polaroid Angle", min: 0, max: 90, step: 5, unit: "°", default: 0 }
    ],
    formulas: {
      transmittedIntensity: (I0, θ) => I0 * Math.cos(θ * Math.PI / 180) ** 2
    },
    theory: "I = I₀ cos²θ (Malus Law)"
  },
  {
    id: "magnetic-field",
    name: "Magnetic Field Lines",
    grade: "class12",
    category: "magnetism",
    icon: "Magnet",
    description: "Visualize magnetic field patterns",
    objective: "To study magnetic field lines around magnets",
    difficulty: "beginner",
    controls: [
      { id: "strength", label: "Magnet Strength", min: 0.1, max: 1, step: 0.1, unit: "T", default: 0.5 },
      { id: "separation", label: "Pole Separation", min: 2, max: 10, step: 0.5, unit: "cm", default: 5 },
      { id: "config", label: "Configuration", min: 1, max: 3, step: 1, unit: "", default: 1 }
    ],
    formulas: {
      fieldStrength: (m, r) => (2 * m) / (4 * Math.PI * r ** 3)
    },
    theory: "B = μ₀/4π × 2m/r³ (Axial field)"
  },
  {
    id: "solenoid",
    name: "Solenoid Field",
    grade: "class12",
    category: "magnetism",
    icon: "RotateCw",
    description: "Study magnetic field of a solenoid",
    objective: "To study the magnetic field inside a solenoid",
    difficulty: "intermediate",
    controls: [
      { id: "current", label: "Current", min: 0.1, max: 5, step: 0.1, unit: "A", default: 1 },
      { id: "turns", label: "Number of Turns", min: 50, max: 500, step: 50, unit: "", default: 200 },
      { id: "length", label: "Solenoid Length", min: 5, max: 30, step: 1, unit: "cm", default: 10 }
    ],
    formulas: {
      field: (n, I, L) => (4 * Math.PI * 1e-7 * n * I) / (L / 100),
      inductance: (n, A, L) => (4 * Math.PI * 1e-7 * n * n * A) / L
    },
    theory: "B = μ₀nI (Field inside solenoid)"
  },
  {
    id: "em-induction",
    name: "Electromagnetic Induction",
    grade: "class12",
    category: "magnetism",
    icon: "RefreshCw",
    description: "Study Faraday's law of electromagnetic induction",
    objective: "To demonstrate electromagnetic induction",
    difficulty: "intermediate",
    controls: [
      { id: "flux", label: "Magnetic Flux", min: 0.01, max: 0.5, step: 0.01, unit: "Wb", default: 0.1 },
      { id: "turns", label: "Coil Turns", min: 10, max: 200, step: 10, unit: "", default: 50 },
      { id: "time", label: "Time Period", min: 0.1, max: 2, step: 0.1, unit: "s", default: 0.5 }
    ],
    formulas: {
      emf: (N, dΦ, dt) => -N * dΦ / dt
    },
    theory: "ε = -N(dΦ/dt) (Faraday's Law)"
  },

  {
    id: "pn-junction",
    name: "PN Junction Diode",
    grade: "class12",
    category: "electricity",
    icon: "Zap",
    description: "Study VI characteristics of PN junction diode – forward and reverse bias",
    objective: "To draw VI characteristics and find knee voltage and dynamic resistance",
    difficulty: "intermediate",
    controls: [
      { id: "voltage", label: "Applied Voltage", min: -2, max: 1.5, step: 0.05, unit: "V", default: 0.5 },
      { id: "temperature", label: "Temperature", min: 250, max: 400, step: 10, unit: "K", default: 300 },
      { id: "material", label: "Material (1=Si,2=Ge,3=GaAs)", min: 1, max: 3, step: 1, unit: "", default: 1 }
    ],
    theory: "I = Is(e^(V/VT) − 1), VT = kT/e = 26mV at 300K"
  },
  {
    id: "lcr-resonance",
    name: "LCR Resonance",
    grade: "class12",
    category: "electricity",
    icon: "Activity",
    description: "Study resonance in series LCR circuit and find Q-factor",
    objective: "To find resonant frequency, quality factor and bandwidth of LCR circuit",
    difficulty: "advanced",
    controls: [
      { id: "inductance", label: "Inductance L", min: 0.01, max: 1, step: 0.01, unit: "H", default: 0.1 },
      { id: "capacitance", label: "Capacitance C", min: 10, max: 1000, step: 10, unit: "µF", default: 100 },
      { id: "resistance", label: "Resistance R", min: 10, max: 500, step: 10, unit: "Ω", default: 50 },
      { id: "frequency", label: "Applied Freq", min: 10, max: 1000, step: 5, unit: "Hz", default: 159 }
    ],
    theory: "f₀ = 1/(2π√LC), Q = (1/R)√(L/C), Z = √(R² + (XL−XC)²)"
  },
  // ============ B.TECH EXPERIMENTS ============
  {
    id: "shm-damped",
    name: "Damped Oscillations",
    grade: "btech",
    category: "mechanics",
    icon: "TrendingDown",
    description: "Study damped harmonic motion with various damping conditions",
    objective: "To analyze underdamped, overdamped, and critically damped oscillations",
    difficulty: "advanced",
    controls: [
      { id: "mass", label: "Mass", min: 0.1, max: 2, step: 0.1, unit: "kg", default: 0.5 },
      { id: "k", label: "Spring Constant", min: 10, max: 200, step: 10, unit: "N/m", default: 50 },
      { id: "b", label: "Damping Coeff", min: 0, max: 10, step: 0.5, unit: "Ns/m", default: 2 },
      { id: "amplitude", label: "Initial Amplitude", min: 0.05, max: 0.3, step: 0.01, unit: "m", default: 0.1 }
    ],
    formulas: {
      naturalFreq: (k, m) => Math.sqrt(k / m),
      dampingRatio: (b, k, m) => b / (2 * Math.sqrt(k * m)),
      dampedFreq: (ω0, ζ) => ω0 * Math.sqrt(1 - ζ * ζ)
    },
    theory: "ζ = b/2√(km), ωd = ω₀√(1-ζ²)"
  },
  {
    id: "coupled-pendulum",
    name: "Coupled Oscillators",
    grade: "btech",
    category: "mechanics",
    icon: "Link",
    description: "Study energy transfer in coupled pendulums",
    objective: "To observe normal modes and beats in coupled oscillators",
    difficulty: "advanced",
    controls: [
      { id: "length", label: "Pendulum Length", min: 0.3, max: 1.5, step: 0.1, unit: "m", default: 0.8 },
      { id: "coupling", label: "Coupling Strength", min: 0.1, max: 2, step: 0.1, unit: "N/m", default: 0.5 },
      { id: "mass", label: "Bob Mass", min: 0.1, max: 1, step: 0.1, unit: "kg", default: 0.3 }
    ],
    formulas: {
      symFreq: (g, L) => Math.sqrt(g / L),
      antiSymFreq: (g, L, k, m) => Math.sqrt(g / L + 2 * k / m),
      beatFreq: (ω1, ω2) => Math.abs(ω1 - ω2) / (2 * Math.PI)
    },
    theory: "ω± = √(g/L ± 2k/m)"
  },
  {
    id: "gyroscope",
    name: "Gyroscope Precession",
    grade: "btech",
    category: "mechanics",
    icon: "Compass",
    description: "Study gyroscopic precession and nutation",
    objective: "To measure precession rate and verify gyroscope equations",
    difficulty: "advanced",
    controls: [
      { id: "spinRate", label: "Spin Rate", min: 100, max: 3000, step: 100, unit: "RPM", default: 1000 },
      { id: "momentInertia", label: "Moment of Inertia", min: 0.001, max: 0.05, step: 0.002, unit: "kg·m²", default: 0.01 },
      { id: "torque", label: "Applied Torque", min: 0.01, max: 0.5, step: 0.01, unit: "N·m", default: 0.1 }
    ],
    formulas: {
      precessionRate: (τ, I, ω) => τ / (I * ω),
      angularMomentum: (I, ω) => I * ω
    },
    theory: "Ωp = τ/(Iω) (Precession rate)"
  },
  {
    id: "photoelectric",
    name: "Photoelectric Effect",
    grade: "btech",
    category: "modern",
    icon: "Lightbulb",
    description: "Study photoelectric effect and measure Planck's constant",
    objective: "To verify Einstein's photoelectric equation and find h/e",
    difficulty: "advanced",
    controls: [
      { id: "wavelength", label: "Wavelength", min: 200, max: 600, step: 10, unit: "nm", default: 400 },
      { id: "intensity", label: "Light Intensity", min: 10, max: 1000, step: 50, unit: "W/m²", default: 500 },
      { id: "workFunction", label: "Work Function", min: 1, max: 5, step: 0.1, unit: "eV", default: 2.3 }
    ],
    formulas: {
      photonEnergy: (λ) => (6.626e-34 * 3e8) / (λ * 1e-9) / 1.6e-19,
      maxKE: (E, W) => Math.max(0, E - W),
      stoppingPotential: (KE) => KE
    },
    theory: "hν = W + KEmax (Einstein's equation)"
  },
  {
    id: "compton",
    name: "Compton Scattering",
    grade: "btech",
    category: "modern",
    icon: "Sparkles",
    description: "Simulate Compton scattering of X-rays",
    objective: "To verify Compton wavelength shift formula",
    difficulty: "advanced",
    controls: [
      { id: "wavelength", label: "Incident λ", min: 0.01, max: 0.1, step: 0.005, unit: "nm", default: 0.05 },
      { id: "angle", label: "Scattering Angle", min: 0, max: 180, step: 10, unit: "°", default: 90 }
    ],
    formulas: {
      wavelengthShift: (θ) => 0.00243 * (1 - Math.cos(θ * Math.PI / 180)),
      scatteredWavelength: (λ, Δλ) => λ + Δλ
    },
    theory: "Δλ = h/mc(1-cosθ) = 0.00243(1-cosθ) nm"
  },
  {
    id: "hydrogen-spectrum",
    name: "Hydrogen Spectrum",
    grade: "btech",
    category: "modern",
    icon: "Rainbow",
    description: "Study hydrogen emission spectrum and energy levels",
    objective: "To calculate Rydberg constant from hydrogen spectrum",
    difficulty: "advanced",
    controls: [
      { id: "nLower", label: "Lower Level n", min: 1, max: 4, step: 1, unit: "", default: 2 },
      { id: "nUpper", label: "Upper Level n", min: 2, max: 7, step: 1, unit: "", default: 3 }
    ],
    formulas: {
      wavelength: (n1, n2) => 91.2 / (1 / (n1 * n1) - 1 / (n2 * n2)),
      energy: (n) => -13.6 / (n * n),
      transitionEnergy: (E1, E2) => Math.abs(E2 - E1)
    },
    theory: "1/λ = R(1/n₁² - 1/n₂²), R = 1.097×10⁷ m⁻¹"
  },
  {
    id: "xray-diffraction",
    name: "X-Ray Diffraction",
    grade: "btech",
    category: "modern",
    icon: "Grid3x3",
    description: "Study Bragg's law and crystal structure analysis",
    objective: "To determine crystal lattice spacing using X-ray diffraction",
    difficulty: "advanced",
    controls: [
      { id: "wavelength", label: "X-ray λ", min: 0.05, max: 0.2, step: 0.01, unit: "nm", default: 0.154 },
      { id: "latticeSpacing", label: "d-spacing", min: 0.1, max: 0.5, step: 0.02, unit: "nm", default: 0.2 },
      { id: "order", label: "Diffraction Order", min: 1, max: 5, step: 1, unit: "", default: 1 }
    ],
    formulas: {
      braggAngle: (n, λ, d) => Math.asin((n * λ) / (2 * d)) * 180 / Math.PI,
      pathDifference: (n, λ) => n * λ
    },
    theory: "2d sin θ = nλ (Bragg's Law)"
  },
  {
    id: "hall-effect",
    name: "Hall Effect",
    grade: "btech",
    category: "electricity",
    icon: "Square",
    description: "Study Hall effect in semiconductors",
    objective: "To determine carrier concentration and mobility using Hall effect",
    difficulty: "advanced",
    controls: [
      { id: "current", label: "Current", min: 0.1, max: 10, step: 0.1, unit: "mA", default: 5 },
      { id: "magneticField", label: "Magnetic Field", min: 0.1, max: 1, step: 0.05, unit: "T", default: 0.5 },
      { id: "thickness", label: "Sample Thickness", min: 0.1, max: 2, step: 0.1, unit: "mm", default: 0.5 },
      { id: "hallVoltage", label: "Hall Voltage", min: 0.1, max: 50, step: 0.5, unit: "mV", default: 10 }
    ],
    formulas: {
      hallCoefficient: (VH, t, I, B) => (VH * t) / (I * B),
      carrierConcentration: (RH) => 1 / (1.6e-19 * Math.abs(RH))
    },
    theory: "RH = VH·t/(I·B), n = 1/(e·RH)"
  },
  {
    id: "stefan-boltzmann",
    name: "Stefan-Boltzmann Law",
    grade: "btech",
    category: "thermodynamics",
    icon: "Thermometer",
    description: "Verify Stefan-Boltzmann radiation law",
    objective: "To verify Stefan-Boltzmann law and find Stefan's constant",
    difficulty: "advanced",
    controls: [
      { id: "temperature", label: "Temperature", min: 300, max: 1500, step: 50, unit: "K", default: 800 },
      { id: "area", label: "Surface Area", min: 0.01, max: 0.1, step: 0.01, unit: "m²", default: 0.05 },
      { id: "emissivity", label: "Emissivity", min: 0.1, max: 1, step: 0.1, unit: "", default: 0.8 }
    ],
    formulas: {
      radiatedPower: (ε, A, T) => 5.67e-8 * ε * A * Math.pow(T, 4),
      intensity: (P, A) => P / A
    },
    theory: "P = εσAT⁴, σ = 5.67×10⁻⁸ W/(m²·K⁴)"
  },
  {
    id: "michelson",
    name: "Michelson Interferometer",
    grade: "btech",
    category: "optics",
    icon: "Crosshair",
    description: "Measure wavelength using Michelson interferometer",
    objective: "To determine wavelength of light using interference",
    difficulty: "advanced",
    controls: [
      { id: "mirrorMove", label: "Mirror Movement", min: 0.01, max: 1, step: 0.01, unit: "mm", default: 0.25 },
      { id: "fringeCount", label: "Fringe Count", min: 100, max: 2000, step: 100, unit: "", default: 800 }
    ],
    formulas: {
      wavelength: (d, N) => (2 * d) / N,
      pathDifference: (d) => 2 * d
    },
    theory: "λ = 2d/N (N fringes for mirror movement d)"
  },
  {
    id: "laser-diffraction",
    name: "Laser Diffraction Grating",
    grade: "btech",
    category: "optics",
    icon: "Scan",
    description: "Study diffraction patterns using laser and grating",
    objective: "To determine grating element and wavelength",
    difficulty: "advanced",
    controls: [
      { id: "wavelength", label: "Laser Wavelength", min: 400, max: 700, step: 10, unit: "nm", default: 632.8 },
      { id: "linesPerMm", label: "Lines per mm", min: 100, max: 1000, step: 50, unit: "/mm", default: 500 },
      { id: "order", label: "Diffraction Order", min: 1, max: 5, step: 1, unit: "", default: 1 }
    ],
    formulas: {
      gratingElement: (n) => 1 / n,
      diffractionAngle: (m, λ, d) => Math.asin((m * λ * 1e-6) / (d)) * 180 / Math.PI
    },
    theory: "d sin θ = mλ (Grating equation)"
  },
  {
    id: "nuclear-decay",
    name: "Radioactive Decay",
    grade: "btech",
    category: "modern",
    icon: "Atom",
    description: "Simulate radioactive decay and half-life",
    objective: "To study radioactive decay law and measure half-life",
    difficulty: "advanced",
    controls: [
      { id: "initialAtoms", label: "Initial Atoms", min: 1000, max: 100000, step: 1000, unit: "", default: 10000 },
      { id: "halfLife", label: "Half-Life", min: 1, max: 100, step: 1, unit: "s", default: 30 },
      { id: "time", label: "Observation Time", min: 10, max: 500, step: 10, unit: "s", default: 100 }
    ],
    formulas: {
      decayConstant: (t12) => Math.log(2) / t12,
      remainingAtoms: (N0, λ, t) => N0 * Math.exp(-λ * t),
      activity: (λ, N) => λ * N
    },
    theory: "N = N₀e^(-λt), λ = ln(2)/t½"
  },
  {
    id: "quantum-tunneling",
    name: "Quantum Tunneling",
    grade: "btech",
    category: "quantum",
    icon: "Workflow",
    description: "Visualize quantum tunneling through barriers",
    objective: "To understand quantum mechanical tunneling probability",
    difficulty: "advanced",
    controls: [
      { id: "barrierHeight", label: "Barrier Height", min: 1, max: 10, step: 0.5, unit: "eV", default: 5 },
      { id: "barrierWidth", label: "Barrier Width", min: 0.1, max: 2, step: 0.1, unit: "nm", default: 0.5 },
      { id: "particleEnergy", label: "Particle Energy", min: 0.5, max: 8, step: 0.5, unit: "eV", default: 3 },
      { id: "particleMass", label: "Particle Mass", min: 0.1, max: 2, step: 0.1, unit: "me", default: 1 }
    ],
    formulas: {
      kappa: (V, E, m) => Math.sqrt(2 * m * 9.109e-31 * (V - E) * 1.6e-19) / 1.055e-34,
      transmissionCoeff: (κ, a) => Math.exp(-2 * κ * a * 1e-9)
    },
    theory: "T ≈ e^(-2κa), κ = √(2m(V-E))/ℏ"
  },
  {
    id: "wave-function",
    name: "Particle in a Box",
    grade: "btech",
    category: "quantum",
    icon: "Box",
    description: "Visualize quantum wave functions in potential well",
    objective: "To study energy quantization in infinite square well",
    difficulty: "advanced",
    controls: [
      { id: "boxWidth", label: "Box Width", min: 0.5, max: 5, step: 0.1, unit: "nm", default: 1 },
      { id: "quantumNumber", label: "Quantum Number n", min: 1, max: 10, step: 1, unit: "", default: 1 },
      { id: "particleMass", label: "Particle Mass", min: 0.1, max: 2, step: 0.1, unit: "me", default: 1 }
    ],
    formulas: {
      energy: (n, L, m) => (n * n * Math.PI * Math.PI * 1.055e-34 * 1.055e-34) / (2 * m * 9.109e-31 * L * L * 1e-18) / 1.6e-19,
      wavelength: (L, n) => (2 * L) / n
    },
    theory: "Eₙ = n²π²ℏ²/(2mL²), ψₙ = √(2/L)sin(nπx/L)"
  },
  {
    id: "superconductivity",
    name: "Superconductivity",
    grade: "btech",
    category: "modern",
    icon: "Snowflake",
    description: "Study superconducting transition and Meissner effect",
    objective: "To observe superconducting transition temperature",
    difficulty: "advanced",
    controls: [
      { id: "temperature", label: "Temperature", min: 1, max: 150, step: 1, unit: "K", default: 77 },
      { id: "criticalTemp", label: "Critical Temp Tc", min: 4, max: 100, step: 1, unit: "K", default: 92 },
      { id: "magneticField", label: "Applied Field", min: 0, max: 1, step: 0.05, unit: "T", default: 0.1 }
    ],
    formulas: {
      resistance: (T, Tc, R0) => T > Tc ? R0 : 0,
      criticalField: (T, Tc, Hc0) => Hc0 * (1 - (T / Tc) ** 2)
    },
    theory: "R = 0 for T < Tc, B = 0 inside superconductor (Meissner effect)"
  }
];

export const PHYSICS_CONSTANTS = {
  g: { value: 9.80665, unit: "m/s²", name: "Gravitational Acceleration" },
  c: { value: 299792458, unit: "m/s", name: "Speed of Light" },
  h: { value: 6.62607015e-34, unit: "J·s", name: "Planck's Constant" },
  hbar: { value: 1.054571817e-34, unit: "J·s", name: "Reduced Planck's Constant" },
  e: { value: 1.602176634e-19, unit: "C", name: "Elementary Charge" },
  me: { value: 9.1093837015e-31, unit: "kg", name: "Electron Mass" },
  mp: { value: 1.67262192369e-27, unit: "kg", name: "Proton Mass" },
  k: { value: 1.380649e-23, unit: "J/K", name: "Boltzmann Constant" },
  NA: { value: 6.02214076e23, unit: "/mol", name: "Avogadro's Number" },
  R: { value: 8.314462618, unit: "J/(mol·K)", name: "Gas Constant" },
  σ: { value: 5.670374419e-8, unit: "W/(m²·K⁴)", name: "Stefan-Boltzmann Constant" },
  ε0: { value: 8.8541878128e-12, unit: "F/m", name: "Permittivity of Free Space" },
  μ0: { value: 1.25663706212e-6, unit: "H/m", name: "Permeability of Free Space" },
  Ry: { value: 1.097373156816e7, unit: "/m", name: "Rydberg Constant" }
};

export const GRADE_INFO = {
  class11: { name: "Class 11", color: "from-emerald-500 to-teal-500", count: 7 },
  class12: { name: "Class 12", color: "from-blue-500 to-indigo-500", count: 13 },
  btech: { name: "B.Tech", color: "from-purple-500 to-pink-500", count: 12 }
};

export const CATEGORY_INFO = {
  mechanics: { name: "Mechanics", icon: "Cog", color: "#10b981" },
  waves: { name: "Waves & Sound", icon: "Waves", color: "#3b82f6" },
  optics: { name: "Optics", icon: "Eye", color: "#f59e0b" },
  thermodynamics: { name: "Thermodynamics", icon: "Thermometer", color: "#ef4444" },
  electricity: { name: "Electricity", icon: "Zap", color: "#eab308" },
  magnetism: { name: "Magnetism", icon: "Magnet", color: "#8b5cf6" },
  modern: { name: "Modern Physics", icon: "Atom", color: "#ec4899" },
  quantum: { name: "Quantum Physics", icon: "Sparkles", color: "#06b6d4" }
};
