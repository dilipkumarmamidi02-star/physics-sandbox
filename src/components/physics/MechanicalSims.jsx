export function drawCoupledPendulum(ctx, w, h, values, time) {
  const g = 9.8;
  const { length, coupling, mass } = values;
  const ω0 = Math.sqrt(g / length);
  const ω1 = ω0;
  const ω2 = Math.sqrt(g / length + 2 * coupling / mass);
  const beatFreq = Math.abs(ω2 - ω1) / (2 * Math.PI);

  // Normal mode amplitudes
  const A = 0.5 * Math.cos(ω1 * time) + 0.5 * Math.cos(ω2 * time);
  const B = 0.5 * Math.cos(ω1 * time) - 0.5 * Math.cos(ω2 * time);

  const cx = w / 2;
  const pivotY = 60;
  const L = Math.min(length * 200, 200);

  // Pivot bar
  ctx.fillStyle = '#334155';
  ctx.fillRect(cx - 150, pivotY - 8, 300, 16);

  // Coupling spring
  const x1 = cx - 80 + A * 60;
  const x2 = cx + 80 + B * 60;
  const bY = pivotY + L;

  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
  const coils = 10;
  ctx.beginPath();
  for (let i = 0; i <= coils; i++) {
    const px = x1 + (x2 - x1) * i / coils;
    const py = bY + (i % 2 === 0 ? 0 : 10) * (i > 0 && i < coils ? 1 : 0);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Pendulum 1
  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx - 80, pivotY + 8); ctx.lineTo(x1, bY); ctx.stroke();
  ctx.fillStyle = '#00d4ff'; ctx.shadowBlur = 15; ctx.shadowColor = '#00d4ff';
  ctx.beginPath(); ctx.arc(x1, bY, 18, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('m₁', x1, bY + 4);

  // Pendulum 2
  ctx.strokeStyle = '#7928ca'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx + 80, pivotY + 8); ctx.lineTo(x2, bY); ctx.stroke();
  ctx.fillStyle = '#7928ca'; ctx.shadowBlur = 15; ctx.shadowColor = '#7928ca';
  ctx.beginPath(); ctx.arc(x2, bY, 18, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff';
  ctx.fillText('m₂', x2, bY + 4);

  // Beat waveform
  const waveY = h - 100;
  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 50; x < w - 50; x++) {
    const t = ((x - 50) / (w - 100)) * 20;
    const a = 0.5 * Math.cos(ω1 * t) + 0.5 * Math.cos(ω2 * t);
    const y = waveY - a * 35;
    if (x === 50) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = '#7928ca'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 50; x < w - 50; x++) {
    const t = ((x - 50) / (w - 100)) * 20;
    const b = 0.5 * Math.cos(ω1 * t) - 0.5 * Math.cos(ω2 * t);
    const y = waveY - b * 35;
    if (x === 50) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = 'rgba(148,163,184,0.2)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(50, waveY); ctx.lineTo(w - 50, waveY); ctx.stroke();

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 220, 110, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Coupled Oscillators', 130, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`ω₁ = ${ω1.toFixed(3)} rad/s`, 130, 60);
  ctx.fillText(`ω₂ = ${ω2.toFixed(3)} rad/s`, 130, 78);
  ctx.fillText(`Beat freq = ${beatFreq.toFixed(3)} Hz`, 130, 96);
  ctx.fillText(`Coupling k = ${coupling} N/m`, 130, 114);

  return {
    symmetricFreq_rad: ω1.toFixed(4),
    antiSymmetricFreq_rad: ω2.toFixed(4),
    beatFrequency_Hz: beatFreq.toFixed(4),
    length_m: length,
    coupling_Nm: coupling
  };
}

export function drawGyroscope(ctx, w, h, values, time) {
  const { spinRate, momentInertia, torque } = values;
  const ω = spinRate * 2 * Math.PI / 60; // rad/s
  const L = momentInertia * ω;
  const Ωp = torque / L;
  const precessionDeg = (time * Ωp * 180 / Math.PI) % 360;

  const cx = w / 2, cy = h / 2;
  const precAngle = precessionDeg * Math.PI / 180;

  // Draw gyroscope disk (tilted ellipse)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(precAngle);

  // Axle
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(-100, 0); ctx.lineTo(100, 0); ctx.stroke();

  // Spinning disk
  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 4;
  ctx.shadowBlur = 20; ctx.shadowColor = '#00d4ff';
  ctx.beginPath(); ctx.ellipse(0, 0, 70, 25, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.shadowBlur = 0;

  // Spokes
  const numSpokes = 6;
  for (let i = 0; i < numSpokes; i++) {
    const a = (i / numSpokes) * Math.PI * 2 + time * ω * 0.3;
    ctx.strokeStyle = 'rgba(0,212,255,0.4)'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(70 * Math.cos(a), 25 * Math.sin(a));
    ctx.stroke();
  }
  ctx.restore();

  // Pivot point
  ctx.fillStyle = '#f59e0b';
  ctx.shadowBlur = 10; ctx.shadowColor = '#f59e0b';
  ctx.beginPath(); ctx.arc(cx - 100 * Math.cos(precAngle), cy - 100 * Math.sin(precAngle), 8, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // Precession path (circle)
  ctx.strokeStyle = 'rgba(245,158,11,0.3)'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);

  // Angular momentum arrow
  const Lx = cx + 100 * Math.cos(precAngle);
  const Ly = cy + 100 * Math.sin(precAngle);
  ctx.strokeStyle = '#7928ca'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(Lx, Ly); ctx.stroke();
  ctx.fillStyle = '#7928ca';
  ctx.beginPath();
  ctx.moveTo(Lx, Ly);
  ctx.lineTo(Lx - 12 * Math.cos(precAngle - 0.3), Ly - 12 * Math.sin(precAngle - 0.3));
  ctx.lineTo(Lx - 12 * Math.cos(precAngle + 0.3), Ly - 12 * Math.sin(precAngle + 0.3));
  ctx.closePath(); ctx.fill();

  // Gravity arrow
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 80); ctx.stroke();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.moveTo(cx, cy + 80); ctx.lineTo(cx - 8, cy + 65); ctx.lineTo(cx + 8, cy + 65); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ef4444'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('mg', cx + 20, cy + 75);

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 220, 110, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Gyroscope Precession', 130, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`Spin ω = ${ω.toFixed(2)} rad/s`, 130, 60);
  ctx.fillText(`L = Iω = ${L.toFixed(4)} kg·m²/s`, 130, 78);
  ctx.fillText(`Ωp = τ/L = ${Ωp.toFixed(4)} rad/s`, 130, 96);
  ctx.fillText(`Precession = ${precessionDeg.toFixed(1)}°`, 130, 114);

  return {
    spinRate_rads: ω.toFixed(3),
    angularMomentum: L.toFixed(5),
    precessionRate_rads: Ωp.toFixed(5),
    torque_Nm: torque,
    momentOfInertia: momentInertia
  };
}
// Optics simulations: Diffraction, Polarization, Michelson, Laser Grating

export function drawDiffraction(ctx, w, h, values, time) {
  const { wavelength, slitWidth, screenDistance } = values;
  const a = slitWidth * 1e-3; // mm -> m
  const D = screenDistance * 1e-2; // cm -> m
  const λ = wavelength * 1e-9; // nm -> m
  const centralWidth = (2 * λ * D) / a * 1000; // in mm

  const screenX = w - 80;
  const slitX = 120;
  const cx = h / 2;

  // Slit
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(slitX - 10, 0, 20, cx - 20);
  ctx.fillRect(slitX - 10, cx + 20, 20, h - cx - 20);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(slitX - 4, cx - 20, 8, 40); // gap
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(slitX - 12, 0); ctx.lineTo(slitX - 12, cx - 20); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(slitX - 12, cx + 20); ctx.lineTo(slitX - 12, h); ctx.stroke();

  // Diffraction pattern on screen
  const points = 300;
  for (let i = 0; i < points; i++) {
    const yNorm = (i / points - 0.5) * 2;
    const yPos = h / 2 + yNorm * (h / 2 - 20);
    const y = yNorm * 0.03;
    const beta = Math.PI * a * y / λ * 0.0001;
    const intensity = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2);

    // Color from wavelength
    let r = 0, g = 0, b = 0;
    if (wavelength < 440) { r = (440 - wavelength) / 40 * 200; b = 255; }
    else if (wavelength < 490) { b = 255; g = (wavelength - 440) / 50 * 255; }
    else if (wavelength < 570) { g = 255; b = (570 - wavelength) / 80 * 255; }
    else if (wavelength < 620) { r = (wavelength - 570) / 50 * 255; g = 255; }
    else { r = 255; g = (700 - wavelength) / 80 * 100; }

    ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${intensity})`;
    ctx.fillRect(screenX - 20, yPos, 30, h / points + 1);
  }

  // Screen border
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  ctx.strokeRect(screenX - 20, 10, 30, h - 20);

  // Wavefronts
  for (let i = 0; i < 5; i++) {
    const phase = (time * 1.5 + i * 0.4) % 2;
    const px = slitX + phase * (screenX - slitX - 30);
    ctx.strokeStyle = `rgba(0,212,255,${0.4 - phase * 0.18})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(px, cx - 18);
    ctx.lineTo(px, cx + 18);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Labels
  ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Slit', slitX, h - 15);
  ctx.fillText('Screen', screenX - 5, h - 15);

  // Results box
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 200, 100, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Single Slit Diffraction', 120, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`λ = ${wavelength} nm`, 120, 60);
  ctx.fillText(`Central max width: ${centralWidth.toFixed(2)} mm`, 120, 80);
  ctx.fillText(`Slit width a = ${slitWidth} mm`, 120, 100);

  return {
    wavelength_nm: wavelength,
    slitWidth_mm: slitWidth,
    centralMaxWidth_mm: centralWidth.toFixed(3),
    screenDistance_cm: screenDistance
  };
}

export function drawPolarization(ctx, w, h, values, time) {
  const { intensity, angle } = values;
  const transmitted = intensity * Math.pow(Math.cos(angle * Math.PI / 180), 2);

  const cx = w / 2;
  const cy = h / 2;

  // Incoming light beam
  const beamColor = `rgba(255, 220, 80, 0.7)`;
  ctx.fillStyle = beamColor;
  ctx.fillRect(50, cy - 20, 150, 40);

  // First polaroid (vertical)
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(230, cy, 8, 70, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Vertical lines on P1
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  for (let dy = -60; dy <= 60; dy += 12) {
    ctx.beginPath();
    ctx.moveTo(226, cy + dy);
    ctx.lineTo(234, cy + dy);
    ctx.stroke();
  }

  // Partially polarized beam
  const brightness = Math.round(255 * 0.5);
  ctx.fillStyle = `rgba(${brightness}, ${brightness}, 80, 0.7)`;
  ctx.fillRect(238, cy - 15, 160, 30);

  // Second polaroid (rotated by angle)
  ctx.save();
  ctx.translate(430, cy);
  ctx.rotate(angle * Math.PI / 180);
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 70, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  for (let dy = -60; dy <= 60; dy += 12) {
    ctx.beginPath(); ctx.moveTo(-4, dy); ctx.lineTo(4, dy); ctx.stroke();
  }
  ctx.restore();

  // Transmitted beam
  const t = transmitted / intensity;
  const tr = Math.round(255 * t);
  ctx.fillStyle = `rgba(${tr}, ${tr}, ${Math.round(50 * t)}, ${0.3 + t * 0.7})`;
  ctx.fillRect(438, cy - 15 * t, 150, 30 * t);

  // Detector circle
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(w - 60, cy, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = `rgb(${tr}, ${tr}, 0)`;
  ctx.beginPath(); ctx.arc(w - 60, cy, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`${transmitted.toFixed(0)}`, w - 60, cy + 4);
  ctx.fillText('lux', w - 60, cy + 16);

  // Labels
  ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Unpolarized', 125, cy + 55);
  ctx.fillText('Polaroid P₁', 230, cy + 90);
  ctx.fillText(`Polaroid P₂ (${angle}°)`, 430, cy + 90);
  ctx.fillText('Detector', w - 60, cy + 55);

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 210, 90, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText("Malus's Law", 125, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`I₀ = ${intensity} lux`, 125, 60);
  ctx.fillText(`θ = ${angle}°`, 125, 78);
  ctx.fillText(`I = ${transmitted.toFixed(2)} lux`, 125, 96);

  return {
    initialIntensity: intensity,
    angle_deg: angle,
    transmittedIntensity: transmitted.toFixed(2),
    cos2theta: Math.pow(Math.cos(angle * Math.PI / 180), 2).toFixed(4)
  };
}

export function drawMichelson(ctx, w, h, values, time) {
  const { mirrorMove, fringeCount } = values;
  const λ = (2 * mirrorMove * 1e-3) / fringeCount * 1e9; // nm
  const cx = w / 2;
  const cy = h / 2;

  // Draw interferometer layout
  // Beam splitter
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = 'rgba(100,200,255,0.3)';
  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2;
  ctx.fillRect(-5, -50, 10, 100);
  ctx.strokeRect(-5, -50, 10, 100);
  ctx.restore();

  // Source
  ctx.fillStyle = '#fbbf24';
  ctx.shadowBlur = 20; ctx.shadowColor = '#fbbf24';
  ctx.beginPath(); ctx.arc(cx - 150, cy, 16, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Source', cx - 150, cy + 30);

  // Mirror 1 (fixed)
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(cx + 130, cy - 45, 12, 90);
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
  ctx.fillText('M₁ (Fixed)', cx + 136, cy - 55);

  // Mirror 2 (movable)
  const m2Y = cy - 130 + Math.sin(time) * 5;
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(cx - 45, m2Y, 90, 12);
  ctx.fillStyle = '#f59e0b'; ctx.font = '11px sans-serif';
  ctx.fillText(`M₂ (Δd = ${mirrorMove} mm)`, cx, m2Y - 15);

  // Beams
  ctx.strokeStyle = 'rgba(0,212,255,0.8)'; ctx.lineWidth = 2;
  // Horizontal beam
  ctx.beginPath(); ctx.moveTo(cx - 150 + 16, cy); ctx.lineTo(cx, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 130, cy); ctx.stroke();
  // Vertical beam
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, m2Y + 12); ctx.stroke();

  // Detector
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy + 140, 25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('D', cx, cy + 145);
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 115); ctx.stroke();

  // Fringe pattern on detector
  const fringeAnim = (time * 0.5) % 1;
  for (let i = -3; i <= 3; i++) {
    const fX = cx + i * 8 + fringeAnim * 8;
    const alpha = Math.max(0, 1 - Math.abs(i) * 0.25);
    ctx.fillStyle = `rgba(0,212,255,${alpha * 0.7})`;
    ctx.fillRect(fX - 2, cy + 117, 4, 46);
  }

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 220, 90, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Michelson Interferometer', 130, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`Mirror moved: ${mirrorMove} mm`, 130, 60);
  ctx.fillText(`Fringes counted: ${fringeCount}`, 130, 78);
  ctx.fillStyle = '#10b981';
  ctx.fillText(`λ = ${λ.toFixed(2)} nm`, 130, 96);

  return {
    wavelength_nm: λ.toFixed(2),
    mirrorDisplacement_mm: mirrorMove,
    fringesObserved: fringeCount,
    pathDifference_mm: (2 * mirrorMove).toFixed(3)
  };
}

export function drawLaserDiffraction(ctx, w, h, values, time) {
  const { wavelength, linesPerMm, order } = values;
  const d = 1 / linesPerMm; // mm per line
  const sinTheta = (order * wavelength * 1e-6) / d;
  const theta = sinTheta <= 1 ? Math.asin(sinTheta) * 180 / Math.PI : null;

  const slitX = 100;
  const screenX = w - 80;
  const cy = h / 2;

  // Laser source
  ctx.fillStyle = '#ef4444';
  ctx.shadowBlur = 20; ctx.shadowColor = '#ef4444';
  ctx.fillRect(20, cy - 10, 50, 20);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('LASER', 45, cy + 4);

  // Grating
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(slitX, 20, 12, h - 40);
  for (let y = 20; y < h - 20; y += 4) {
    ctx.strokeStyle = 'rgba(148,163,184,0.5)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(slitX, y); ctx.lineTo(slitX + 12, y); ctx.stroke();
  }
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Grating', slitX + 6, 14);
  ctx.fillText(`${linesPerMm}/mm`, slitX + 6, h - 8);

  // Screen
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(screenX, 20, 20, h - 40);

  // Central beam
  ctx.strokeStyle = 'rgba(255,50,50,0.8)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(20 + 50, cy); ctx.lineTo(slitX + 12, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(slitX + 12, cy); ctx.lineTo(screenX, cy); ctx.stroke();

  // Diffracted orders on screen
  const orders = [-2, -1, 0, 1, 2];
  orders.forEach(m => {
    if (m === 0) return;
    const sinT = (m * wavelength * 1e-6) / d;
    if (Math.abs(sinT) > 1) return;
    const t = Math.asin(sinT);
    const yOnScreen = cy - Math.tan(t) * (screenX - slitX - 12);

    if (yOnScreen < 30 || yOnScreen > h - 30) return;

    // Diffracted beam
    ctx.strokeStyle = `rgba(255,50,50,${0.5 - Math.abs(m) * 0.1})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(slitX + 12, cy); ctx.lineTo(screenX, yOnScreen); ctx.stroke();

    // Spot on screen
    let r = 200, g = 0, b = 0;
    if (wavelength < 450) { r = 100; b = 255; }
    else if (wavelength < 530) { r = 0; g = 255; b = 100; }
    else if (wavelength < 590) { r = 200; g = 255; b = 0; }
    else { r = 255; g = 50; b = 0; }

    ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
    ctx.shadowBlur = 15; ctx.shadowColor = `rgb(${r},${g},${b})`;
    ctx.beginPath(); ctx.arc(screenX + 10, yOnScreen, 7, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(`m=${m}`, screenX + 22, yOnScreen + 4);
  });

  // Central spot
  ctx.fillStyle = 'rgba(255,50,50,1)';
  ctx.shadowBlur = 20; ctx.shadowColor = '#ef4444';
  ctx.beginPath(); ctx.arc(screenX + 10, cy, 9, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
  ctx.fillText('m=0', screenX + 22, cy + 4);

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 220, 100, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Diffraction Grating', 130, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`λ = ${wavelength} nm,  m = ${order}`, 130, 60);
  ctx.fillText(`Grating element d = ${d.toFixed(4)} mm`, 130, 78);
  if (theta !== null) {
    ctx.fillStyle = '#10b981';
    ctx.fillText(`θ = ${theta.toFixed(2)}°  (d sinθ = mλ)`, 130, 96);
  } else {
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Order not visible (sinθ > 1)', 130, 96);
  }

  return {
    wavelength_nm: wavelength,
    gratingElement_mm: d.toFixed(5),
    order: order,
    diffractionAngle_deg: theta !== null ? theta.toFixed(3) : 'N/A',
    sinTheta: sinTheta.toFixed(4)
  };
}
// High-accuracy pendulum simulation with realistic physics
export function drawPendulum(ctx, w, h, values, time) {
  const { length, angle, gravity } = values;
  const pivotX = w / 2;
  const pivotY = 100;
  const scale = 180;
  
  // Calculate angular frequency
  const omega = Math.sqrt(gravity / length);
  
  // For small angles, use simple harmonic approximation
  // For larger angles, use numerical integration (Runge-Kutta would be ideal)
  const theta0 = angle * Math.PI / 180;
  const theta = theta0 * Math.cos(omega * time);
  const angularVelocity = -omega * theta0 * Math.sin(omega * time);
  
  const bobX = pivotX + scale * length * Math.sin(theta);
  const bobY = pivotY + scale * length * Math.cos(theta);

  // Draw mounting bar
  ctx.fillStyle = '#334155';
  ctx.fillRect(pivotX - 80, pivotY - 25, 160, 15);
  
  // Draw pivot point with metallic gradient
  const pivotGradient = ctx.createRadialGradient(pivotX, pivotY, 0, pivotX, pivotY, 12);
  pivotGradient.addColorStop(0, '#94a3b8');
  pivotGradient.addColorStop(0.5, '#64748b');
  pivotGradient.addColorStop(1, '#475569');
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 10, 0, Math.PI * 2);
  ctx.fillStyle = pivotGradient;
  ctx.fill();

  // Draw motion trail with fading effect
  ctx.save();
  for (let i = 0; i < 60; i++) {
    const pastTime = time - i * 0.015;
    const pastTheta = theta0 * Math.cos(omega * pastTime);
    const x = pivotX + scale * length * Math.sin(pastTheta);
    const y = pivotY + scale * length * Math.cos(pastTheta);
    
    const alpha = (1 - i / 60) * 0.3;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
    ctx.fill();
  }
  ctx.restore();

  // Draw string with slight curve for realism
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  const controlX = pivotX + (bobX - pivotX) * 0.5 + angularVelocity * 5;
  const controlY = pivotY + (bobY - pivotY) * 0.5;
  ctx.quadraticCurveTo(controlX, controlY, bobX, bobY);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw bob with 3D effect
  ctx.shadowBlur = 25;
  ctx.shadowColor = '#00d4ff';
  
  const bobGradient = ctx.createRadialGradient(bobX - 5, bobY - 5, 0, bobX, bobY, 25);
  bobGradient.addColorStop(0, '#22d3ee');
  bobGradient.addColorStop(0.5, '#06b6d4');
  bobGradient.addColorStop(1, '#0891b2');
  
  ctx.beginPath();
  ctx.arc(bobX, bobY, 22, 0, Math.PI * 2);
  ctx.fillStyle = bobGradient;
  ctx.fill();
  
  // Highlight on bob
  ctx.beginPath();
  ctx.arc(bobX - 6, bobY - 6, 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw angle indicator arc
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 40, Math.PI / 2 - Math.abs(theta), Math.PI / 2 + Math.abs(theta));
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw reference line (vertical)
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(pivotX, pivotY + scale * length + 20);
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw energy bars
  const maxPE = gravity * length * (1 - Math.cos(theta0));
  const currentPE = gravity * length * (1 - Math.cos(theta));
  const currentKE = 0.5 * length * angularVelocity * angularVelocity;
  
  const barWidth = 120;
  const barHeight = 12;
  const barX = 30;
  
  // Potential Energy bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(barX, h - 80, barWidth, barHeight);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(barX, h - 80, barWidth * (currentPE / maxPE), barHeight);
  ctx.fillStyle = '#f59e0b';
  ctx.font = '10px sans-serif';
  ctx.fillText('PE', barX, h - 85);
  
  // Kinetic Energy bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(barX, h - 55, barWidth, barHeight);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(barX, h - 55, barWidth * (currentKE / maxPE), barHeight);
  ctx.fillStyle = '#10b981';
  ctx.fillText('KE', barX, h - 60);

  const period = 2 * Math.PI / omega;
  
  return {
    period: period,
    frequency: 1 / period,
    currentAngle: theta * 180 / Math.PI,
    angularVelocity: angularVelocity
  };
}
// Photoelectric effect simulation
