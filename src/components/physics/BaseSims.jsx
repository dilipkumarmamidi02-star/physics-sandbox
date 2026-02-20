export function drawProjectile(ctx, w, h, values, time) {
  const { velocity, angle, height } = values;
  const g = 9.8;
  const scale = 4;
  const startX = 80;
  const groundY = h - 60;
  const startY = groundY - height * scale;

  const vx = velocity * Math.cos(angle * Math.PI / 180);
  const vy = velocity * Math.sin(angle * Math.PI / 180);
  
  // Time of flight calculation
  const timeOfFlight = (vy + Math.sqrt(vy * vy + 2 * g * height)) / g;
  const loopTime = time % (timeOfFlight + 1);
  
  // Current position
  const x = startX + vx * loopTime * scale;
  const y = startY - (vy * loopTime - 0.5 * g * loopTime * loopTime) * scale;

  // Draw sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGradient.addColorStop(0, 'rgba(15, 23, 42, 0.5)');
  skyGradient.addColorStop(1, 'rgba(30, 41, 59, 0.3)');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, w, groundY);

  // Draw ground with gradient
  const groundGradient = ctx.createLinearGradient(0, groundY, 0, h);
  groundGradient.addColorStop(0, '#334155');
  groundGradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, groundY, w, h - groundY);
  
  // Draw grass line
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();

  // Draw distance markers
  ctx.fillStyle = 'rgba(100, 116, 139, 0.5)';
  ctx.font = '10px sans-serif';
  for (let d = 0; d <= 200; d += 20) {
    const markerX = startX + d * scale;
    if (markerX < w - 20) {
      ctx.fillRect(markerX, groundY, 1, 10);
      ctx.fillText(`${d}m`, markerX - 10, groundY + 22);
    }
  }

  // Draw complete trajectory path
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
  ctx.lineWidth = 2;
  for (let t = 0; t <= timeOfFlight; t += 0.02) {
    const px = startX + vx * t * scale;
    const py = startY - (vy * t - 0.5 * g * t * t) * scale;
    if (py <= groundY) {
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // Draw traveled path with glow
  ctx.beginPath();
  ctx.strokeStyle = '#00d4ff';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00d4ff';
  ctx.lineWidth = 3;
  for (let t = 0; t <= loopTime; t += 0.02) {
    const px = startX + vx * t * scale;
    const py = startY - (vy * t - 0.5 * g * t * t) * scale;
    if (py <= groundY) {
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Draw launcher
  ctx.save();
  ctx.translate(startX, startY);
  ctx.rotate(-angle * Math.PI / 180);
  
  // Launcher body
  const launcherGradient = ctx.createLinearGradient(0, -10, 0, 10);
  launcherGradient.addColorStop(0, '#64748b');
  launcherGradient.addColorStop(0.5, '#475569');
  launcherGradient.addColorStop(1, '#334155');
  ctx.fillStyle = launcherGradient;
  ctx.fillRect(-10, -12, 55, 24);
  
  // Launcher barrel
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(35, -8, 25, 16);
  ctx.restore();
  
  // Draw platform
  ctx.fillStyle = '#475569';
  ctx.fillRect(startX - 30, startY, 60, groundY - startY);

  // Draw projectile if still in flight
  if (y <= groundY && loopTime < timeOfFlight) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#f59e0b';
    
    const ballGradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, 12);
    ballGradient.addColorStop(0, '#fcd34d');
    ballGradient.addColorStop(0.5, '#f59e0b');
    ballGradient.addColorStop(1, '#d97706');
    
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fillStyle = ballGradient;
    ctx.fill();
    
    // Velocity vector
    const currentVy = vy - g * loopTime;
    const vecScale = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + vx * vecScale, y - currentVy * vecScale);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }

  // Draw max height indicator
  const maxHeight = height + (vy * vy) / (2 * g);
  const maxHeightY = groundY - maxHeight * scale;
  const maxHeightX = startX + vx * (vy / g) * scale;
  
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(maxHeightX, groundY);
  ctx.lineTo(maxHeightX, maxHeightY);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Max height label
  ctx.fillStyle = '#f59e0b';
  ctx.font = '10px sans-serif';
  ctx.fillText(`H = ${maxHeight.toFixed(1)}m`, maxHeightX + 5, maxHeightY);

  // Calculate range
  const range = (vx * (vy + Math.sqrt(vy * vy + 2 * g * height))) / g;

  return {
    range: range,
    maxHeight: maxHeight,
    timeOfFlight: timeOfFlight,
    currentX: (x - startX) / scale,
    currentY: (startY - y) / scale
  };
}
export function drawRefraction(ctx, w, h, values, time) {
  const { prismAngle, incidentAngle, refractiveIndex } = values;
  
  const centerX = w / 2;
  const centerY = h / 2;
  const prismSize = 150;
  
  // Convert angles to radians
  const A = prismAngle * Math.PI / 180;
  const i = incidentAngle * Math.PI / 180;
  
  // Calculate refraction
  const r1 = Math.asin(Math.sin(i) / refractiveIndex);
  const angleInPrism = A - r1;
  const r2 = Math.asin(refractiveIndex * Math.sin(angleInPrism));
  const deviation = i + r2 - A;
  
  // Prism vertices
  const prismPath = [
    { x: centerX, y: centerY - prismSize },
    { x: centerX + prismSize * Math.cos(A), y: centerY + prismSize * Math.sin(A) },
    { x: centerX - prismSize * Math.cos(A), y: centerY + prismSize * Math.sin(A) }
  ];
  
  // Draw prism
  ctx.fillStyle = 'rgba(100, 212, 255, 0.2)';
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(prismPath[0].x, prismPath[0].y);
  ctx.lineTo(prismPath[1].x, prismPath[1].y);
  ctx.lineTo(prismPath[2].x, prismPath[2].y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Ray paths
  const rayStartX = 100;
  const rayStartY = centerY - Math.tan(i) * (centerX - rayStartX - prismSize/2);
  
  // Incident ray
  drawRay(ctx, rayStartX, rayStartY, 
          centerX - prismSize/2, centerY - prismSize/2, 
          '#ff6b6b', 'Incident');
  
  // Refracted ray inside prism
  const entryX = centerX - prismSize/2;
  const entryY = centerY - prismSize/2;
  const exitX = centerX + prismSize * Math.cos(A) / 2;
  const exitY = centerY;
  
  drawRay(ctx, entryX, entryY, exitX, exitY, '#ffd93d', 'Refracted');
  
  // Emergent ray
  const emergentEndX = w - 100;
  const emergentEndY = exitY + Math.tan(r2 + deviation) * (emergentEndX - exitX);
  drawRay(ctx, exitX, exitY, emergentEndX, emergentEndY, '#6bcf7f', 'Emergent');
  
  // Normal lines at entry and exit
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 1;
  
  // Entry normal
  ctx.beginPath();
  ctx.moveTo(entryX, entryY - 50);
  ctx.lineTo(entryX, entryY + 50);
  ctx.stroke();
  
  // Exit normal
  ctx.beginPath();
  ctx.moveTo(exitX - 30, exitY - 30);
  ctx.lineTo(exitX + 30, exitY + 30);
  ctx.stroke();
  
  ctx.setLineDash([]);
  
  // Angles display
  ctx.fillStyle = '#00d4ff';
  ctx.font = '12px sans-serif';
  ctx.fillText(`i = ${incidentAngle}°`, entryX - 60, entryY - 20);
  ctx.fillText(`r₁ = ${(r1 * 180 / Math.PI).toFixed(1)}°`, entryX + 20, entryY + 20);
  ctx.fillText(`r₂ = ${(r2 * 180 / Math.PI).toFixed(1)}°`, exitX + 30, exitY - 10);
  
  // Deviation arc
  const devAngle = deviation * 180 / Math.PI;
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(exitX, exitY, 60, -Math.PI/2, -Math.PI/2 + deviation, false);
  ctx.stroke();
  
  ctx.fillStyle = '#ec4899';
  ctx.fillText(`δ = ${devAngle.toFixed(1)}°`, exitX + 70, exitY - 30);
  
  // Dispersion effect (rainbow)
  if (time % 2 < 1) {
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    colors.forEach((color, index) => {
      const offset = (index - 3) * 3;
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(exitX, exitY);
      ctx.lineTo(emergentEndX, emergentEndY + offset);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }
  
  // Info box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(20, 20, 200, 100);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, 200, 100);
  
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Refraction Analysis', 30, 40);
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`Refractive Index: ${refractiveIndex}`, 30, 60);
  ctx.fillText(`Deviation: ${devAngle.toFixed(2)}°`, 30, 80);
  ctx.fillText(`Prism Angle: ${prismAngle}°`, 30, 100);
  
  return {
    refractedAngle: (r1 * 180 / Math.PI).toFixed(2),
    emergentAngle: (r2 * 180 / Math.PI).toFixed(2),
    deviation: devAngle.toFixed(2),
    refractiveIndex: refractiveIndex.toFixed(2)
  };
}

function drawRay(ctx, x1, y1, x2, y2, color, label) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  
  ctx.shadowBlur = 0;
  
  // Arrow
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowX = (x1 + x2) / 2;
  const arrowY = (y1 + y2) / 2;
  
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX - 10 * Math.cos(angle - Math.PI/6), arrowY - 10 * Math.sin(angle - Math.PI/6));
  ctx.lineTo(arrowX - 10 * Math.cos(angle + Math.PI/6), arrowY - 10 * Math.sin(angle + Math.PI/6));
  ctx.closePath();
  ctx.fill();
}
// Realistic Screw Gauge (Micrometer) Simulation
export function drawScrewGauge(ctx, w, h, values, time) {
  const { pitch = 0.5, thimbleDivisions = 50, objectDiameter = 1.24, zeroError = 0 } = values;
  const leastCount = pitch / thimbleDivisions; // mm

  const trueValue = objectDiameter + zeroError * leastCount;
  const sleeveReading = Math.floor(trueValue / pitch) * pitch; // How many complete rotations
  const thimbleDiv = Math.round((trueValue - sleeveReading) / leastCount);
  const thimbleReading = thimbleDiv * leastCount;
  const totalReading = sleeveReading + thimbleReading;
  const corrected = totalReading - zeroError * leastCount;

  // Gauge positions
  const gCX = w / 2;
  const gCY = h / 2 - 40;
  const frameColor = '#78716c';

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // ============ DRAW U-FRAME ============
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(gCX - 160, gCY - 60);
  ctx.lineTo(gCX - 160, gCY + 60);
  ctx.lineTo(gCX + 80, gCY + 60);
  ctx.stroke();

  // Anvil (fixed)
  ctx.fillStyle = '#a8a29e';
  ctx.beginPath();
  ctx.arc(gCX - 160, gCY - 60, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#57534e';
  ctx.beginPath();
  ctx.arc(gCX - 160, gCY - 60, 7, 0, Math.PI * 2);
  ctx.fill();

  // Spindle (moving) - position based on reading
  const spindleLen = 80 - (totalReading / 25) * 60;
  ctx.strokeStyle = '#d6d3d1';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(gCX + 80, gCY - 60);
  ctx.lineTo(gCX + 80 - spindleLen, gCY - 60);
  ctx.stroke();

  // Spindle tip
  ctx.fillStyle = '#e7e5e4';
  ctx.beginPath();
  ctx.arc(gCX + 80 - spindleLen, gCY - 60, 8, 0, Math.PI * 2);
  ctx.fill();

  // Object being measured
  const gapLeft = gCX + 80 - spindleLen + 8;
  const gapRight = gCX - 160 + 12;
  if (gapLeft < gapRight - 4) {
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(gapLeft, gCY - 60 - objectDiameter * 8, gapRight - gapLeft, objectDiameter * 16);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1;
    ctx.strokeRect(gapLeft, gCY - 60 - objectDiameter * 8, gapRight - gapLeft, objectDiameter * 16);
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Ø${objectDiameter.toFixed(2)}`, (gapLeft + gapRight) / 2, gCY - 60 + 3);
  }

  // ============ SLEEVE ============
  const sleeveX = gCX + 40;
  const sleeveY = gCY - 80;
  const sleeveGrad = ctx.createLinearGradient(sleeveX, sleeveY, sleeveX, sleeveY + 40);
  sleeveGrad.addColorStop(0, '#c0c0c0');
  sleeveGrad.addColorStop(0.5, '#f0f0f0');
  sleeveGrad.addColorStop(1, '#a0a0a0');
  ctx.fillStyle = sleeveGrad;
  ctx.fillRect(sleeveX, sleeveY, 180, 40);

  // Datum line
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sleeveX, sleeveY + 20);
  ctx.lineTo(sleeveX + 180, sleeveY + 20);
  ctx.stroke();

  // Sleeve divisions (0.5mm pitch marks)
  for (let d = 0; d <= 25; d++) {
    const x = sleeveX + (d / 25) * 180;
    const isHalf = d % 1 === 0 && Math.floor(d / 2) !== d / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = d % 2 === 0 ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(x, sleeveY + 20);
    ctx.lineTo(x, sleeveY + (d % 2 === 0 ? 0 : 9));
    ctx.stroke();
    if (d % 2 === 0) {
      ctx.fillStyle = '#000';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(d * 0.5, x, sleeveY - 2);
    }
    // Below datum (half mm)
    if (d % 2 === 1) {
      ctx.beginPath();
      ctx.moveTo(x, sleeveY + 20);
      ctx.lineTo(x, sleeveY + 33);
      ctx.stroke();
    }
  }

  // MSR arrow
  const msrX = sleeveX + (sleeveReading / 12.5) * 180;
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 2]);
  ctx.beginPath();
  ctx.moveTo(msrX, sleeveY - 10);
  ctx.lineTo(msrX, sleeveY + 45);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`MSR=${sleeveReading.toFixed(1)}`, msrX, sleeveY - 14);

  // ============ THIMBLE ============
  const thimbleX = sleeveX + 120;
  const thimbleGrad = ctx.createLinearGradient(thimbleX, sleeveY - 30, thimbleX, sleeveY + 70);
  thimbleGrad.addColorStop(0, '#b0b0b0');
  thimbleGrad.addColorStop(0.4, '#e0e0e0');
  thimbleGrad.addColorStop(1, '#888');
  ctx.fillStyle = thimbleGrad;
  ctx.fillRect(thimbleX, sleeveY - 30, 70, 100);
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.strokeRect(thimbleX, sleeveY - 30, 70, 100);

  // Thimble scale
  const thimbleRotation = thimbleDiv;
  for (let t = 0; t < thimbleDivisions; t++) {
    const relT = (t - thimbleRotation + thimbleDivisions) % thimbleDivisions;
    const y = sleeveY - 28 + (relT / thimbleDivisions) * 96;
    if (y < sleeveY - 28 || y > sleeveY + 68) continue;
    ctx.strokeStyle = t % 5 === 0 ? '#222' : '#666';
    ctx.lineWidth = t % 5 === 0 ? 1.5 : 0.7;
    ctx.beginPath();
    ctx.moveTo(thimbleX, y);
    ctx.lineTo(thimbleX + (t % 5 === 0 ? 22 : 14), y);
    ctx.stroke();
    if (t % 5 === 0) {
      ctx.fillStyle = '#111';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(t, thimbleX + 24, y + 4);
    }
  }

  // Coinciding line (datum crosses thimble)
  const coinDiv = thimbleDiv;
  const coinRelY = sleeveY - 28 + ((coinDiv) / thimbleDivisions) * 96;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sleeveX + 178, sleeveY + 20);
  ctx.lineTo(thimbleX + 2, sleeveY + 20);
  ctx.stroke();
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`Div ${coinDiv}`, thimbleX - 2, sleeveY + 19);

  // ============ READING PANEL ============
  const panelX = 30;
  const panelY = h - 200;
  ctx.fillStyle = 'rgba(15,23,42,0.97)';
  ctx.fillRect(panelX, panelY, 300, 185);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, 300, 185);
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SCREW GAUGE READING', panelX + 10, panelY + 20);

  const rows = [
    ['Pitch', `${pitch} mm`],
    ['Thimble Divisions', `${thimbleDivisions}`],
    [`LC = ${pitch}/${thimbleDivisions}`, `${leastCount.toFixed(3)} mm`],
    ['Main Scale (MSR)', `${sleeveReading.toFixed(2)} mm`],
    ['Thimble Div (CSR)', `${thimbleDiv}`],
    [`CSR × LC`, `${thimbleReading.toFixed(3)} mm`],
    ['Total = MSR+CSR×LC', `${totalReading.toFixed(3)} mm`],
    ['Zero Error', `${(zeroError * leastCount).toFixed(3)} mm`],
    ['Corrected Reading', `${corrected.toFixed(3)} mm`]
  ];

  rows.forEach(([label, val], i) => {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(label, panelX + 10, panelY + 38 + i * 16);
    ctx.fillStyle = i === rows.length - 1 ? '#10b981' : '#e2e8f0';
    ctx.textAlign = 'right';
    ctx.fillText(val, panelX + 290, panelY + 38 + i * 16);
    ctx.textAlign = 'left';
  });

  return {
    pitch: pitch + ' mm',
    leastCount: leastCount.toFixed(3) + ' mm',
    MSR: sleeveReading.toFixed(2) + ' mm',
    thimbleDiv: thimbleDiv + ' divisions',
    totalReading: totalReading.toFixed(3) + ' mm',
    zeroError: (zeroError * leastCount).toFixed(3) + ' mm',
    correctedReading: corrected.toFixed(3) + ' mm',
    area: (Math.PI * Math.pow(corrected / 2, 2)).toFixed(4) + ' mm²'
  };
}
// Realistic Sonometer Simulation - Melde's Experiment
export function drawSonometer(ctx, w, h, values, time) {
  const { tension = 4, length = 0.5, wireLinearDensity = 0.001, harmonic = 1 } = values;
  // f = (n/2L)√(T/μ)
  const velocity = Math.sqrt(tension / wireLinearDensity);
  const frequency = (harmonic * velocity) / (2 * length);
  const wavelength = (2 * length) / harmonic;

  // Box dimensions
  const bX = 60, bY = h / 2 - 50, bW = w - 200, bH = 80;

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // ============ SONOMETER BOX ============
  const woodGrad = ctx.createLinearGradient(bX, bY, bX, bY + bH);
  woodGrad.addColorStop(0, '#92400e');
  woodGrad.addColorStop(0.3, '#b45309');
  woodGrad.addColorStop(1, '#78350f');
  ctx.fillStyle = woodGrad;
  ctx.fillRect(bX, bY, bW, bH);
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 2;
  ctx.strokeRect(bX, bY, bW, bH);

  // Wood grain
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(bX, bY + i * 11);
    ctx.lineTo(bX + bW, bY + i * 11);
    ctx.stroke();
  }

  // ============ WIRE ============
  const wireY = bY - 2;
  const wireStartX = bX;
  const wireEndX = bX + bW;

  // Wire supports at ends
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(bX - 5, bY - 15, 12, 17);
  ctx.fillRect(bX + bW - 7, bY - 15, 12, 17);

  // Animated vibrating wire
  ctx.beginPath();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#fbbf24';

  const amplitude = isRunning => 8;
  const isVibrating = true;
  const A = 10 * (1 - Math.abs(Math.sin(time * 0.3)));

  for (let x = wireStartX; x <= wireEndX; x += 2) {
    const pos = (x - wireStartX) / (wireEndX - wireStartX);
    const y = wireY - A * Math.sin(harmonic * Math.PI * pos) * Math.cos(2 * Math.PI * frequency * time * 0.01);
    if (x === wireStartX) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // ============ BRIDGE PIECES ============
  // Movable bridges
  const bridge1X = wireStartX + bW * 0.1;
  const bridge2X = wireStartX + bW * 0.1 + length * (bW * 0.8);
  
  const drawBridge = (x) => {
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(x - 5, bY - 18, 10, 20);
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 5, bY - 18, 10, 20);
    // Triangle shape
    ctx.beginPath();
    ctx.moveTo(x - 5, bY - 18);
    ctx.lineTo(x + 5, bY - 18);
    ctx.lineTo(x, bY - 30);
    ctx.closePath();
    ctx.fillStyle = '#9ca3af';
    ctx.fill();
  };
  drawBridge(bridge1X);
  drawBridge(bridge2X);

  // Bridge label
  ctx.strokeStyle = '#10b981';
  ctx.setLineDash([4, 2]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bridge1X, bY - 40);
  ctx.lineTo(bridge2X, bY - 40);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`L = ${(length * 100).toFixed(0)} cm`, (bridge1X + bridge2X) / 2, bY - 45);

  // Arrows
  ['←', '→'].forEach((arrow, i) => {
    ctx.fillText(arrow, i === 0 ? bridge1X - 8 : bridge2X + 8, bY - 42);
  });

  // ============ HANGING WEIGHTS ============
  const pulleyX = wireEndX + 40;
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(wireEndX, wireY);
  ctx.lineTo(pulleyX, wireY);
  ctx.lineTo(pulleyX, wireY + 30);
  ctx.stroke();

  // Pulley
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(pulleyX, wireY, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#374151';
  ctx.beginPath();
  ctx.arc(pulleyX, wireY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Weight hanger
  ctx.fillStyle = '#475569';
  ctx.fillRect(pulleyX - 12, wireY + 30, 24, 60);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`T=${tension}N`, pulleyX, wireY + 65);

  // ============ TUNING FORK ============
  const forkX = bridge2X + 60;
  const forkY = bY - 70;
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 3;
  // Handle
  ctx.beginPath();
  ctx.moveTo(forkX, forkY + 60);
  ctx.lineTo(forkX, forkY + 100);
  ctx.stroke();
  // Prongs
  const prongOffset = Math.sin(time * frequency * 0.02) * 4;
  ctx.beginPath();
  ctx.moveTo(forkX, forkY + 60);
  ctx.lineTo(forkX - 8 - prongOffset, forkY + 20);
  ctx.lineTo(forkX - 8 - prongOffset, forkY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(forkX, forkY + 60);
  ctx.lineTo(forkX + 8 + prongOffset, forkY + 20);
  ctx.lineTo(forkX + 8 + prongOffset, forkY);
  ctx.stroke();
  ctx.fillStyle = '#c084fc';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${frequency.toFixed(1)} Hz`, forkX, forkY - 8);

  // Nodes on wire
  for (let n = 0; n <= harmonic; n++) {
    const nodeX = bridge1X + (n / harmonic) * (bridge2X - bridge1X);
    ctx.beginPath();
    ctx.arc(nodeX, wireY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
  }

  // Antinodes label
  for (let n = 0; n < harmonic; n++) {
    const antiX = bridge1X + ((n + 0.5) / harmonic) * (bridge2X - bridge1X);
    ctx.fillStyle = '#3b82f6';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('A', antiX, wireY - 14);
  }

  // ============ READING PANEL ============
  const panelX = 30;
  const panelY = h - 185;
  ctx.fillStyle = 'rgba(15,23,42,0.97)';
  ctx.fillRect(panelX, panelY, 290, 170);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, 290, 170);
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SONOMETER ANALYSIS', panelX + 10, panelY + 20);

  const rows = [
    ['Tension T', `${tension} N`],
    ['Vibrating Length L', `${(length * 100).toFixed(0)} cm`],
    ['Linear Density μ', `${(wireLinearDensity * 1000).toFixed(1)} g/m`],
    ['Harmonic n', `${harmonic}`],
    ['Wave Velocity v=√(T/μ)', `${velocity.toFixed(2)} m/s`],
    ['Wavelength λ=2L/n', `${(wavelength * 100).toFixed(2)} cm`],
    ['Frequency f=nv/2L', `${frequency.toFixed(2)} Hz`],
    ['Nodes', `${harmonic + 1}`],
    ['Antinodes', `${harmonic}`]
  ];
  rows.forEach(([label, val], i) => {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(label, panelX + 10, panelY + 38 + i * 16);
    ctx.fillStyle = i === 6 ? '#fbbf24' : '#e2e8f0';
    ctx.textAlign = 'right';
    ctx.fillText(val, panelX + 280, panelY + 38 + i * 16);
    ctx.textAlign = 'left';
  });

  return {
    velocity: velocity.toFixed(2) + ' m/s',
    frequency: frequency.toFixed(2) + ' Hz',
    wavelength: (wavelength * 100).toFixed(2) + ' cm',
    nodes: harmonic + 1,
    antinodes: harmonic,
    tension: tension + ' N',
    vibLength: (length * 100).toFixed(0) + ' cm'
  };
}
export function drawSoundWaves(ctx, w, h, values, time) {
  const { frequency, temperature, diameter } = values;
  
  // Calculate speed of sound
  const speedOfSound = 331.4 + 0.6 * temperature;
  const wavelength = speedOfSound / frequency;
  const endCorrection = 0.3 * (diameter / 100);
  
  // Resonance tube
  const tubeX = w / 2 - 40;
  const tubeWidth = 80;
  const tubeHeight = 350;
  const waterLevel = 100 + Math.sin(time * 2) * 20;
  
  // Draw water
  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(tubeX, h - waterLevel, tubeWidth, waterLevel);
  
  // Water surface shimmer
  for (let i = 0; i < tubeWidth; i += 5) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + Math.sin(time * 5 + i * 0.1) * 0.2})`;
    ctx.fillRect(tubeX + i, h - waterLevel, 4, 2);
  }
  
  // Draw tube
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(tubeX, h);
  ctx.lineTo(tubeX, h - tubeHeight);
  ctx.lineTo(tubeX + tubeWidth, h - tubeHeight);
  ctx.lineTo(tubeX + tubeWidth, h);
  ctx.stroke();
  
  // Air column
  const airColumnHeight = tubeHeight - waterLevel;
  
  // Tuning fork
  const forkX = w / 2;
  const forkY = h - tubeHeight - 60;
  
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  const vibration = Math.sin(time * frequency * 0.1) * 8;
  
  // Fork prongs
  ctx.beginPath();
  ctx.moveTo(forkX - 25 + vibration, forkY);
  ctx.lineTo(forkX - 25 + vibration, forkY - 40);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(forkX + 25 - vibration, forkY);
  ctx.lineTo(forkX + 25 - vibration, forkY - 40);
  ctx.stroke();
  
  // Fork handle
  ctx.strokeStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(forkX, forkY);
  ctx.lineTo(forkX, forkY + 30);
  ctx.stroke();
  
  // Sound waves visualization
  const numWaves = 5;
  for (let i = 0; i < numWaves; i++) {
    const wavePhase = (time * 2 - i * 0.3) % 2;
    if (wavePhase < 1) {
      const alpha = 1 - wavePhase;
      const radius = 30 + wavePhase * 60;
      
      ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(forkX, forkY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  
  // Standing wave pattern in tube
  const resonanceCondition = Math.abs(airColumnHeight - wavelength * 100 / 4) < 10;
  
  if (resonanceCondition) {
    // Draw standing wave
    for (let y = 0; y < airColumnHeight; y += 2) {
      const amplitude = Math.sin((y / (airColumnHeight + endCorrection)) * Math.PI) * 15;
      const x = Math.sin(time * frequency * 0.05) * amplitude;
      
      ctx.fillStyle = `rgba(0, 212, 255, ${0.3 + amplitude / 30})`;
      ctx.fillRect(tubeX + tubeWidth/2 + x - 1, h - waterLevel - y, 2, 2);
    }
    
    // Resonance indicator
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎵 RESONANCE DETECTED', w/2, 30);
  }
  
  // Measurements display
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Air Column: ${(airColumnHeight / 100).toFixed(2)} m`, 50, h - 50);
  ctx.fillText(`Wavelength: ${(wavelength * 100).toFixed(1)} cm`, 50, h - 30);
  ctx.fillText(`λ/4: ${(wavelength * 25).toFixed(1)} cm`, 50, h - 10);
  
  return {
    speedOfSound: speedOfSound.toFixed(1),
    wavelength: (wavelength * 100).toFixed(2),
    airColumnLength: (airColumnHeight / 100).toFixed(3),
    resonance: resonanceCondition ? 'Yes' : 'No',
    endCorrection: (endCorrection * 100).toFixed(2)
  };
}
// Realistic Vernier Caliper Simulation
export function drawVernierCaliper(ctx, w, h, values, time) {
  const { objectSize = 2.3, lcDivisions = 10, zeroError = 0 } = values;
  const leastCount = 1 / lcDivisions; // mm
  
  // Calculate actual reading
  const trueMeasurement = objectSize + zeroError * 0.1;
  const msr = Math.floor(trueMeasurement / 1) * 1; // Main scale reading (mm)
  const vsrDiv = Math.round((trueMeasurement - msr) / leastCount); // VSR divisions coinciding
  const vsr = vsrDiv * leastCount;
  const reading = msr + vsr;
  const correctedReading = reading - zeroError * leastCount;

  const caliperY = h / 2 - 30;
  const mainScaleX = 60;
  const scaleLen = w - 120;
  const vernierPos = mainScaleX + (trueMeasurement / 30) * scaleLen * 0.8;

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // ========= MAIN SCALE (FIXED JAW) =========
  // Main body (steel color)
  const bodyGrad = ctx.createLinearGradient(mainScaleX, caliperY, mainScaleX, caliperY + 30);
  bodyGrad.addColorStop(0, '#c0c0c0');
  bodyGrad.addColorStop(0.5, '#e8e8e8');
  bodyGrad.addColorStop(1, '#a0a0a0');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(mainScaleX, caliperY, scaleLen, 30);

  // Main scale divisions (every 1mm)
  for (let mm = 0; mm <= 30; mm++) {
    const x = mainScaleX + (mm / 30) * scaleLen;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = mm % 10 === 0 ? 2 : mm % 5 === 0 ? 1.5 : 0.8;
    const tickLen = mm % 10 === 0 ? 18 : mm % 5 === 0 ? 12 : 7;
    ctx.beginPath();
    ctx.moveTo(x, caliperY + 30 - tickLen);
    ctx.lineTo(x, caliperY + 30);
    ctx.stroke();
    if (mm % 5 === 0) {
      ctx.fillStyle = '#111';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(mm, x, caliperY + 30 - tickLen - 3);
    }
  }

  // ========= FIXED JAW =========
  ctx.fillStyle = '#b0b0b0';
  ctx.fillRect(mainScaleX, caliperY + 30, 40, 60);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.strokeRect(mainScaleX, caliperY + 30, 40, 60);

  // ========= VERNIER SCALE (SLIDING JAW) =========
  const vernierGrad = ctx.createLinearGradient(vernierPos, caliperY + 30, vernierPos, caliperY + 60);
  vernierGrad.addColorStop(0, '#d4d4d4');
  vernierGrad.addColorStop(1, '#9ca3af');
  ctx.fillStyle = vernierGrad;
  ctx.fillRect(vernierPos - 5, caliperY + 28, 80, 34);

  // Vernier divisions
  const vernierDivLen = (1 - 1 / lcDivisions) * (scaleLen / 30) * 10 / lcDivisions;
  for (let v = 0; v <= lcDivisions; v++) {
    const x = vernierPos + v * vernierDivLen;
    const isCoinciding = v === vsrDiv;
    ctx.strokeStyle = isCoinciding ? '#ef4444' : '#444';
    ctx.lineWidth = isCoinciding ? 2.5 : 0.8;
    const tickLen = v === 0 ? 20 : v === lcDivisions ? 20 : isCoinciding ? 16 : 10;
    ctx.beginPath();
    ctx.moveTo(x, caliperY + 28);
    ctx.lineTo(x, caliperY + 28 + tickLen);
    ctx.stroke();
    if (v === 0 || v === vsrDiv || v === lcDivisions) {
      ctx.fillStyle = isCoinciding ? '#ef4444' : '#222';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(v, x, caliperY + 28 + tickLen + 10);
    }
  }

  // Coinciding mark highlight
  const coinX = vernierPos + vsrDiv * vernierDivLen;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.moveTo(coinX, caliperY + 28);
  ctx.lineTo(coinX, caliperY - 15);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`VSR = ${vsrDiv}`, coinX, caliperY - 20);

  // Sliding jaw
  ctx.fillStyle = '#aaa';
  ctx.fillRect(vernierPos - 5, caliperY + 62, 40, 50);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.strokeRect(vernierPos - 5, caliperY + 62, 40, 50);

  // ========= OBJECT BEING MEASURED =========
  const jawGap = vernierPos - mainScaleX - 40;
  if (jawGap > 5) {
    ctx.fillStyle = '#78350f';
    const objX = mainScaleX + 40;
    const objW = Math.max(5, vernierPos - 5 - objX);
    ctx.fillRect(objX, caliperY + 30, objW, 80);
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 2;
    ctx.strokeRect(objX, caliperY + 30, objW, 80);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${trueMeasurement.toFixed(2)} mm`, objX + objW/2, caliperY + 75);
  }

  // ========= READING PANEL =========
  const panelX = 30;
  const panelY = h - 220;
  ctx.fillStyle = 'rgba(15,23,42,0.97)';
  ctx.fillRect(panelX, panelY, 320, 200);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, 320, 200);

  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('VERNIER CALIPER READING', panelX + 12, panelY + 22);

  ctx.font = '13px monospace';
  const rows = [
    [`Least Count (LC)`, `${leastCount.toFixed(2)} mm`],
    [`Vernier Divisions`, `${lcDivisions}`],
    [`Main Scale Reading`, `${msr.toFixed(1)} mm`],
    [`Coinciding Division`, `${vsrDiv}`],
    [`VSR = ${vsrDiv} × ${leastCount.toFixed(2)}`, `${vsr.toFixed(2)} mm`],
    [`Total Reading (MSR+VSR)`, `${reading.toFixed(2)} mm`],
    [`Zero Error`, `${(zeroError * leastCount).toFixed(2)} mm`],
    [`Corrected Reading`, `${correctedReading.toFixed(2)} mm`]
  ];

  rows.forEach(([label, val], i) => {
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(label, panelX + 12, panelY + 45 + i * 19);
    ctx.fillStyle = i === rows.length - 1 ? '#10b981' : '#e2e8f0';
    ctx.textAlign = 'right';
    ctx.fillText(val, panelX + 308, panelY + 45 + i * 19);
    ctx.textAlign = 'left';
  });

  // ========= FORMULA PANEL =========
  const fX = w - 280;
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.fillRect(fX, panelY, 250, 90);
  ctx.strokeStyle = '#7928ca';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(fX, panelY, 250, 90);
  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('FORMULAS', fX + 10, panelY + 18);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px monospace';
  ctx.fillText(`LC = 1 MSD − 1 VSD = 1/${lcDivisions} mm`, fX + 10, panelY + 36);
  ctx.fillText('Reading = MSR + (VSR × LC)', fX + 10, panelY + 52);
  ctx.fillText('Corrected = Reading − Zero Error', fX + 10, panelY + 68);

  return {
    leastCount: leastCount.toFixed(2) + ' mm',
    MSR: msr.toFixed(1) + ' mm',
    VSR: vsrDiv + ' div',
    totalReading: reading.toFixed(2) + ' mm',
    zeroError: (zeroError * leastCount).toFixed(2) + ' mm',
    correctedReading: correctedReading.toFixed(2) + ' mm',
    volumeSphere: ((4/3) * Math.PI * Math.pow(correctedReading/20, 3)).toFixed(4) + ' cm³'
  };
}
// Realistic Young's Modulus Simulation
export function drawYoungsModulus(ctx, w, h, values, time) {
  const { load = 2, length = 100, area = 0.5, material = 1 } = values;
  
  // Material properties
  const materials = {
    1: { name: 'Steel', Y: 200e9, color: '#94a3b8' },
    2: { name: 'Copper', Y: 120e9, color: '#f97316' },
    3: { name: 'Aluminium', Y: 70e9, color: '#60a5fa' },
    4: { name: 'Brass', Y: 100e9, color: '#fbbf24' },
    5: { name: 'Glass', Y: 70e9, color: '#a78bfa' }
  };
  const mat = materials[material] || materials[1];
  
  const force = load * 9.8;
  const areaM2 = area * 1e-6; // mm² to m²
  const lengthM = length / 100; // cm to m
  const stress = force / areaM2; // Pa
  const extension = (force * lengthM) / (mat.Y * areaM2); // m
  const extensionMm = extension * 1e3; // mm
  const strain = extension / lengthM;
  const measuredY = stress / strain;

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // ============ APPARATUS SETUP ============
  const wireX = w / 2 - 80;
  const wireTopY = 60;
  const wireBottomY = wireTopY + lengthM * 300;
  const extBottomY = wireBottomY + extensionMm * 30;

  // Ceiling support
  ctx.fillStyle = '#374151';
  ctx.fillRect(wireX - 40, wireTopY - 20, 100, 20);
  ctx.strokeStyle = '#4b5563';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(wireX - 40 + i * 14, wireTopY - 20);
    ctx.lineTo(wireX - 40 + i * 14 - 8, wireTopY);
    ctx.stroke();
  }

  // Reference wire (compensating)
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(wireX - 20, wireTopY);
  ctx.lineTo(wireX - 20, wireBottomY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#64748b';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Ref.', wireX - 20, wireBottomY + 12);

  // Main wire
  ctx.strokeStyle = mat.color;
  ctx.lineWidth = 3;
  ctx.shadowBlur = 6;
  ctx.shadowColor = mat.color;
  ctx.beginPath();
  ctx.moveTo(wireX, wireTopY);
  ctx.lineTo(wireX, extBottomY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Wire labels
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${mat.name} wire`, wireX + 8, wireTopY + 20);

  // Original length brace
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.moveTo(wireX + 20, wireTopY);
  ctx.lineTo(wireX + 20, wireBottomY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#10b981';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`L = ${length} cm`, wireX + 24, (wireTopY + wireBottomY) / 2);

  // Extension brace
  if (extensionMm > 0.1) {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(wireX + 45, wireBottomY);
    ctx.lineTo(wireX + 45, extBottomY);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`ΔL = ${extensionMm.toFixed(4)} mm`, wireX + 50, (wireBottomY + extBottomY) / 2 + 4);
    // Arrows
    ctx.beginPath();
    ctx.moveTo(wireX + 45, wireBottomY);
    ctx.lineTo(wireX + 41, wireBottomY + 6);
    ctx.lineTo(wireX + 49, wireBottomY + 6);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(wireX + 45, extBottomY);
    ctx.lineTo(wireX + 41, extBottomY - 6);
    ctx.lineTo(wireX + 49, extBottomY - 6);
    ctx.closePath();
    ctx.fill();
  }

  // Loading pan + weights
  const panY = extBottomY;
  ctx.fillStyle = '#6b7280';
  ctx.beginPath();
  ctx.arc(wireX, panY, 25, 0, Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(wireX - 25, panY);
  ctx.lineTo(wireX + 25, panY);
  ctx.stroke();

  // Stack of weights
  for (let i = 0; i < Math.floor(load); i++) {
    const wy = panY + 10 + i * 14;
    ctx.fillStyle = `hsl(${200 + i * 15}, 70%, 60%)`;
    ctx.fillRect(wireX - 18, wy, 36, 12);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(wireX - 18, wy, 36, 12);
    ctx.fillStyle = '#000';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('1 kg', wireX, wy + 9);
  }

  // ============ STRESS-STRAIN GRAPH ============
  const gX = w / 2 + 80, gY = 60;
  const gW = w - gX - 30, gH = 220;

  ctx.fillStyle = 'rgba(15,23,42,0.8)';
  ctx.fillRect(gX, gY, gW, gH);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(gX, gY, gW, gH);

  // Axes
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(gX + 30, gY + 10);
  ctx.lineTo(gX + 30, gY + gH - 20);
  ctx.lineTo(gX + gW - 10, gY + gH - 20);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Strain ε', gX + gW / 2, gY + gH - 4);
  ctx.save();
  ctx.translate(gX + 10, gY + gH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Stress σ (GPa)', 0, 0);
  ctx.restore();

  // Stress-strain line (linear elastic)
  const maxStrain = 0.005;
  const maxStressGPa = mat.Y * maxStrain / 1e9;
  
  ctx.strokeStyle = mat.color;
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 6;
  ctx.shadowColor = mat.color;
  ctx.beginPath();
  ctx.moveTo(gX + 30, gY + gH - 20);
  ctx.lineTo(gX + 30 + (gW - 40), gY + 10);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Current point
  const currStrain = strain;
  const currStress = stress / 1e9;
  const px = gX + 30 + (currStrain / maxStrain) * (gW - 40);
  const py = gY + gH - 20 - (currStress / maxStressGPa) * (gH - 30);
  
  if (px > gX + 30 && px < gX + gW) {
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, gY + gH - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(gX + 30, py);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Graph labels
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Y = slope = ${(measuredY / 1e9).toFixed(0)} GPa`, gX + 35, gY + 22);

  // ============ READING PANEL ============
  const panelX = 30;
  const panelY2 = h - 195;
  ctx.fillStyle = 'rgba(15,23,42,0.97)';
  ctx.fillRect(panelX, panelY2, 310, 180);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY2, 310, 180);
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText("YOUNG'S MODULUS", panelX + 10, panelY2 + 20);

  const rows = [
    ['Material', mat.name],
    ['Load (m)', `${load} kg → ${force.toFixed(1)} N`],
    ['Length (L)', `${length} cm`],
    ['Area (A)', `${area} mm²`],
    ['Stress σ = F/A', `${(stress / 1e6).toFixed(2)} MPa`],
    ['Extension ΔL', `${extensionMm.toFixed(4)} mm`],
    ['Strain ε = ΔL/L', strain.toExponential(4)],
    ['Y = σ/ε', `${(measuredY / 1e9).toFixed(1)} GPa`],
    ['Standard Y', `${(mat.Y / 1e9)} GPa`]
  ];
  rows.forEach(([label, val], i) => {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(label, panelX + 10, panelY2 + 38 + i * 16);
    ctx.fillStyle = i === 7 ? '#10b981' : '#e2e8f0';
    ctx.textAlign = 'right';
    ctx.fillText(val, panelX + 300, panelY2 + 38 + i * 16);
    ctx.textAlign = 'left';
  });

  return {
    material: mat.name,
    stress: (stress / 1e6).toFixed(2) + ' MPa',
    strain: strain.toExponential(3),
    extension: extensionMm.toFixed(4) + ' mm',
    youngsModulus: (measuredY / 1e9).toFixed(1) + ' GPa',
    elasticEnergy: ((0.5 * force * extension) * 1000).toFixed(4) + ' mJ'
  };
}
