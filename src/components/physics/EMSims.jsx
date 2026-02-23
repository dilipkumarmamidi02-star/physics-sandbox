export function drawEMInduction(ctx, w, h, values, time) {
  const { flux, turns, time: timePeriod } = values;
  const emf = turns * flux / timePeriod;
  const currentFlux = flux * Math.sin(time * 2 * Math.PI / timePeriod);

  const cx = w / 2;
  const cy = h / 2;

  // Coil
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const x = cx - 100 + i * 28;
    ctx.beginPath();
    ctx.ellipse(x, cy, 12, 40, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Moving magnet
  const magnetX = cx + Math.sin(time * 2 * Math.PI / timePeriod) * 120;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(magnetX - 20, cy - 25, 40, 25);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(magnetX - 20, cy, 40, 25);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('N', magnetX, cy - 7);
  ctx.fillText('S', magnetX, cy + 18);

  // Flux arrow
  const arrowLen = currentFlux * 60;
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 80, cy - 60);
  ctx.lineTo(cx - 80 + arrowLen, cy - 60);
  ctx.stroke();
  if (Math.abs(arrowLen) > 5) {
    const dir = arrowLen > 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx - 80 + arrowLen, cy - 60);
    ctx.lineTo(cx - 80 + arrowLen - dir * 10, cy - 66);
    ctx.lineTo(cx - 80 + arrowLen - dir * 10, cy - 54);
    ctx.closePath();
    ctx.fillStyle = '#00d4ff';
    ctx.fill();
  }

  // EMF indicator
  const inducedEMF = emf * Math.cos(time * 2 * Math.PI / timePeriod);

  // Draw EMF waveform at bottom
  const waveY = h - 80;
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 50; x < w - 50; x++) {
    const t = ((x - 50) / (w - 100)) * 4 * timePeriod;
    const y = waveY - emf * 30 * Math.cos(t * 2 * Math.PI / timePeriod);
    if (x === 50) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Axis for waveform
  ctx.strokeStyle = 'rgba(148,163,184,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, waveY);
  ctx.lineTo(w - 50, waveY);
  ctx.stroke();

  // Results box
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 200, 80, 8);
  ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText("Faraday's Law", 120, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`EMF (peak) = ${emf.toFixed(3)} V`, 120, 60);
  ctx.fillStyle = inducedEMF >= 0 ? '#10b981' : '#ef4444';
  ctx.fillText(`Inst. EMF = ${inducedEMF.toFixed(3)} V`, 120, 80);

  return {
    peakEMF: emf.toFixed(4),
    instantaneousEMF: inducedEMF.toFixed(4),
    magneticFlux: flux.toFixed(3),
    coilTurns: turns,
    timePeriod: timePeriod.toFixed(2)
  };
}
  export function drawFriction(ctx, w, h, values, time) {
  const { mass, angle, mu, surfaceType = 1, frictionType = 'static' } = values;
  const g = 9.8;
  
  // Surface-specific friction coefficients
  const surfaceTypes = {
    1: { name: 'Concrete Road', muStatic: 0.7, muKinetic: 0.5, color: '#64748b', texture: 'rough' },
    2: { name: 'Ice', muStatic: 0.1, muKinetic: 0.05, color: '#60a5fa', texture: 'smooth' },
    3: { name: 'Wood', muStatic: 0.5, muKinetic: 0.3, color: '#92400e', texture: 'wood' },
    4: { name: 'Steel Rails', muStatic: 0.15, muKinetic: 0.1, color: '#78716c', texture: 'metal' },
    5: { name: 'Rubber Tire', muStatic: 0.9, muKinetic: 0.7, color: '#1f2937', texture: 'rubber' }
  };

  const surface = surfaceTypes[surfaceType] || surfaceTypes[1];
  const muActual = frictionType === 'static' ? surface.muStatic : surface.muKinetic;
  const muEffective = mu * muActual;
  
  // Calculate forces
  const angleRad = angle * Math.PI / 180;
  const normalForce = mass * g * Math.cos(angleRad);
  const frictionForce = muEffective * normalForce;
  const gravityComponent = mass * g * Math.sin(angleRad);
  const netForce = gravityComponent - frictionForce;
  const acceleration = netForce / mass;
  const isMoving = acceleration > 0.05;
  
  // Simulate different objects
  const objectTypes = {
    1: { name: 'Box', draw: drawBox, size: 40 },
    2: { name: 'Cylinder (Rolling)', draw: drawCylinder, size: 35 },
    3: { name: 'Train Wheel', draw: drawTrainWheel, size: 40 },
    4: { name: 'Truck', draw: drawTruck, size: 50 },
    5: { name: 'Block with Pulley', draw: drawPulleySystem, size: 35 }
  };

  const objectType = Math.floor((time * 0.1) % 5) + 1;
  const obj = objectTypes[objectType];
  
  // Object position
  const baseX = 100;
  const maxTravel = w - 300;
  let blockX;
  
  if (isMoving && frictionType === 'kinetic') {
    // Moving with kinetic friction
    const t = time % 6;
    const distance = 0.5 * acceleration * t * t * 30;
    blockX = baseX + Math.min(distance, maxTravel);
  } else if (isMoving && frictionType === 'rolling') {
    // Rolling motion (less friction)
    const rollingMu = muEffective * 0.1;
    const rollingAccel = g * (Math.sin(angleRad) - rollingMu * Math.cos(angleRad));
    const t = time % 6;
    blockX = baseX + Math.min(0.5 * rollingAccel * t * t * 30, maxTravel);
  } else {
    // Static or stopped
    blockX = baseX;
  }
  
  const blockY = h - 180 - obj.size - angle * 2;
  
  // Draw surface with texture
  drawSurface(ctx, surface, w, h, angleRad);
  
  // Draw object
  ctx.save();
  ctx.translate(blockX, blockY);
  ctx.rotate(-angleRad);
  obj.draw(ctx, mass, obj.size, surface.color, isMoving, time);
  ctx.restore();
  
  // Force vectors
  const vectorScale = 15;
  drawForceVectors(ctx, blockX, blockY, angleRad, frictionForce, gravityComponent, vectorScale);
  
  // Motion indicators
  if (isMoving) {
    // Motion lines
    for (let i = 0; i < 5; i++) {
      const lineX = blockX - 60 - i * 15;
      const alpha = 1 - i * 0.2;
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lineX, blockY - 10);
      ctx.lineTo(lineX - 15, blockY - 10);
      ctx.stroke();
    }
  }
  
  // Info panel
  drawInfoPanel(ctx, w, h, {
    surface: surface.name,
    object: obj.name,
    frictionType,
    muStatic: surface.muStatic.toFixed(3),
    muKinetic: surface.muKinetic.toFixed(3),
    normalForce: normalForce.toFixed(2),
    frictionForce: frictionForce.toFixed(2),
    netForce: netForce.toFixed(2),
    acceleration: acceleration.toFixed(3),
    status: isMoving ? '● MOVING' : '● STATIC'
  });
  
  // Friction type badge
  ctx.fillStyle = frictionType === 'static' ? '#10b981' : frictionType === 'rolling' ? '#3b82f6' : '#ef4444';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    frictionType === 'static' ? 'STATIC FRICTION' : 
    frictionType === 'rolling' ? 'ROLLING FRICTION' : 'KINETIC FRICTION', 
    w/2, 30
  );
  
  return {
    surfaceType: surface.name,
    objectType: obj.name,
    frictionType: String(frictionType || '').toUpperCase(),
    muStatic: surface.muStatic.toFixed(3),
    muKinetic: surface.muKinetic.toFixed(3),
    normalForce: normalForce.toFixed(2),
    frictionForce: frictionForce.toFixed(2),
    netForce: netForce.toFixed(2),
    acceleration: acceleration.toFixed(3),
    status: isMoving ? 'Moving' : 'Static',
    velocity: (acceleration * (time % 6)).toFixed(2)
  };
}

function drawSurface(ctx, surface, w, h, angle) {
  ctx.save();
  ctx.translate(50, h - 150);
  ctx.rotate(-angle);
  
  // Base surface
  const gradient = ctx.createLinearGradient(0, 0, 0, 40);
  gradient.addColorStop(0, surface.color);
  gradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w - 100, 40);
  
  // Surface texture
  if (surface.texture === 'rough') {
    for (let i = 0; i < w - 100; i += 15) {
      ctx.fillStyle = '#475569';
      ctx.fillRect(i, 5, 8, 3);
      ctx.fillRect(i + 4, 12, 8, 3);
    }
  } else if (surface.texture === 'smooth') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(i * 200, 10, 100, 2);
    }
  } else if (surface.texture === 'wood') {
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 10 + i * 4);
      ctx.lineTo(w - 100, 10 + i * 4);
      ctx.stroke();
    }
  } else if (surface.texture === 'metal') {
    for (let i = 0; i < w - 100; i += 30) {
      ctx.fillStyle = '#57534e';
      ctx.fillRect(i, 15, 20, 10);
    }
  }
  
  ctx.restore();
}

function drawBox(ctx, mass, size, color, isMoving, time) {
  // Box body
  ctx.fillStyle = isMoving ? '#ef4444' : color;
  ctx.shadowBlur = isMoving ? 20 : 10;
  ctx.shadowColor = isMoving ? '#ef4444' : color;
  ctx.fillRect(-size/2, -size/2, size, size);
  ctx.shadowBlur = 0;
  
  // Box details
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(-size/2 + 5, -size/2 + 5, size - 10, size - 10);
  
  // Mass label
  ctx.fillStyle = '#fff';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${mass} kg`, 0, 5);
}

function drawCylinder(ctx, mass, size, color, isMoving, time) {
  // Cylinder with rotation
  const rotation = isMoving ? time * 3 : 0;
  
  ctx.save();
  ctx.rotate(rotation);
  
  // Cylinder body
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(0, 0, size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Rolling line
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size/2, 0);
  ctx.stroke();
  
  ctx.restore();
  
  // Label
  ctx.fillStyle = '#fff';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${mass} kg`, 0, size/2 + 15);
}

function drawTrainWheel(ctx, mass, size, color, isMoving, time) {
  const rotation = isMoving ? time * 2 : 0;
  
  ctx.save();
  ctx.rotate(rotation);
  
  // Wheel
  ctx.fillStyle = '#78716c';
  ctx.beginPath();
  ctx.arc(0, 0, size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Spokes
  ctx.strokeStyle = '#d6d3d1';
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * size/2, Math.sin(angle) * size/2);
    ctx.stroke();
  }
  
  // Hub
  ctx.fillStyle = '#44403c';
  ctx.beginPath();
  ctx.arc(0, 0, size/6, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawTruck(ctx, mass, size, color, isMoving, time) {
  // Truck body
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-size/2, -size/2, size * 1.5, size * 0.7);
  
  // Cab
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-size/2, -size/2 - size * 0.3, size * 0.6, size * 0.3);
  
  // Wheels
  const wheelRadius = size * 0.15;
  const wheelY = size/2 - size * 0.35;
  
  [-size * 0.3, size * 0.6].forEach(x => {
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(x, wheelY, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    
    if (isMoving) {
      ctx.save();
      ctx.translate(x, wheelY);
      ctx.rotate(time * 4);
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, wheelRadius);
        ctx.rotate(Math.PI / 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  });
  
  // Label
  ctx.fillStyle = '#fff';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${mass}kg`, size/4, -size/4);
}

function drawPulleySystem(ctx, mass, size, color, isMoving, time) {
  // Block
  ctx.fillStyle = '#8b5cf6';
  ctx.fillRect(-size/2, -size/2, size, size);
  
  // Rope
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(size/2, -size/2);
  ctx.lineTo(size/2, -size * 1.5);
  ctx.lineTo(size * 1.5, -size * 1.5);
  ctx.stroke();
  
  // Pulley
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(size * 1.5, -size * 1.5, size * 0.3, 0, Math.PI * 2);
  ctx.stroke();
  
  // Hanging mass
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(size * 1.3, -size * 1.2, size * 0.4, size * 0.5);
}

function drawForceVectors(ctx, x, y, angle, fFriction, fGravity, scale) {
  // Friction force (red arrow)
  if (fFriction > 0) {
    drawArrow(
      ctx, x, y,
      -Math.cos(angle) * fFriction * scale,
      Math.sin(angle) * fFriction * scale,
      '#ef4444', 4
    );
    ctx.fillStyle = '#ef4444';
    ctx.font = '12px sans-serif';
    ctx.fillText(`f = ${fFriction.toFixed(1)}N`, x - 80, y - 25);
  }
  
  // Gravity component (green arrow)
  drawArrow(
    ctx, x, y,
    Math.cos(angle) * fGravity * scale,
    -Math.sin(angle) * fGravity * scale,
    '#10b981', 4
  );
  ctx.fillStyle = '#10b981';
  ctx.fillText(`F = ${fGravity.toFixed(1)}N`, x + 80, y - 25);
  
  // Normal force (blue arrow)
  drawArrow(
    ctx, x, y,
    Math.sin(angle) * fGravity * scale * 0.7,
    Math.cos(angle) * fGravity * scale * 0.7,
    '#3b82f6', 3
  );
}

function drawArrow(ctx, x, y, dx, dy, color, width) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = 0.8;
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();
  
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(x + dx, y + dy);
  ctx.lineTo(x + dx - 12 * Math.cos(angle - Math.PI/6), y + dy - 12 * Math.sin(angle - Math.PI/6));
  ctx.lineTo(x + dx - 12 * Math.cos(angle + Math.PI/6), y + dy - 12 * Math.sin(angle + Math.PI/6));
  ctx.closePath();
  ctx.fill();
  
  ctx.globalAlpha = 1;
}

function drawInfoPanel(ctx, w, h, info) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fillRect(w - 280, 50, 260, 240);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(w - 280, 50, 260, 240);
  
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Friction Analysis', w - 270, 75);
  
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#94a3b8';
  const lines = [
    `Surface: ${info.surface}`,
    `Object: ${info.object}`,
    `Type: ${info.frictionType}`,
    `μₛ = ${info.muStatic}`,
    `μₖ = ${info.muKinetic}`,
    `Normal: ${info.normalForce} N`,
    `Friction: ${info.frictionForce} N`,
    `Net Force: ${info.netForce} N`,
    `Accel: ${info.acceleration} m/s²`,
    `Status: ${info.status}`
  ];
  
  lines.forEach((line, i) => {
    ctx.fillText(line, w - 270, 100 + i * 16);
  });
}
  // High-accuracy Young's double slit interference simulation
