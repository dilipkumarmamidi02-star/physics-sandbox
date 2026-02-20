export function drawInterference(ctx, w, h, values, time) {
  const { wavelength, slitSeparation, screenDistance } = values;
  
  // Convert units
  const lambda = wavelength * 1e-9; // nm to m
  const d = slitSeparation * 1e-3; // mm to m
  const D = screenDistance * 0.01; // cm to m
  
  // Fringe width in screen pixels
  const fringeWidth = (lambda * D / d) * 1e6 * 2; // Scale factor for visibility
  
  const slitX = 120;
  const screenX = w - 80;
  const centerY = h / 2;
  const slitGap = 60;

  // Dark background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, w, h);

  // Draw barrier with slits
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(slitX - 15, 0, 30, h);
  
  // Cut out slits with glow
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(slitX - 5, centerY - slitGap - 15, 10, 30);
  ctx.fillRect(slitX - 5, centerY + slitGap - 15, 10, 30);
  
  // Slit glow effect
  ctx.shadowBlur = 15;
  ctx.shadowColor = `hsl(${60 + (wavelength - 400) * 0.4}, 100%, 50%)`;
  ctx.fillStyle = `hsla(${60 + (wavelength - 400) * 0.4}, 100%, 50%, 0.5)`;
  ctx.fillRect(slitX - 3, centerY - slitGap - 13, 6, 26);
  ctx.fillRect(slitX - 3, centerY + slitGap - 13, 6, 26);
  ctx.shadowBlur = 0;

  // Draw screen
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(screenX, 30, 40, h - 60);

  // Draw interference pattern on screen
  for (let y = 30; y < h - 30; y++) {
    const screenY = y - centerY;
    
    // Path difference
    const y1 = Math.sqrt(Math.pow(screenX - slitX, 2) + Math.pow(screenY - slitGap, 2));
    const y2 = Math.sqrt(Math.pow(screenX - slitX, 2) + Math.pow(screenY + slitGap, 2));
    const pathDiff = Math.abs(y1 - y2);
    
    // Phase difference
    const phase = (2 * Math.PI * pathDiff) / (lambda * 1e6);
    
    // Intensity using cos^2
    const intensity = Math.pow(Math.cos(phase / 2), 2);
    
    // Draw with wavelength color
    const hue = 60 + (wavelength - 400) * 0.4;
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${intensity})`;
    ctx.fillRect(screenX, y, 40, 1);
  }

  // Draw wavefronts from slits (animated)
  const waveSpeed = 100;
  const maxRadius = screenX - slitX;
  
  for (let r = (time * waveSpeed) % 30; r < maxRadius; r += 30) {
    // Wave from upper slit
    ctx.beginPath();
    ctx.arc(slitX, centerY - slitGap, r, -Math.PI/3, Math.PI/3);
    ctx.strokeStyle = `hsla(${60 + (wavelength - 400) * 0.4}, 100%, 50%, ${0.3 * (1 - r/maxRadius)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Wave from lower slit
    ctx.beginPath();
    ctx.arc(slitX, centerY + slitGap, r, -Math.PI/3, Math.PI/3);
    ctx.stroke();
  }

  // Draw light source
  ctx.shadowBlur = 30;
  ctx.shadowColor = `hsl(${60 + (wavelength - 400) * 0.4}, 100%, 50%)`;
  const sourceGradient = ctx.createRadialGradient(30, centerY, 0, 30, centerY, 20);
  sourceGradient.addColorStop(0, `hsl(${60 + (wavelength - 400) * 0.4}, 100%, 70%)`);
  sourceGradient.addColorStop(1, `hsla(${60 + (wavelength - 400) * 0.4}, 100%, 50%, 0)`);
  ctx.fillStyle = sourceGradient;
  ctx.beginPath();
  ctx.arc(30, centerY, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw rays from source to slits
  ctx.strokeStyle = `hsla(${60 + (wavelength - 400) * 0.4}, 100%, 50%, 0.3)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, centerY);
  ctx.lineTo(slitX - 15, centerY - slitGap);
  ctx.moveTo(30, centerY);
  ctx.lineTo(slitX - 15, centerY + slitGap);
  ctx.stroke();

  // Labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.fillText('Light Source', 10, centerY + 35);
  ctx.fillText('Double Slit', slitX - 25, 20);
  ctx.fillText('Screen', screenX + 5, 20);
  
  // Fringe labels on screen
  ctx.fillStyle = '#64748b';
  ctx.font = '9px sans-serif';
  ctx.fillText('m=0', screenX + 45, centerY + 3);
  ctx.fillText('m=1', screenX + 45, centerY - fringeWidth + 3);
  ctx.fillText('m=1', screenX + 45, centerY + fringeWidth + 3);

  return {
    fringeWidth: (lambda * D / d) * 1000, // in mm
    wavelength: wavelength,
    centralMaxima: 'Bright'
  };
}
  // Realistic LCR Resonance Circuit Simulation
export function drawLCRResonance(ctx, w, h, values, time) {
  const { inductance = 0.1, capacitance = 100, resistance = 50, frequency = 159 } = values;
  
  const L = inductance; // H
  const C = capacitance * 1e-6; // µF to F
  const R = resistance; // Ω
  const f = frequency; // Hz
  const omega = 2 * Math.PI * f;
  
  // Resonant frequency
  const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
  const omega0 = 2 * Math.PI * f0;
  
  // Impedance
  const XL = omega * L;
  const XC = 1 / (omega * C);
  const Z = Math.sqrt(R * R + (XL - XC) * (XL - XC));
  const phaseAngle = Math.atan2(XL - XC, R) * 180 / Math.PI;
  
  // Quality factor & bandwidth
  const Q = (1 / R) * Math.sqrt(L / C);
  const bandwidth = f0 / Q;
  const powerFactor = Math.cos(phaseAngle * Math.PI / 180);
  
  // Assume 10V supply
  const Vs = 10;
  const I = Vs / Z;
  const VL = I * XL;
  const VC = I * XC;
  const VR = I * R;

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // ============ CIRCUIT DIAGRAM ============
  const cX = 100, cY = 80, cW = w - 280, cH = 160;

  // Top wire
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cX, cY);
  ctx.lineTo(cX + cW, cY);
  ctx.stroke();
  // Bottom wire
  ctx.beginPath();
  ctx.moveTo(cX, cY + cH);
  ctx.lineTo(cX + cW, cY + cH);
  ctx.stroke();
  // Left/right connectors
  ctx.beginPath();
  ctx.moveTo(cX, cY);
  ctx.lineTo(cX, cY + cH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cX + cW, cY);
  ctx.lineTo(cX + cW, cY + cH);
  ctx.stroke();

  // AC Source (left side)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(cX, cY + cH / 2, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cX, cY + cH / 2, 20, 0, Math.PI * 2);
  ctx.stroke();
  const acPhase = time * f * 0.1;
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = -15; i <= 15; i++) {
    const x = cX + i;
    const y = cY + cH / 2 + 10 * Math.sin((i / 15) * Math.PI * 2);
    i === -15 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = '#10b981';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${Vs}V`, cX, cY + cH / 2 + 33);
  ctx.fillText(`${f.toFixed(0)}Hz`, cX, cY + cH / 2 + 45);

  // Resistor
  const rX = cX + cW * 0.25;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.strokeRect(rX - 25, cY - 14, 50, 14);
  ctx.fillStyle = '#f59e0b';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`R=${R}Ω`, rX, cY - 20);
  ctx.fillStyle = '#fef3c7';
  ctx.font = '9px monospace';
  ctx.fillText(`VR=${VR.toFixed(2)}V`, rX, cY + 14);

  // Inductor (coil symbol)
  const lX = cX + cW * 0.5;
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const coilPts = 6;
  for (let i = 0; i <= coilPts * 20; i++) {
    const t = i / 20;
    const x = lX - 30 + (t / coilPts) * 60;
    const y = cY - 7 + 7 * Math.sin(t * Math.PI) * (Math.sin(t * Math.PI * coilPts) > 0 ? -1 : 1);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = '#3b82f6';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`L=${inductance*1000}mH`, lX, cY - 22);
  ctx.fillText(`XL=${XL.toFixed(1)}Ω`, lX, cY + 14);
  ctx.fillStyle = '#bfdbfe';
  ctx.font = '9px monospace';
  ctx.fillText(`VL=${VL.toFixed(2)}V`, lX, cY + 26);

  // Capacitor
  const capX = cX + cW * 0.75;
  ctx.strokeStyle = '#a78bfa';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(capX - 20, cY);
  ctx.lineTo(capX - 5, cY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(capX + 5, cY);
  ctx.lineTo(capX + 20, cY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(capX - 5, cY - 12);
  ctx.lineTo(capX - 5, cY + 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(capX + 5, cY - 12);
  ctx.lineTo(capX + 5, cY + 12);
  ctx.stroke();
  ctx.fillStyle = '#a78bfa';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`C=${capacitance}µF`, capX, cY - 22);
  ctx.fillText(`XC=${XC.toFixed(1)}Ω`, capX, cY + 22);
  ctx.fillStyle = '#ddd6fe';
  ctx.font = '9px monospace';
  ctx.fillText(`VC=${VC.toFixed(2)}V`, capX, cY + 34);

  // Current indicator (animated)
  const currentColor = Math.abs(f - f0) < bandwidth ? '#ef4444' : '#94a3b8';
  const electronPhase = time * 2;
  for (let i = 0; i < 5; i++) {
    const pos = ((electronPhase + i * 0.2) % 1);
    let ex, ey;
    if (pos < 0.25) { ex = cX + pos / 0.25 * cW; ey = cY; }
    else if (pos < 0.5) { ex = cX + cW; ey = cY + (pos - 0.25) / 0.25 * cH; }
    else if (pos < 0.75) { ex = cX + cW - (pos - 0.5) / 0.25 * cW; ey = cY + cH; }
    else { ex = cX; ey = cY + cH - (pos - 0.75) / 0.25 * cH; }
    ctx.beginPath();
    ctx.arc(ex, ey, 4, 0, Math.PI * 2);
    ctx.fillStyle = currentColor;
    ctx.shadowBlur = 8;
    ctx.shadowColor = currentColor;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // ============ RESONANCE CURVE ============
  const gX = w - 240, gY = 60;
  const gW = 210, gH = 200;
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.fillRect(gX, gY, gW, gH);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(gX, gY, gW, gH);

  // Axes
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(gX + 25, gY + 10);
  ctx.lineTo(gX + 25, gY + gH - 25);
  ctx.lineTo(gX + gW - 10, gY + gH - 25);
  ctx.stroke();

  // I vs f curve
  const fMin = Math.max(10, f0 * 0.2);
  const fMax = f0 * 3;
  ctx.beginPath();
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2.5;
  let first = true;
  for (let fi = fMin; fi <= fMax; fi += (fMax - fMin) / 200) {
    const wo = 2 * Math.PI * fi;
    const xl = wo * L;
    const xc = 1 / (wo * C);
    const zi = Math.sqrt(R * R + (xl - xc) * (xl - xc));
    const ii = Vs / zi;
    const maxI = Vs / R;
    const px = gX + 25 + ((fi - fMin) / (fMax - fMin)) * (gW - 35);
    const py = gY + gH - 25 - (ii / maxI) * (gH - 35);
    first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    first = false;
  }
  ctx.stroke();

  // Resonance marker
  const f0PX = gX + 25 + ((f0 - fMin) / (fMax - fMin)) * (gW - 35);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.moveTo(f0PX, gY + 10);
  ctx.lineTo(f0PX, gY + gH - 25);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ef4444';
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`f₀=${f0.toFixed(1)}Hz`, f0PX, gY + 8);

  // Current point
  const currF_px = gX + 25 + ((f - fMin) / (fMax - fMin)) * (gW - 35);
  const iMax = Vs / R;
  const currI_py = gY + gH - 25 - (I / iMax) * (gH - 35);
  ctx.beginPath();
  ctx.arc(currF_px, currI_py, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  // BW markers
  const f1 = f0 - bandwidth / 2, f2 = f0 + bandwidth / 2;
  [f1, f2].forEach(fx => {
    const bpx = gX + 25 + ((fx - fMin) / (fMax - fMin)) * (gW - 35);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(bpx, gY + 25);
    ctx.lineTo(bpx, gY + gH - 25);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  ctx.fillStyle = '#94a3b8';
  ctx.font = '9px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('I', gX + 12, gY + 16);
  ctx.textAlign = 'center';
  ctx.fillText('Frequency (Hz)', gX + gW / 2, gY + gH - 6);

  // ============ DATA PANEL ============
  const panelX = 30;
  const panelY = h - 210;
  ctx.fillStyle = 'rgba(15,23,42,0.97)';
  ctx.fillRect(panelX, panelY, 330, 195);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, 330, 195);
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('LCR RESONANCE ANALYSIS', panelX + 10, panelY + 20);

  const at_res = Math.abs(f - f0) < 5 ? ' ← RESONANCE!' : '';
  const rows = [
    ['Resonant Freq f₀', `${f0.toFixed(2)} Hz${at_res}`],
    ['Applied Freq f', `${f} Hz`],
    ['Inductive React XL', `${XL.toFixed(2)} Ω`],
    ['Capacitive React XC', `${XC.toFixed(2)} Ω`],
    ['Impedance Z', `${Z.toFixed(2)} Ω`],
    ['Current I = V/Z', `${(I * 1000).toFixed(2)} mA`],
    ['Phase Angle φ', `${phaseAngle.toFixed(1)}°`],
    ['Power Factor cosφ', powerFactor.toFixed(4)],
    ['Quality Factor Q', Q.toFixed(2)],
    ['Bandwidth Δf', `${bandwidth.toFixed(2)} Hz`]
  ];
  rows.forEach(([label, val], i) => {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(label, panelX + 10, panelY + 38 + i * 16);
    ctx.fillStyle = i === 0 && at_res ? '#ef4444' : i === 5 ? '#fbbf24' : '#e2e8f0';
    ctx.textAlign = 'right';
    ctx.fillText(val, panelX + 320, panelY + 38 + i * 16);
    ctx.textAlign = 'left';
  });

  return {
    resonantFreq: f0.toFixed(2) + ' Hz',
    impedance: Z.toFixed(2) + ' Ω',
    current: (I * 1000).toFixed(2) + ' mA',
    phaseAngle: phaseAngle.toFixed(1) + '°',
    qualityFactor: Q.toFixed(2),
    bandwidth: bandwidth.toFixed(2) + ' Hz',
    powerFactor: powerFactor.toFixed(4)
  };
}
  export function drawLens(ctx, w, h, values, time) {
  const { focalLength, objectDistance, objectHeight } = values;
  
  const scale = 3; // cm to pixels
  const lensX = w / 2;
  const centerY = h / 2;
  
  // Calculate image properties
  const v = (focalLength * objectDistance) / (objectDistance - focalLength);
  const magnification = -v / objectDistance;
  const imageHeight = magnification * objectHeight;
  
  const isRealImage = v > 0;
  const isInverted = magnification < 0;
  
  // Draw optical axis
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(50, centerY);
  ctx.lineTo(w - 50, centerY);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw lens
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(lensX, centerY - 100);
  ctx.quadraticCurveTo(lensX + 15, centerY, lensX, centerY + 100);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(lensX, centerY - 100);
  ctx.quadraticCurveTo(lensX - 15, centerY, lensX, centerY + 100);
  ctx.stroke();
  
  // Focal points
  const f1X = lensX - focalLength * scale;
  const f2X = lensX + focalLength * scale;
  
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(f1X, centerY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(f2X, centerY, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#f59e0b';
  ctx.font = '12px sans-serif';
  ctx.fillText('F', f1X, centerY + 20);
  ctx.fillText('F', f2X, centerY + 20);
  
  // Object
  const objX = lensX - objectDistance * scale;
  const objY = centerY;
  
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(objX, objY);
  ctx.lineTo(objX, objY - objectHeight * scale);
  ctx.stroke();
  
  // Arrow head
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.moveTo(objX, objY - objectHeight * scale);
  ctx.lineTo(objX - 5, objY - objectHeight * scale + 10);
  ctx.lineTo(objX + 5, objY - objectHeight * scale + 10);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillText('Object', objX - 20, objY + 20);
  ctx.fillText(`h = ${objectHeight} cm`, objX - 30, objY + 35);
  
  // Image
  if (Math.abs(v) < 200 && Math.abs(imageHeight) < 50) {
    const imgX = lensX + v * scale;
    const imgY = centerY;
    
    ctx.strokeStyle = isRealImage ? '#ef4444' : '#a855f7';
    ctx.lineWidth = 3;
    if (!isRealImage) ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.moveTo(imgX, imgY);
    ctx.lineTo(imgX, imgY - imageHeight * scale);
    ctx.stroke();
    
    // Arrow head
    ctx.fillStyle = isRealImage ? '#ef4444' : '#a855f7';
    const arrowDir = imageHeight > 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(imgX, imgY - imageHeight * scale);
    ctx.lineTo(imgX - 5, imgY - imageHeight * scale + arrowDir * 10);
    ctx.lineTo(imgX + 5, imgY - imageHeight * scale + arrowDir * 10);
    ctx.closePath();
    ctx.fill();
    
    ctx.setLineDash([]);
    
    ctx.fillText(isRealImage ? 'Real Image' : 'Virtual Image', imgX - 20, imgY + 20);
    ctx.fillText(`h' = ${Math.abs(imageHeight).toFixed(1)} cm`, imgX - 30, imgY + 35);
    ctx.fillText(isInverted ? '(Inverted)' : '(Erect)', imgX - 20, imgY + 50);
  }
  
  // Ray diagram
  if (objectDistance > focalLength) {
    // Ray 1: Parallel to axis, through F
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(objX, objY - objectHeight * scale);
    ctx.lineTo(lensX, objY - objectHeight * scale);
    ctx.lineTo(lensX + v * scale, centerY - imageHeight * scale);
    ctx.stroke();
    
    // Ray 2: Through optical center
    ctx.strokeStyle = '#4ecdc4';
    ctx.beginPath();
    ctx.moveTo(objX, objY - objectHeight * scale);
    ctx.lineTo(lensX + v * scale, centerY - imageHeight * scale);
    ctx.stroke();
    
    // Ray 3: Through F, parallel after lens
    ctx.strokeStyle = '#95e1d3';
    ctx.beginPath();
    ctx.moveTo(objX, objY - objectHeight * scale);
    ctx.lineTo(f1X, centerY);
    ctx.lineTo(lensX + v * scale, centerY - imageHeight * scale);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
  }
  
  // Info panel
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(20, 20, 250, 140);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 250, 140);
  
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Lens Formula: 1/f = 1/v - 1/u', 30, 40);
  
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`Object Distance (u): -${objectDistance} cm`, 30, 65);
  ctx.fillText(`Image Distance (v): ${v > 0 ? '+' : ''}${v.toFixed(1)} cm`, 30, 85);
  ctx.fillText(`Magnification (m): ${magnification.toFixed(2)}`, 30, 105);
  ctx.fillText(`Nature: ${isRealImage ? 'Real' : 'Virtual'}, ${isInverted ? 'Inverted' : 'Erect'}`, 30, 125);
  ctx.fillText(`Size: ${Math.abs(magnification) > 1 ? 'Magnified' : 'Diminished'}`, 30, 145);
  
  return {
    imageDistance: v.toFixed(2),
    imageHeight: Math.abs(imageHeight).toFixed(2),
    magnification: magnification.toFixed(2),
    nature: isRealImage ? 'Real' : 'Virtual',
    orientation: isInverted ? 'Inverted' : 'Erect',
    size: Math.abs(magnification) > 1 ? 'Magnified' : 'Diminished'
  };
}
// Modern physics simulations: Compton, Hydrogen Spectrum, X-Ray Diffraction,
// Hall Effect, Stefan-Boltzmann, Nuclear Decay, Quantum Tunneling, 
// Particle in a Box (wave-function), Superconductivity
