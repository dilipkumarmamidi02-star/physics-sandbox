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
export function drawPhotoelectric(ctx, w, h, values, time) {
  const { wavelength, intensity, workFunction } = values;
  
  // Constants
  const h_const = 6.626e-34; // Planck's constant
  const c = 3e8; // Speed of light
  const e = 1.6e-19; // Electron charge
  
  // Calculate photon energy in eV
  const photonEnergy = (h_const * c) / (wavelength * 1e-9) / e;
  const maxKE = Math.max(0, photonEnergy - workFunction);
  const stoppingPotential = maxKE;
  
  const plateX = 150;
  const collectorX = w - 150;
  const centerY = h / 2;
  
  // Dark background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, w, h);

  // Draw vacuum tube outline
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(w/2, centerY, w/2 - 40, h/2 - 60, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Draw metal plate (cathode)
  const plateGradient = ctx.createLinearGradient(plateX - 30, 0, plateX + 10, 0);
  plateGradient.addColorStop(0, '#475569');
  plateGradient.addColorStop(0.5, '#64748b');
  plateGradient.addColorStop(1, '#475569');
  ctx.fillStyle = plateGradient;
  ctx.fillRect(plateX - 20, centerY - 100, 30, 200);
  
  // Plate label
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.fillText('Cathode', plateX - 30, centerY + 130);
  ctx.fillText(`φ = ${workFunction} eV`, plateX - 35, centerY + 145);

  // Draw collector (anode)
  ctx.fillStyle = '#334155';
  ctx.fillRect(collectorX - 10, centerY - 80, 20, 160);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Anode', collectorX - 15, centerY + 110);

  // Draw incoming light
  const hue = 280 - (wavelength - 200) * 0.5; // UV to visible spectrum
  const lightColor = `hsl(${Math.max(0, Math.min(280, hue))}, 100%, 50%)`;
  
  // Light beam
  ctx.save();
  for (let i = 0; i < 5; i++) {
    const yOffset = (i - 2) * 30;
    ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${0.3 + Math.sin(time * 5 + i) * 0.2})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, centerY + yOffset - 50);
    ctx.lineTo(plateX - 20, centerY + yOffset);
    ctx.stroke();
  }
  ctx.restore();

  // Draw light source
  ctx.shadowBlur = 30;
  ctx.shadowColor = lightColor;
  const sourceGradient = ctx.createRadialGradient(20, centerY - 50, 0, 20, centerY - 50, 25);
  sourceGradient.addColorStop(0, lightColor);
  sourceGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = sourceGradient;
  ctx.beginPath();
  ctx.arc(20, centerY - 50, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw photons hitting the plate
  if (photonEnergy > 0) {
    for (let i = 0; i < Math.min(intensity / 100, 8); i++) {
      const photonProgress = ((time * 3 + i * 0.3) % 1);
      const startX = 20;
      const startY = centerY - 50 + (Math.random() - 0.5) * 40;
      const endX = plateX - 20;
      const endY = centerY + (Math.random() - 0.5) * 150;
      
      const px = startX + (endX - startX) * photonProgress;
      const py = startY + (endY - startY) * photonProgress;
      
      ctx.fillStyle = lightColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = lightColor;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Draw ejected electrons if photon energy > work function
  if (maxKE > 0) {
    const electronCount = Math.min(Math.floor(intensity / 80), 10);
    for (let i = 0; i < electronCount; i++) {
      const electronProgress = ((time * (1 + maxKE * 0.5) + i * 0.15) % 1);
      const startX = plateX + 10;
      const startY = centerY + (Math.sin(i * 1.5) * 80);
      const endX = collectorX - 10;
      const endY = centerY + (Math.sin(i * 1.5) * 60);
      
      const ex = startX + (endX - startX) * electronProgress;
      const ey = startY + (endY - startY) * electronProgress;
      
      // Electron glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00d4ff';
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(ex, ey, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Electron trail
      ctx.strokeStyle = `rgba(0, 212, 255, ${0.5 * (1 - electronProgress)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    // Current indicator
    ctx.fillStyle = '#10b981';
    ctx.font = '12px sans-serif';
    ctx.fillText('⚡ Current flowing', w/2 - 50, h - 40);
  } else {
    // No emission indicator
    ctx.fillStyle = '#ef4444';
    ctx.font = '12px sans-serif';
    ctx.fillText('✗ No emission (hν < φ)', w/2 - 60, h - 40);
  }

  // Energy level diagram
  const diagramX = w - 120;
  const diagramY = 60;
  const diagramHeight = 150;
  
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(diagramX - 10, diagramY - 10, 110, diagramHeight + 20);
  
  // Ground level
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(diagramX, diagramY + diagramHeight);
  ctx.lineTo(diagramX + 80, diagramY + diagramHeight);
  ctx.stroke();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '9px sans-serif';
  ctx.fillText('0 eV', diagramX - 5, diagramY + diagramHeight + 15);
  
  // Work function level
  const wfY = diagramY + diagramHeight - (workFunction / 6) * diagramHeight;
  ctx.strokeStyle = '#f59e0b';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(diagramX, wfY);
  ctx.lineTo(diagramX + 80, wfY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f59e0b';
  ctx.fillText(`φ = ${workFunction} eV`, diagramX, wfY - 5);
  
  // Photon energy
  const peY = diagramY + diagramHeight - (photonEnergy / 6) * diagramHeight;
  ctx.fillStyle = lightColor;
  ctx.fillRect(diagramX + 30, Math.min(peY, diagramY + diagramHeight), 20, Math.abs(diagramY + diagramHeight - peY));
  ctx.fillStyle = '#fff';
  ctx.fillText(`hν = ${photonEnergy.toFixed(2)} eV`, diagramX, Math.max(peY - 5, diagramY + 10));

  return {
    photonEnergy: photonEnergy,
    maxKE: maxKE,
    stoppingPotential: stoppingPotential,
    emissionOccurs: maxKE > 0 ? 'Yes' : 'No'
  };
}
// Realistic PN Junction Diode Simulation - VI Characteristics
export function drawPNJunction(ctx, w, h, values, time) {
  const { voltage = 0.5, temperature = 300, material = 1 } = values;

  const materials = {
    1: { name: 'Silicon (Si)', Vt: 0.026, kneeV: 0.7, Is: 1e-12, color: '#60a5fa' },
    2: { name: 'Germanium (Ge)', Vt: 0.026, kneeV: 0.3, Is: 1e-6, color: '#34d399' },
    3: { name: 'GaAs', Vt: 0.026, kneeV: 0.9, Is: 1e-14, color: '#f472b6' }
  };
  const mat = materials[material] || materials[1];
  
  const VT = (1.38e-23 * temperature) / 1.6e-19; // Thermal voltage
  const V = voltage;
  
  // Diode equation: I = Is(e^(V/VT) - 1)
  let current;
  if (V >= 0) {
    current = mat.Is * (Math.exp(Math.min(V / VT, 40)) - 1);
  } else {
    current = mat.Is * (Math.exp(V / VT) - 1); // Tiny reverse current
  }
  const currentMA = current * 1000;

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // ============ DIODE PHYSICAL DIAGRAM ============
  const dX = w / 2 - 100, dY = 60;

  // P-type region
  const pGrad = ctx.createLinearGradient(dX - 80, dY, dX, dY);
  pGrad.addColorStop(0, '#7f1d1d');
  pGrad.addColorStop(1, '#dc2626');
  ctx.fillStyle = pGrad;
  ctx.fillRect(dX - 80, dY, 80, 80);
  ctx.fillStyle = '#fca5a5';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('P', dX - 40, dY + 45);
  // Holes (positive carriers)
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(dX - 70 + (i % 4) * 18, dY + 15 + Math.floor(i / 4) * 40, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(dX - 70 + (i % 4) * 18, dY + 15 + Math.floor(i / 4) * 40, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('+', dX - 70 + (i % 4) * 18, dY + 18 + Math.floor(i / 4) * 40);
  }

  // Junction (depletion region)
  const depW = V >= 0 ? Math.max(4, 15 - V * 15) : 15 + Math.abs(V) * 5;
  const depGrad = ctx.createLinearGradient(dX, dY, dX + depW, dY);
  depGrad.addColorStop(0, 'rgba(0,0,0,0.8)');
  depGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
  ctx.fillStyle = depGrad;
  ctx.fillRect(dX, dY, depW, 80);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Dep.', dX + depW / 2, dY + 45);
  ctx.fillText(`${depW.toFixed(0)}µm`, dX + depW / 2, dY + 58);

  // N-type region
  const nGrad = ctx.createLinearGradient(dX + depW, dY, dX + depW + 80, dY);
  nGrad.addColorStop(0, '#1e3a8a');
  nGrad.addColorStop(1, '#2563eb');
  ctx.fillStyle = nGrad;
  ctx.fillRect(dX + depW, dY, 80, 80);
  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('N', dX + depW + 40, dY + 45);
  // Electrons (negative carriers)
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(dX + depW + 8 + (i % 4) * 18, dY + 15 + Math.floor(i / 4) * 40, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('−', dX + depW + 8 + (i % 4) * 18, dY + 18 + Math.floor(i / 4) * 40);
  }

  // ============ CIRCUIT CONNECTIONS ============
  // Battery + - 
  const biasColor = V >= 0 ? '#10b981' : '#ef4444';
  ctx.strokeStyle = biasColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(dX - 80, dY + 40);
  ctx.lineTo(dX - 110, dY + 40);
  ctx.lineTo(dX - 110, dY + 130);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(dX + depW + 80, dY + 40);
  ctx.lineTo(dX + depW + 110, dY + 40);
  ctx.lineTo(dX + depW + 110, dY + 130);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(dX - 110, dY + 130);
  ctx.lineTo(dX + depW + 110, dY + 130);
  ctx.stroke();

  // Battery symbol
  const batX = dX + depW / 2;
  const batY = dY + 130;
  ctx.strokeStyle = biasColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(batX - 15, batY);
  ctx.lineTo(batX - 15, batY + 20);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(batX - 15, batY + 20);
  ctx.lineTo(batX + 15, batY + 20);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(batX - 8, batY + 28);
  ctx.lineTo(batX + 8, batY + 28);
  ctx.stroke();
  ctx.fillStyle = biasColor;
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`V = ${V.toFixed(2)}V`, batX, batY + 45);
  ctx.fillText(V >= 0 ? 'Forward Bias' : 'Reverse Bias', batX, batY + 58);

  // Current flow animation
  if (V > mat.kneeV * 0.8 && current > 1e-6) {
    const numElec = Math.min(8, Math.floor(currentMA * 2));
    for (let i = 0; i < numElec; i++) {
      const phase = (time * 1.5 + i / numElec) % 1;
      const ex = dX - 80 + phase * (depW + 160);
      ctx.beginPath();
      ctx.arc(ex, dY + 40, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fbbf24';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // ============ VI CHARACTERISTIC GRAPH ============
  const gX = w - 290, gY = 40;
  const gW = 260, gH = 250;
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.fillRect(gX, gY, gW, gH);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.strokeRect(gX, gY, gW, gH);

  const originX = gX + 60;
  const originY = gY + gH * 0.25;

  // Axes
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(gX + 10, originY);
  ctx.lineTo(gX + gW - 10, originY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(originX, gY + 10);
  ctx.lineTo(originX, gY + gH - 10);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('V (volts)', gX + gW / 2 + 30, gY + gH - 2);
  ctx.save();
  ctx.translate(gX + 12, gY + gH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('I (mA)', 0, 0);
  ctx.restore();
  ctx.fillText('0', originX - 8, originY + 12);

  // VI curve - forward bias (right side)
  ctx.beginPath();
  ctx.strokeStyle = mat.color;
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 6;
  ctx.shadowColor = mat.color;
  let firstFwd = true;
  for (let v = -1.5; v <= 1.5; v += 0.01) {
    let I_mA;
    if (v >= 0) {
      I_mA = mat.Is * (Math.exp(Math.min(v / VT, 40)) - 1) * 1000;
      I_mA = Math.min(I_mA, 40);
    } else {
      I_mA = mat.Is * (Math.exp(v / VT) - 1) * 1000;
    }
    const px = originX + (v / 1.5) * (gW - 70);
    const py = originY - (I_mA / 40) * (gH - 70);
    if (px < gX + 10 || px > gX + gW - 10) continue;
    if (py < gY + 10 || py > gY + gH - 10) continue;
    firstFwd ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    firstFwd = false;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Knee voltage label
  const kneeX = originX + (mat.kneeV / 1.5) * (gW - 70);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(kneeX, originY);
  ctx.lineTo(kneeX, originY - (gH - 70) * 0.3);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#fbbf24';
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`Vk=${mat.kneeV}V`, kneeX, originY + 12);

  // Current point on graph
  const currV_px = originX + (V / 1.5) * (gW - 70);
  const currI_py = originY - (Math.min(currentMA, 40) / 40) * (gH - 70);
  if (currV_px > gX + 10 && currV_px < gX + gW - 10 && currI_py > gY + 10 && currI_py < gY + gH - 10) {
    ctx.beginPath();
    ctx.arc(currV_px, currI_py, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(currV_px, currI_py, 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ============ DATA PANEL ============
  const panelX = 30;
  const panelY = h - 200;
  ctx.fillStyle = 'rgba(15,23,42,0.97)';
  ctx.fillRect(panelX, panelY, 310, 185);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, 310, 185);
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('PN JUNCTION DIODE', panelX + 10, panelY + 20);

  const rows = [
    ['Material', mat.name],
    ['Temperature T', `${temperature} K`],
    ['Thermal Volt VT', `${(VT * 1000).toFixed(2)} mV`],
    ['Applied Voltage V', `${V.toFixed(2)} V`],
    ['Bias Type', V >= 0 ? 'FORWARD' : 'REVERSE'],
    ['Saturation Curr Is', mat.Is.toExponential(1) + ' A'],
    ['Current I = Is(e^V/VT-1)', `${currentMA.toFixed(4)} mA`],
    ['Knee Voltage', `${mat.kneeV} V`],
    ['Dyn. Resistance rd', V > 0.1 ? `${(VT / (current + mat.Is) * 1000).toFixed(1)} Ω` : '∞']
  ];
  rows.forEach(([label, val], i) => {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(label, panelX + 10, panelY + 38 + i * 16);
    ctx.fillStyle = i === 4 ? (V >= 0 ? '#10b981' : '#ef4444') : i === 6 ? '#fbbf24' : '#e2e8f0';
    ctx.textAlign = 'right';
    ctx.fillText(val, panelX + 300, panelY + 38 + i * 16);
    ctx.textAlign = 'left';
  });

  return {
    material: mat.name,
    voltage: V.toFixed(2) + ' V',
    current: currentMA.toFixed(4) + ' mA',
    biasType: V >= 0 ? 'Forward' : 'Reverse',
    dynamicResistance: V > 0.1 ? (VT / (current + mat.Is) * 1000).toFixed(1) + ' Ω' : '∞',
    powerDissipation: (V * current * 1000).toFixed(4) + ' mW'
  };
}
// High-accuracy projectile motion simulation
