
// Advanced B.Tech simulations
export function drawDampedOscillations(ctx, w, h, values, time) {
  const { mass, k, b, amplitude } = values;
  
  const omega0 = Math.sqrt(k / mass);
  const zeta = b / (2 * Math.sqrt(k * mass));
  const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
  
  const centerX = w / 2;
  const baseY = h - 100;
  
  // Position with damping
  let x;
  if (zeta < 1) {
    // Underdamped
    x = amplitude * Math.exp(-zeta * omega0 * time) * Math.cos(omegaD * time);
  } else if (zeta > 1) {
    // Overdamped
    x = amplitude * Math.exp(-omega0 * time);
  } else {
    // Critically damped
    x = amplitude * (1 + omega0 * time) * Math.exp(-omega0 * time);
  }
  
  const posY = baseY - x * 200;
  
  // Draw spring
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 3;
  const coils = 15;
  ctx.beginPath();
  for (let i = 0; i <= coils; i++) {
    const y = 50 + ((posY - 50) * i / coils);
    const offset = (i % 2 === 0 ? 20 : -20) * (i > 0 && i < coils ? 1 : 0);
    if (i === 0) ctx.moveTo(centerX, y);
    else ctx.lineTo(centerX + offset, y);
  }
  ctx.stroke();
  
  // Draw mass
  ctx.fillStyle = '#7928ca';
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#7928ca';
  ctx.fillRect(centerX - 30, posY, 60, 40);
  ctx.shadowBlur = 0;
  
  ctx.fillStyle = '#fff';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${mass} kg`, centerX, posY + 25);
  
  // Plot amplitude envelope
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  for (let t = 0; t < 10; t += 0.1) {
    const env = amplitude * Math.exp(-zeta * omega0 * t) * 200;
    const px = 50 + t * 70;
    const py = baseY - env;
    if (t === 0) {
      ctx.beginPath();
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Damping type indicator
  let dampingType;
  if (zeta < 1) dampingType = 'Underdamped';
  else if (zeta > 1) dampingType = 'Overdamped';
  else dampingType = 'Critically Damped';
  
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(dampingType, centerX, 30);
  
  return {
    dampingRatio: zeta.toFixed(3),
    naturalFreq: omega0.toFixed(2),
    dampedFreq: (omegaD.toFixed(2)),
    displacement: x.toFixed(3),
    dampingType
  };
}

export function drawKirchhoff(ctx, w, h, values, time) {
  const { emf1, emf2, r1, r2, r3 } = values;
  
  // Solve circuit using Kirchhoff's laws
  const totalR = r1 + r2 + r3;
  const current = (emf1 - emf2) / totalR;
  const v1 = current * r1;
  const v2 = current * r2;
  const v3 = current * r3;
  
  const centerX = w / 2;
  const centerY = h / 2;
  const size = 120;
  
  // Draw circuit loop
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.rect(centerX - size, centerY - size, size * 2, size * 2);
  ctx.stroke();
  
  // Draw batteries
  drawBattery(ctx, centerX, centerY - size - 30, emf1, '#10b981');
  drawBattery(ctx, centerX + size + 30, centerY, emf2, '#3b82f6');
  
  // Draw resistors
  drawResistor(ctx, centerX, centerY + size + 30, r1, '#f59e0b', 'R₁');
  drawResistor(ctx, centerX - size - 30, centerY, r2, '#ef4444', 'R₂');
  drawResistor(ctx, centerX + size/2, centerY - size/2, r3, '#8b5cf6', 'R₃');
  
  // Animate current flow
  const phase = (time * Math.abs(current) * 2) % 4;
  for (let i = 0; i < 8; i++) {
    const electronPhase = (phase + i * 0.5) % 4;
    let ex, ey;
    
    if (electronPhase < 1) {
      ex = centerX - size + electronPhase * size * 2;
      ey = centerY - size;
    } else if (electronPhase < 2) {
      ex = centerX + size;
      ey = centerY - size + (electronPhase - 1) * size * 2;
    } else if (electronPhase < 3) {
      ex = centerX + size - (electronPhase - 2) * size * 2;
      ey = centerY + size;
    } else {
      ex = centerX - size;
      ey = centerY + size - (electronPhase - 3) * size * 2;
    }
    
    ctx.fillStyle = current > 0 ? '#00d4ff' : '#ef4444';
    ctx.beginPath();
    ctx.arc(ex, ey, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Display values
  ctx.fillStyle = '#fff';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${v1.toFixed(1)}V`, centerX, centerY + size + 60);
  ctx.fillText(`${v2.toFixed(1)}V`, centerX - size - 60, centerY);
  ctx.fillText(`I = ${current.toFixed(2)}A`, centerX, centerY);
  
  // KVL verification
  const kvlSum = emf1 - emf2 - v1 - v2 - v3;
  
  ctx.fillStyle = Math.abs(kvlSum) < 0.01 ? '#10b981' : '#ef4444';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`KVL: ΣV = ${kvlSum.toFixed(3)}V ✓`, centerX, 30);
  
  return {
    current: current.toFixed(3),
    voltage_R1: v1.toFixed(2),
    voltage_R2: v2.toFixed(2),
    voltage_R3: v3.toFixed(2),
    kvl_check: Math.abs(kvlSum) < 0.01 ? 'Verified' : 'Error'
  };
}

export function drawMagneticField(ctx, w, h, values, time) {
  const { strength, separation, config } = values;
  
  const centerX = w / 2;
  const centerY = h / 2;
  const sep = separation * 10;
  
  // Draw magnets
  if (config === 1) {
    // Bar magnet
    drawMagnet(ctx, centerX - sep, centerY, 40, 60, 'N', '#ef4444');
    drawMagnet(ctx, centerX + sep, centerY, 40, 60, 'S', '#3b82f6');
  } else if (config === 2) {
    // Horseshoe
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(0.1, sep), 0, Math.PI, true);
    ctx.stroke();
    
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(centerX - sep - 20, centerY - 10, 40, 30);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', centerX - sep, centerY + 10);
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(centerX + sep - 20, centerY - 10, 40, 30);
    ctx.fillStyle = '#fff';
    ctx.fillText('S', centerX + sep, centerY + 10);
  }
  
  // Draw field lines
  const numLines = 16;
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI * 2;
    drawFieldLine(ctx, centerX - sep, centerY, centerX + sep, centerY, 
                  angle, strength, '#00d4ff');
  }
  
  // Iron filings effect
  for (let i = 0; i < 200; i++) {
    const x = 100 + Math.random() * (w - 200);
    const y = 100 + Math.random() * (h - 200);
    
    const dx1 = x - (centerX - sep);
    const dy1 = y - centerY;
    const dx2 = x - (centerX + sep);
    const dy2 = y - centerY;
    
    const angle1 = Math.atan2(dy1, dx1);
    const angle2 = Math.atan2(dy2, dx2);
    const avgAngle = (angle1 + angle2) / 2;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(avgAngle);
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.fillRect(-2, -0.5, 4, 1);
    ctx.restore();
  }
  
  return {
    fieldStrength: (strength * 1000).toFixed(1),
    poleSeparation: separation.toFixed(1),
    configuration: config === 1 ? 'Bar Magnet' : config === 2 ? 'Horseshoe' : 'Solenoid'
  };
}

export function drawSolenoid(ctx, w, h, values, time) {
  const { current, turns, length } = values;
  
  const mu0 = 4 * Math.PI * 1e-7;
  const n = turns / (length / 100);
  const B = mu0 * n * current;
  
  const centerX = w / 2;
  const centerY = h / 2;
  const solenoidLength = 300;
  const solenoidRadius = 50;
  
  // Draw solenoid coils
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  
  for (let i = 0; i < 20; i++) {
    const x = centerX - solenoidLength/2 + (i / 19) * solenoidLength;
    
    // Ellipse for 3D effect
    ctx.beginPath();
    ctx.ellipse(x, centerY, 8, solenoidRadius, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Current direction indicators
  ctx.fillStyle = current > 0 ? '#10b981' : '#ef4444';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(current > 0 ? '⊙' : '⊗', centerX - solenoidLength/2 - 30, centerY);
  ctx.fillText(current > 0 ? '⊗' : '⊙', centerX + solenoidLength/2 + 30, centerY);
  
  // Magnetic field lines inside
  for (let i = -2; i <= 2; i++) {
    const y = centerY + i * 15;
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - solenoidLength/2 + 20, y);
    ctx.lineTo(centerX + solenoidLength/2 - 20, y);
    ctx.stroke();
    
    // Arrow
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.moveTo(centerX + solenoidLength/2 - 30, y);
    ctx.lineTo(centerX + solenoidLength/2 - 40, y - 5);
    ctx.lineTo(centerX + solenoidLength/2 - 40, y + 5);
    ctx.closePath();
    ctx.fill();
  }
  
  // External field lines
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, solenoidRadius + 40, 0, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(centerX, centerY, solenoidRadius + 40, Math.PI, 0);
  ctx.stroke();
  
  // Field strength indicator
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`B = ${(B * 1e3).toFixed(2)} mT`, centerX, 40);
  
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`n = ${n.toFixed(0)} turns/m`, centerX, centerY - solenoidRadius - 30);
  
  return {
    magneticField: (B * 1e6).toFixed(2),
    turnsPerMeter: n.toFixed(0),
    current: current.toFixed(2),
    fieldDirection: current > 0 ? 'Right' : 'Left'
  };
}

// Helper functions
function drawBattery(ctx, x, y, voltage, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - 25, y - 15, 50, 30);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${voltage}V`, x, y + 5);
}

function drawResistor(ctx, x, y, resistance, color, label) {
  ctx.fillStyle = color;
  ctx.fillRect(x - 30, y - 12, 60, 24);
  ctx.fillStyle = '#fff';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${label}=${resistance}Ω`, x, y + 5);
}

function drawMagnet(ctx, x, y, w, h, pole, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - w/2, y - h/2, w, h);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(pole, x, y + 8);
}

function drawFieldLine(ctx, x1, y1, x2, y2, angle, strength, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  
  const r = 50 + angle * 20;
  const steps = 50;
  
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const theta = angle + t * Math.PI;
    const x = ((x1 + x2) / 2) + r * Math.cos(theta) * strength;
    const y = ((y1 + y2) / 2) + r * Math.sin(theta) * strength;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// Export simulation router
export function getSimulation(experimentId) {
  const simulations = {
    'pendulum': drawPendulum,
    'projectile': drawProjectile,
    'friction': drawFriction,
    'collisions': drawCollisions,
    'waves-string': null, // Uses local implementation
    'sound-waves': drawSoundWaves,
    'ohms-law': null, // Uses local implementation
    'kirchhoff': drawKirchhoff,
    'refraction': drawRefraction,
    'lens-formula': drawLens,
    'interference': drawInterference,
    'photoelectric': drawPhotoelectric,
    'magnetic-field': drawMagneticField,
    'solenoid': drawSolenoid,
    'shm-damped': drawDampedOscillations
  };
  
  return simulations[experimentId] || null;
}
  export function drawCollisions(ctx, w, h, values, time) {
  const { m1, m2, v1, v2 } = values;
  
  // Calculate final velocities (elastic collision)
  const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  
  // Animation phases
  const collisionTime = 2;
  const phase = time % 4;
  
  let ball1X, ball2X, ball1V, ball2V;
  
  if (phase < collisionTime) {
    // Before collision
    ball1X = 150 + v1 * (phase / collisionTime) * 150;
    ball2X = w - 150 - v2 * (phase / collisionTime) * 150;
    ball1V = v1;
    ball2V = v2;
  } else {
    // After collision
    const postTime = phase - collisionTime;
    ball1X = w / 2 - 30 + v1f * (postTime / collisionTime) * 150;
    ball2X = w / 2 + 30 + v2f * (postTime / collisionTime) * 150;
    ball1V = v1f;
    ball2V = v2f;
  }
  
  const centerY = h / 2;
  
  // Draw track
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, centerY + 50);
  ctx.lineTo(w - 50, centerY + 50);
  ctx.stroke();
  
  // Ball 1
  const radius1 = 15 + m1 * 5;
  drawBall(ctx, ball1X, centerY, radius1, '#00d4ff', m1, ball1V);
  
  // Ball 2
  const radius2 = 15 + m2 * 5;
  drawBall(ctx, ball2X, centerY, radius2, '#7928ca', m2, ball2V);
  
  // Collision flash
  if (Math.abs(phase - collisionTime) < 0.1) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(w/2, centerY, 50, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Momentum bars
  const momentum1 = m1 * v1;
  const momentum2 = m2 * v2;
  const momentum1f = m1 * v1f;
  const momentum2f = m2 * v2f;
  
  drawMomentumBar(ctx, 50, 50, 'Before', momentum1, momentum2, '#00d4ff', '#7928ca');
  drawMomentumBar(ctx, 50, 120, 'After', momentum1f, momentum2f, '#00d4ff', '#7928ca');
  
  // Conservation check
  const totalBefore = momentum1 + momentum2;
  const totalAfter = momentum1f + momentum2f;
  const conserved = Math.abs(totalBefore - totalAfter) < 0.01;
  
  ctx.fillStyle = conserved ? '#10b981' : '#ef4444';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`Conservation: ${conserved ? '✓ VERIFIED' : '✗ ERROR'}`, 50, 190);
  
  return {
    v1Initial: v1.toFixed(2),
    v2Initial: v2.toFixed(2),
    v1Final: v1f.toFixed(2),
    v2Final: v2f.toFixed(2),
    momentumBefore: totalBefore.toFixed(2),
    momentumAfter: totalAfter.toFixed(2),
    conserved: conserved ? 'Yes' : 'No'
  };
}

function drawBall(ctx, x, y, radius, color, mass, velocity) {
  // Shadow
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;
  
  // Ball
  const gradient = ctx.createRadialGradient(x - radius/3, y - radius/3, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, color);
  
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.1, radius), 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Labels
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${mass} kg`, x, y);
  ctx.font = '10px sans-serif';
  ctx.fillText(`${velocity.toFixed(1)} m/s`, x, y + radius + 15);
}

function drawMomentumBar(ctx, x, y, label, p1, p2, color1, color2) {
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(label + ':', x, y);
  
  const barWidth = 150;
  const scale = barWidth / Math.max(Math.abs(p1) + Math.abs(p2), 20);
  
  // Ball 1 momentum
  ctx.fillStyle = color1;
  ctx.fillRect(x + 60, y - 10, Math.abs(p1) * scale, 8);
  ctx.fillText(`p₁=${p1.toFixed(1)}`, x + 60 + Math.abs(p1) * scale + 5, y);
  
  // Ball 2 momentum
  ctx.fillStyle = color2;
  ctx.fillRect(x + 60, y + 2, Math.abs(p2) * scale, 8);
  ctx.fillText(`p₂=${p2.toFixed(1)}`, x + 60 + Math.abs(p2) * scale + 5, y + 12);
}
  // Electricity simulations: Potentiometer, Meter Bridge, Galvanometer, EM Induction
