import React, { useRef, useEffect, useCallback } from 'react';
import { drawDampedOscillations, drawKirchhoff, drawMagneticField, drawSolenoid } from './AllSimulations';
import { drawPotentiometer, drawMeterBridge, drawGalvanometer, drawEMInduction } from './ElectricitySims';
import { drawDiffraction, drawPolarization, drawMichelson, drawLaserDiffraction } from './OpticsSims';
import {
  drawCompton, drawHydrogenSpectrum, drawXRayDiffraction, drawHallEffect,
  drawStefanBoltzmann, drawNuclearDecay, drawQuantumTunneling, drawParticleInBox,
  drawSuperconductivity
} from './ModernPhysicsSims';
import { drawCoupledPendulum, drawGyroscope } from './MechanicalSims';

export default function SimulatorCanvas({ experiment, controls, isRunning, onFrame }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameRef = useRef(0);
  const startTimeRef = useRef(null);

  const getControlValues = useCallback(() => {
    const values = {};
    experiment.controls.forEach(ctrl => {
      values[ctrl.id] = controls[ctrl.id] ?? ctrl.default;
    });
    return values;
  }, [experiment, controls]);

  const drawSpringLocal = useCallback((ctx, w, h, values, time) => {
    const { mass, k, amplitude } = values;
    const omega = Math.sqrt(k / mass);
    const x = amplitude * Math.cos(omega * time);
    
    const anchorY = 50;
    const restLength = 150;
    const currentLength = restLength + x * 200;
    const massY = anchorY + currentLength;

    // Draw anchor
    ctx.fillStyle = '#64748b';
    ctx.fillRect(w/2 - 40, anchorY - 10, 80, 10);

    // Draw spring coils
    ctx.beginPath();
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
    const coils = 12;
    const coilWidth = 30;
    for (let i = 0; i <= coils; i++) {
      const y = anchorY + (currentLength * i / coils);
      const xOffset = (i % 2 === 0 ? coilWidth : -coilWidth) * (i > 0 && i < coils ? 1 : 0);
      if (i === 0) ctx.moveTo(w/2, y);
      else ctx.lineTo(w/2 + xOffset, y);
    }
    ctx.stroke();

    // Draw mass
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#7928ca';
    ctx.fillStyle = '#7928ca';
    ctx.fillRect(w/2 - 30, massY, 60, 50);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass} kg`, w/2, massY + 30);

    return {
      period: 2 * Math.PI / omega,
      frequency: omega / (2 * Math.PI),
      displacement: x
    };
  }, []);

  const drawWavesLocal = useCallback((ctx, w, h, values, time) => {
    const { length, tension, density, harmonic } = values;
    const v = Math.sqrt(tension / density);
    const frequency = (harmonic * v) / (2 * length);
    const wavelength = (2 * length) / harmonic;

    const startX = 50;
    const endX = w - 50;
    const centerY = h / 2;
    const amplitude = 80;

    // Draw fixed ends
    ctx.fillStyle = '#64748b';
    ctx.fillRect(startX - 10, centerY - 40, 10, 80);
    ctx.fillRect(endX, centerY - 40, 10, 80);

    // Draw wave
    ctx.beginPath();
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00d4ff';

    for (let x = startX; x <= endX; x += 2) {
      const normalizedX = (x - startX) / (endX - startX);
      const y = centerY + amplitude * Math.sin(harmonic * Math.PI * normalizedX) * Math.cos(2 * Math.PI * frequency * time);
      if (x === startX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw nodes
    for (let n = 0; n <= harmonic; n++) {
      const nodeX = startX + (n / harmonic) * (endX - startX);
      ctx.beginPath();
      ctx.arc(nodeX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    }

    return {
      velocity: v,
      frequency: frequency,
      wavelength: wavelength * 100
    };
  }, []);

  const drawOhmsLawLocal = useCallback((ctx, w, h, values, time) => {
    const { voltage, resistance } = values;
    const current = voltage / resistance;

    // Draw circuit
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    
    // Main rectangle circuit
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(w - 100, 100);
    ctx.lineTo(w - 100, h - 100);
    ctx.lineTo(100, h - 100);
    ctx.lineTo(100, 100);
    ctx.stroke();

    // Draw battery
    ctx.fillStyle = '#10b981';
    ctx.fillRect(w/2 - 30, 85, 60, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${voltage}V`, w/2, 105);

    // Draw resistor
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(w/2 - 40, h - 115, 80, 30);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${resistance}Ω`, w/2, h - 95);

    // Animate electrons
    const electronCount = Math.min(10, Math.ceil(current * 5));
    for (let i = 0; i < electronCount; i++) {
      const phase = (time * current * 2 + i * 0.3) % 4;
      let ex, ey;
      if (phase < 1) {
        ex = 100 + phase * (w - 200);
        ey = 100;
      } else if (phase < 2) {
        ex = w - 100;
        ey = 100 + (phase - 1) * (h - 200);
      } else if (phase < 3) {
        ex = w - 100 - (phase - 2) * (w - 200);
        ey = h - 100;
      } else {
        ex = 100;
        ey = h - 100 - (phase - 3) * (h - 200);
      }
      
      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00d4ff';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    return {
      current: current * 1000,
      power: voltage * current
    };
  }, []);



  const drawDefaultLocal = useCallback((ctx, w, h, values, time) => {
    // Generic animation
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);
    
    const centerX = w / 2;
    const centerY = h / 2;
    
    // Draw pulsing circle
    const radius = 50 + Math.sin(time * 2) * 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00d4ff';
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Simulation Running...', centerX, centerY + 100);

    return {};
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const animate = () => {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      const time = (Date.now() - startTimeRef.current) / 1000;

      ctx.clearRect(0, 0, w, h);
      
      // Dark background with grid
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Draw grid
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const values = getControlValues();
      let results = {};

      // Choose animation based on experiment
      switch(experiment.id) {
        case 'pendulum':
          results = drawPendulum(ctx, w, h, values, time);
          break;
        case 'projectile':
          results = drawProjectile(ctx, w, h, values, time);
          break;
        case 'friction':
          results = drawFriction(ctx, w, h, values, time);
          break;
        case 'springs':
          results = drawSpringLocal(ctx, w, h, values, time);
          break;
        case 'collisions':
          results = drawCollisions(ctx, w, h, values, time);
          break;
        case 'waves-string':
          results = drawWavesLocal(ctx, w, h, values, time);
          break;
        case 'sound-waves':
          results = drawSoundWaves(ctx, w, h, values, time);
          break;
        case 'ohms-law':
          results = drawOhmsLawLocal(ctx, w, h, values, time);
          break;
        case 'kirchhoff':
          results = drawKirchhoff(ctx, w, h, values, time);
          break;
        case 'refraction':
          results = drawRefraction(ctx, w, h, values, time);
          break;
        case 'lens-formula':
          results = drawLens(ctx, w, h, values, time);
          break;
        case 'interference':
          results = drawInterference(ctx, w, h, values, time);
          break;
        case 'photoelectric':
          results = drawPhotoelectric(ctx, w, h, values, time);
          break;
        case 'magnetic-field':
          results = drawMagneticField(ctx, w, h, values, time);
          break;
        case 'solenoid':
          results = drawSolenoid(ctx, w, h, values, time);
          break;
        case 'shm-damped':
          results = drawDampedOscillations(ctx, w, h, values, time);
          break;
        case 'vernier-caliper':
          results = drawVernierCaliper(ctx, w, h, values, time);
          break;
        case 'screw-gauge':
          results = drawScrewGauge(ctx, w, h, values, time);
          break;
        case 'sonometer':
          results = drawSonometer(ctx, w, h, values, time);
          break;
        case 'youngs-modulus':
          results = drawYoungsModulus(ctx, w, h, values, time);
          break;
        case 'lcr-resonance':
          results = drawLCRResonance(ctx, w, h, values, time);
          break;
        case 'pn-junction':
          results = drawPNJunction(ctx, w, h, values, time);
          break;
        // Electricity
        case 'potentiometer':
          results = drawPotentiometer(ctx, w, h, values, time);
          break;
        case 'meter-bridge':
          results = drawMeterBridge(ctx, w, h, values, time);
          break;
        case 'galvanometer':
          results = drawGalvanometer(ctx, w, h, values, time);
          break;
        case 'em-induction':
          results = drawEMInduction(ctx, w, h, values, time);
          break;
        // Optics
        case 'diffraction':
          results = drawDiffraction(ctx, w, h, values, time);
          break;
        case 'polarization':
          results = drawPolarization(ctx, w, h, values, time);
          break;
        case 'michelson':
          results = drawMichelson(ctx, w, h, values, time);
          break;
        case 'laser-diffraction':
          results = drawLaserDiffraction(ctx, w, h, values, time);
          break;
        // Modern / Quantum / B.Tech
        case 'compton':
          results = drawCompton(ctx, w, h, values, time);
          break;
        case 'hydrogen-spectrum':
          results = drawHydrogenSpectrum(ctx, w, h, values, time);
          break;
        case 'xray-diffraction':
          results = drawXRayDiffraction(ctx, w, h, values, time);
          break;
        case 'hall-effect':
          results = drawHallEffect(ctx, w, h, values, time);
          break;
        case 'stefan-boltzmann':
          results = drawStefanBoltzmann(ctx, w, h, values, time);
          break;
        case 'nuclear-decay':
          results = drawNuclearDecay(ctx, w, h, values, time);
          break;
        case 'quantum-tunneling':
          results = drawQuantumTunneling(ctx, w, h, values, time);
          break;
        case 'wave-function':
          results = drawParticleInBox(ctx, w, h, values, time);
          break;
        case 'superconductivity':
          results = drawSuperconductivity(ctx, w, h, values, time);
          break;
        case 'coupled-pendulum':
          results = drawCoupledPendulum(ctx, w, h, values, time);
          break;
        case 'gyroscope':
          results = drawGyroscope(ctx, w, h, values, time);
          break;
        default:
          results = drawDefaultLocal(ctx, w, h, values, time);
      }

      if (onFrame) onFrame(results);
      frameRef.current = time;

      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isRunning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [experiment, controls, isRunning, getControlValues, onFrame, drawSpringLocal, drawWavesLocal, drawOhmsLawLocal, drawDefaultLocal]);

  const handleReset = useCallback(() => {
    startTimeRef.current = null;
    frameRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isRunning) {
      handleReset();
    }
  }, [isRunning, handleReset]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      className="w-full h-full rounded-xl"
      style={{ background: '#0f172a' }}
    />
  );
}
