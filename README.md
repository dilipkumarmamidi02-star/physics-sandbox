# 🔬 Physics Sandbox Playground

An advanced interactive physics laboratory with **41+ experiments** for Class 11, Class 12, and B.Tech students. Built with React + Vite + Tailwind CSS — **no external backend or API keys required**.

## ✨ Features

- **41+ Animated Physics Experiments** across Mechanics, Waves, Optics, Electricity, Thermodynamics, and Modern Physics
- **Class 11, Class 12, and B.Tech** level experiments
- Real-time canvas simulations with interactive controls
- Data recording, graph plotting, error analysis, and CSV/JSON export
- Teacher-Student system (local storage based — no signup needed)
- Assignment creation and submission workflow
- Experiment theory, history, and real-life applications
- Responsive design with glassmorphism UI

## 🧪 Experiments Included

### Class 11
Vernier Caliper, Screw Gauge, Pendulum, Projectile Motion, Friction, Collision, Resonance, Sonometer, Young's Modulus, Surface Tension, Refraction, Lens, Prism...

### Class 12
Ohm's Law, Kirchhoff's Laws, Potentiometer, Meter Bridge, Galvanometer, PN Junction, LCR Resonance, EM Induction, Photoelectric Effect, Interference, Diffraction...

### B.Tech
Compton Scattering, Hydrogen Spectrum, X-Ray Diffraction, Hall Effect, Stefan-Boltzmann, Nuclear Decay, Quantum Tunneling, Particle in Box, Superconductivity, Coupled Pendulum, Gyroscope, Michelson Interferometer, Laser Diffraction, Polarization...

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/physics-sandbox.git
cd physics-sandbox

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deploy to GitHub Pages

1. Add this to `vite.config.js`:
   ```js
   base: '/your-repo-name/',
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add to `package.json` scripts:
   ```json
   "deploy": "vite build && gh-pages -d dist"
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## 🛠 Tech Stack

- **React 18** — UI framework
- **Vite 6** — Build tool
- **Tailwind CSS 3** — Styling
- **Radix UI** — Accessible components
- **Framer Motion** — Animations
- **Recharts** — Data visualization
- **React Query** — Data management
- **React Router v6** — Navigation
- **LocalStorage** — Persistent data (no backend needed)

## 📁 Project Structure

```
src/
├── api/              # (empty — no external API)
├── components/
│   ├── physics/      # All experiment components & simulations
│   └── ui/           # Shadcn UI components
├── lib/
│   ├── AuthContext.jsx    # Local auth (localStorage)
│   ├── localStore.js      # CRUD store (localStorage)
│   ├── query-client.js
│   ├── utils.js
│   └── NavigationTracker.jsx
├── pages/            # All page components
├── App.jsx
├── index.css
├── main.jsx
└── pages.config.js
```

## 📄 License

MIT — free to use, modify, and distribute.
