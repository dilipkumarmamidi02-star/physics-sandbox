export function drawCompton(ctx, w, h, values, time) {
  const { wavelength, angle } = values;
  const hmc = 0.00243; // nm (Compton wavelength)
  const Δλ = hmc * (1 - Math.cos(angle * Math.PI / 180));
  const λScattered = wavelength + Δλ;
  const energyIn = 1240 / (wavelength * 1000); // keV (λ in pm)
  const energyOut = 1240 / (λScattered * 1000);

  const cx = w / 2;
  const cy = h / 2;

  // Electron target
  ctx.fillStyle = '#7928ca';
  ctx.shadowBlur = 25; ctx.shadowColor = '#7928ca';
  ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('e⁻', cx, cy + 5);

  // Incident photon beam
  const photonPhase = (time * 2) % 1;
  const px = 60 + photonPhase * (cx - 82);
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(60, cy); ctx.lineTo(cx - 22, cy); ctx.stroke();
  // Photon wave
  ctx.strokeStyle = 'rgba(251,191,36,0.5)'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 60; x < cx - 22; x++) {
    const y = cy + 6 * Math.sin((x - 60) * 0.3);
    if (x === 60) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // Moving photon dot
  ctx.fillStyle = '#fbbf24';
  ctx.shadowBlur = 12; ctx.shadowColor = '#fbbf24';
  ctx.beginPath(); ctx.arc(px, cy, 6, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fbbf24'; ctx.font = '11px sans-serif';
  ctx.fillText(`λ = ${wavelength} nm`, 60 + (cx - 82) / 2, cy - 22);

  // Scattered photon
  const scatterAngleRad = angle * Math.PI / 180;
  const sx = cx + 150 * Math.cos(scatterAngleRad);
  const sy = cy - 150 * Math.sin(scatterAngleRad);
  const sPhase = ((time * 2) + 0.5) % 1;
  const sPx = cx + sPhase * (sx - cx);
  const sPy = cy + sPhase * (sy - cy);

  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx + 22 * Math.cos(-scatterAngleRad), cy + 22 * Math.sin(-scatterAngleRad));
  ctx.lineTo(sx, sy); ctx.stroke();
  ctx.fillStyle = '#f59e0b';
  ctx.shadowBlur = 10; ctx.shadowColor = '#f59e0b';
  ctx.beginPath(); ctx.arc(sPx, sPy, 5, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#f59e0b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(`λ' = ${λScattered.toFixed(5)} nm`, sx + 8, sy - 5);

  // Recoil electron
  const eAngle = scatterAngleRad - Math.PI / 2;
  const ex = cx + 100 * Math.cos(eAngle + Math.PI);
  const ey = cy - 100 * Math.sin(eAngle + Math.PI);
  ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#8b5cf6'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText("e⁻ recoil", ex, ey - 12);

  // Angle arc
  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, 50, -scatterAngleRad, 0); ctx.stroke();
  ctx.fillStyle = '#00d4ff'; ctx.font = '12px sans-serif';
  ctx.fillText(`θ=${angle}°`, cx + 55, cy - 15);

  // Results panel
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 200, 120, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Compton Scattering', 120, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`Δλ = ${Δλ.toFixed(5)} nm`, 120, 60);
  ctx.fillText(`λ' = ${λScattered.toFixed(5)} nm`, 120, 78);
  ctx.fillText(`Energy in: ${energyIn.toFixed(2)} keV`, 120, 96);
  ctx.fillText(`Energy out: ${energyOut.toFixed(2)} keV`, 120, 114);

  return {
    incident_wavelength_nm: wavelength,
    scattered_wavelength_nm: λScattered.toFixed(5),
    wavelength_shift_nm: Δλ.toFixed(5),
    scattering_angle_deg: angle,
    energy_in_keV: energyIn.toFixed(3),
    energy_out_keV: energyOut.toFixed(3)
  };
}

export function drawHydrogenSpectrum(ctx, w, h, values, time) {
  const { nLower, nUpper } = values;
  const R = 1.097e7; // m^-1
  const nL = Math.min(nLower, nUpper - 1);
  const nU = Math.max(nLower + 1, nUpper);
  const invLambda = R * (1 / (nL * nL) - 1 / (nU * nU));
  const λ = invLambda > 0 ? 1 / invLambda * 1e9 : 0;

  // Energy level diagram
  const levels = [1, 2, 3, 4, 5, 6, 7];
  const levelEnergies = levels.map(n => -13.6 / (n * n));
  const minE = levelEnergies[0];
  const maxE = 0;
  const levelX = 100;
  const levelWidth = 120;
  const diagTop = 50;
  const diagBot = h - 80;

  const toY = (E) => diagTop + (E - maxE) / (minE - maxE) * (diagBot - diagTop);

  // Draw energy levels
  levels.forEach(n => {
    const E = -13.6 / (n * n);
    const y = toY(E);
    ctx.strokeStyle = n === nL ? '#ef4444' : n === nU ? '#3b82f6' : 'rgba(148,163,184,0.4)';
    ctx.lineWidth = n === nL || n === nU ? 3 : 1.5;
    ctx.beginPath(); ctx.moveTo(levelX, y); ctx.lineTo(levelX + levelWidth, y); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(`n=${n} (${E.toFixed(2)} eV)`, levelX - 5, y + 4);
  });

  // Transition arrow
  const y1 = toY(-13.6 / (nU * nU));
  const y2 = toY(-13.6 / (nL * nL));
  const arrowX = levelX + levelWidth / 2;

  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(arrowX, y1 + 5); ctx.lineTo(arrowX, y2 - 5); ctx.stroke();
  ctx.fillStyle = '#00d4ff';
  ctx.beginPath();
  ctx.moveTo(arrowX, y2 - 5);
  ctx.lineTo(arrowX - 8, y2 - 20);
  ctx.lineTo(arrowX + 8, y2 - 20);
  ctx.closePath(); ctx.fill();

  // Emitted photon
  const midY = (y1 + y2) / 2;
  ctx.fillStyle = '#00d4ff'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(`hν`, arrowX + 12, midY + 4);

  // Spectrum bar visualization
  const specY = h - 60;
  const specX1 = 270, specX2 = w - 40;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(specX1, specY - 30, specX2 - specX1, 60);

  // Rainbow background
  const grad = ctx.createLinearGradient(specX1, 0, specX2, 0);
  grad.addColorStop(0, 'rgba(100,0,255,0.3)');
  grad.addColorStop(0.15, 'rgba(0,0,255,0.3)');
  grad.addColorStop(0.35, 'rgba(0,255,200,0.3)');
  grad.addColorStop(0.55, 'rgba(0,255,0,0.3)');
  grad.addColorStop(0.75, 'rgba(255,255,0,0.3)');
  grad.addColorStop(1, 'rgba(255,0,0,0.3)');
  ctx.fillStyle = grad;
  ctx.fillRect(specX1, specY - 30, specX2 - specX1, 60);

  // Spectral line
  if (λ > 380 && λ < 780) {
    const lineX = specX1 + ((λ - 380) / 400) * (specX2 - specX1);
    let r = 0, g = 0, b = 0;
    if (λ < 440) { r = (440 - λ) / 60 * 200; b = 255; }
    else if (λ < 490) { b = 255; g = (λ - 440) / 50 * 255; }
    else if (λ < 560) { g = 255; b = (560 - λ) / 70 * 255; }
    else if (λ < 620) { r = (λ - 560) / 60 * 255; g = 255; }
    else { r = 255; g = (700 - λ) / 80 * 100; }
    ctx.strokeStyle = `rgb(${r},${g},${b})`; ctx.lineWidth = 4;
    ctx.shadowBlur = 15; ctx.shadowColor = `rgb(${r},${g},${b})`;
    ctx.beginPath(); ctx.moveTo(lineX, specY - 32); ctx.lineTo(lineX, specY + 32); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`${λ.toFixed(1)} nm`, lineX, specY + 48);
  }

  ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('380 nm', specX1 + 20, specY - 38);
  ctx.fillText('780 nm', specX2 - 20, specY - 38);
  ctx.fillText('Emission Spectrum', (specX1 + specX2) / 2, specY - 38);

  // Series name
  const seriesNames = ['', 'Lyman', 'Balmer', 'Paschen', 'Brackett', 'Pfund'];
  const seriesName = seriesNames[nL] || `n=${nL}`;

  // Results panel
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(270, 20, 220, 100, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Hydrogen Spectrum', 380, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`Transition: n=${nU} → n=${nL} (${seriesName})`, 380, 60);
  ctx.fillText(`λ = ${λ.toFixed(2)} nm`, 380, 78);
  ctx.fillText(`ΔE = ${(13.6 * (1/(nL*nL) - 1/(nU*nU))).toFixed(3)} eV`, 380, 96);

  return {
    transition: `n=${nU}→n=${nL}`,
    series: seriesName,
    wavelength_nm: λ.toFixed(3),
    energy_eV: (13.6 * (1 / (nL * nL) - 1 / (nU * nU))).toFixed(4),
    rydberg_invM: invLambda.toExponential(4)
  };
}

export function drawXRayDiffraction(ctx, w, h, values, time) {
  const { wavelength, latticeSpacing, order } = values;
  const sinTheta = (order * wavelength) / (2 * latticeSpacing);
  const theta = sinTheta <= 1 ? Math.asin(sinTheta) * 180 / Math.PI : null;

  const cx = w / 2;
  const cy = h / 2 + 30;

  // Crystal lattice
  const rows = 4, cols = 7;
  const dx = 55, dy = 45;
  const lx = cx - (cols / 2) * dx + 10;
  const ly = cy - (rows / 2) * dy;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = lx + c * dx;
      const y = ly + r * dy;
      ctx.fillStyle = '#3b82f6';
      ctx.shadowBlur = 8; ctx.shadowColor = '#3b82f6';
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      if (c < cols - 1) {
        ctx.strokeStyle = 'rgba(59,130,246,0.3)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y); ctx.stroke();
      }
    }
    // Row spacing label
    if (r > 0) {
      ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(`d=${latticeSpacing}nm`, lx - 8, ly + r * dy - dy / 2 + 4);
    }
  }

  // Bragg planes (dashed)
  for (let r = 0; r < rows; r++) {
    ctx.strokeStyle = 'rgba(248,113,113,0.4)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(lx - 20, ly + r * dy);
    ctx.lineTo(lx + (cols - 1) * dx + 20, ly + r * dy);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Incident and reflected beams
  if (theta !== null) {
    const tRad = theta * Math.PI / 180;
    const hitX = cx;
    const hitY = ly + dy;

    const beamLen = 140;
    const incX1 = hitX - beamLen * Math.cos(tRad);
    const incY1 = hitY - beamLen * Math.sin(tRad);
    const refX2 = hitX + beamLen * Math.cos(tRad);
    const refY2 = hitY - beamLen * Math.sin(tRad);

    ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(incX1, incY1); ctx.lineTo(hitX, hitY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hitX, hitY); ctx.lineTo(refX2, refY2); ctx.stroke();

    // Angle arc
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(hitX, hitY, 40, -Math.PI + tRad, -tRad); ctx.stroke();
    ctx.fillStyle = '#f59e0b'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`θ=${theta.toFixed(1)}°`, hitX, hitY + 55);
  }

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 210, 100, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText("Bragg's Law: 2d sinθ = nλ", 125, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`λ = ${wavelength} nm,  n = ${order}`, 125, 60);
  ctx.fillText(`d = ${latticeSpacing} nm`, 125, 78);
  if (theta !== null) {
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Bragg angle θ = ${theta.toFixed(2)}°`, 125, 96);
  } else {
    ctx.fillStyle = '#ef4444';
    ctx.fillText('No diffraction (sinθ > 1)', 125, 96);
  }

  return {
    wavelength_nm: wavelength,
    d_spacing_nm: latticeSpacing,
    order: order,
    braggAngle_deg: theta !== null ? theta.toFixed(3) : 'N/A',
    condition: theta !== null ? `2×${latticeSpacing}×sin${theta.toFixed(1)}°=${(2*latticeSpacing*Math.sin(theta*Math.PI/180)).toFixed(4)}nm` : 'Not satisfied'
  };
}

export function drawHallEffect(ctx, w, h, values, time) {
  const { current, magneticField, thickness, hallVoltage } = values;
  const I_A = current * 1e-3;
  const t_m = thickness * 1e-3;
  const VH = hallVoltage * 1e-3;
  const RH = (VH * t_m) / (I_A * magneticField);
  const n = 1 / (1.6e-19 * Math.abs(RH));
  const mobility = Math.abs(RH) / 1e-4; // simplified

  const cx = w / 2, cy = h / 2;
  const sw = 200, sh = 100;

  // Semiconductor slab
  ctx.fillStyle = '#1e3a5f';
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
  ctx.fillRect(cx - sw / 2, cy - sh / 2, sw, sh);
  ctx.strokeRect(cx - sw / 2, cy - sh / 2, sw, sh);

  ctx.fillStyle = '#3b82f6'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Semiconductor', cx, cy + 5);
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
  ctx.fillText(`t = ${thickness} mm`, cx, cy + 22);

  // Current flow arrows
  for (let i = -2; i <= 2; i++) {
    const phase = ((time * 2) + i * 0.4) % 1;
    const px = cx - sw / 2 + phase * sw;
    const py = cy + i * 15;
    ctx.fillStyle = '#10b981';
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
  }
  // Current direction label
  ctx.fillStyle = '#10b981'; ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`I = ${current} mA →`, cx, cy - sh / 2 - 15);

  // Magnetic field (B into page)
  ctx.fillStyle = '#7928ca'; ctx.font = 'bold 18px sans-serif';
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      ctx.fillText('×', cx + c * 60, cy + r * 30);
    }
  }
  ctx.fillStyle = '#7928ca'; ctx.font = '12px sans-serif';
  ctx.fillText(`B = ${magneticField} T (into page)`, cx, h - 30);

  // Hall voltage arrows
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - sw / 2 - 30, cy);
  ctx.lineTo(cx - sw / 2 - 10, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + sw / 2 + 10, cy);
  ctx.lineTo(cx + sw / 2 + 30, cy);
  ctx.stroke();
  ctx.fillStyle = '#ef4444'; ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`VH = ${(VH * 1000).toFixed(1)} mV`, cx + sw / 2 + 55, cy + 4);

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 220, 110, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Hall Effect', 130, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`RH = ${RH.toExponential(3)} m³/C`, 130, 60);
  ctx.fillText(`n = ${n.toExponential(3)} /m³`, 130, 78);
  ctx.fillText(`Carrier type: ${RH > 0 ? 'p-type (holes)' : 'n-type (e⁻)'}`, 130, 96);
  ctx.fillStyle = '#10b981';
  ctx.fillText(`μ ≈ ${mobility.toFixed(2)} cm²/Vs`, 130, 114);

  return {
    current_mA: current,
    magneticField_T: magneticField,
    hallVoltage_mV: hallVoltage,
    hallCoefficient_m3_C: RH.toExponential(4),
    carrierDensity_m3: n.toExponential(4),
    carrierType: RH > 0 ? 'p-type' : 'n-type'
  };
}

export function drawStefanBoltzmann(ctx, w, h, values, time) {
  const σ = 5.67e-8;
  const { temperature, area, emissivity } = values;
  const power = emissivity * σ * area * Math.pow(temperature, 4);
  const intensity = power / area;
  const peakλ = 2.898e6 / temperature; // nm (Wien's law)

  const cx = w / 2, cy = h / 2;

  // Blackbody curve
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  const specX1 = 80, specX2 = w - 80;
  const specY = h - 70;
  let drawn = false;
  for (let x = specX1; x < specX2; x++) {
    const λ_nm = 100 + ((x - specX1) / (specX2 - specX1)) * 2900;
    const λ_m = λ_nm * 1e-9;
    const h_ = 6.626e-34, c_ = 3e8, k_ = 1.38e-23;
    const planck = (2 * h_ * c_ * c_) / (Math.pow(λ_m, 5) * (Math.exp((h_ * c_) / (λ_m * k_ * temperature)) - 1));
    const normFactor = 5e10;
    const py = specY - Math.min(planck * normFactor, specY - 60);
    if (!drawn) { ctx.moveTo(x, py); drawn = true; } else ctx.lineTo(x, py);
  }
  ctx.stroke();

  // Peak wavelength marker
  const peakX = specX1 + ((peakλ - 100) / 2900) * (specX2 - specX1);
  if (peakX > specX1 && peakX < specX2) {
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(peakX, 60); ctx.lineTo(peakX, specY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`λmax = ${peakλ.toFixed(0)} nm`, peakX, 52);
  }

  // Axes
  ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(specX1, specY); ctx.lineTo(specX2, specY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(specX1, 40); ctx.lineTo(specX1, specY); ctx.stroke();
  ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('100 nm', specX1 + 20, specY + 16);
  ctx.fillText('3000 nm', specX2 - 20, specY + 16);
  ctx.fillText('Wavelength (nm)', cx, specY + 32);

  // Glowing body
  const temp_norm = (temperature - 300) / 1200;
  const r = Math.min(255, Math.round(temp_norm * 255));
  const g = Math.round(Math.max(0, temp_norm - 0.5) * 2 * 200);
  ctx.fillStyle = `rgb(${r}, ${g}, 20)`;
  ctx.shadowBlur = 40 * temp_norm; ctx.shadowColor = `rgb(${r}, ${g}, 0)`;
  ctx.beginPath(); ctx.arc(cx, 160, 40, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`T = ${temperature} K`, cx, 163);

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(w - 230, 20, 210, 100, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Stefan-Boltzmann Law', w - 125, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`P = ${power.toExponential(3)} W`, w - 125, 60);
  ctx.fillText(`Intensity = ${intensity.toExponential(3)} W/m²`, w - 125, 78);
  ctx.fillText(`λ_peak = ${peakλ.toFixed(0)} nm (Wien)`, w - 125, 96);

  return {
    temperature_K: temperature,
    emissivity: emissivity,
    radiatedPower_W: power.toExponential(4),
    intensity_Wm2: intensity.toExponential(4),
    peakWavelength_nm: peakλ.toFixed(2)
  };
}

export function drawNuclearDecay(ctx, w, h, values, time) {
  const { initialAtoms, halfLife, time: obsTime } = values;
  const λ = Math.log(2) / halfLife;
  const N = initialAtoms * Math.exp(-λ * obsTime);
  const A = λ * N;
  const elapsed = (time * 10) % obsTime;
  const Nt = initialAtoms * Math.exp(-λ * elapsed);

  const gX1 = 70, gX2 = w - 50;
  const gY1 = 50, gY2 = h - 80;

  // Decay curve
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = gX1; x <= gX2; x++) {
    const t = ((x - gX1) / (gX2 - gX1)) * obsTime;
    const n = initialAtoms * Math.exp(-λ * t);
    const y = gY1 + (1 - n / initialAtoms) * (gY2 - gY1);
    if (x === gX1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Animated current position
  const animX = gX1 + (elapsed / obsTime) * (gX2 - gX1);
  const animY = gY1 + (1 - Nt / initialAtoms) * (gY2 - gY1);
  ctx.fillStyle = '#ef4444';
  ctx.shadowBlur = 15; ctx.shadowColor = '#ef4444';
  ctx.beginPath(); ctx.arc(animX, animY, 8, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // Half-life markers
  for (let i = 1; i * halfLife <= obsTime; i++) {
    const hx = gX1 + (i * halfLife / obsTime) * (gX2 - gX1);
    const hy = gY1 + (1 - 0.5 ** i) * (gY2 - gY1);
    ctx.strokeStyle = 'rgba(248,113,113,0.5)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(hx, gY1); ctx.lineTo(hx, gY2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f87171'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`t½×${i}`, hx, gY2 + 14);
  }

  // Axes
  ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(gX1, gY1); ctx.lineTo(gX1, gY2); ctx.lineTo(gX2, gY2); ctx.stroke();
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`N₀=${initialAtoms}`, gX1 - 5, gY1 + 5);
  ctx.textAlign = 'center';
  ctx.fillText(`Time (s)`, (gX1 + gX2) / 2, h - 25);

  // Atoms visual
  const dotCount = Math.min(80, Math.round(Nt / initialAtoms * 80));
  for (let i = 0; i < 80; i++) {
    const dotX = w - 150 + (i % 10) * 12;
    const dotY = 60 + Math.floor(i / 10) * 12;
    ctx.fillStyle = i < dotCount ? '#10b981' : 'rgba(100,116,139,0.2)';
    ctx.beginPath(); ctx.arc(dotX, dotY, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Remaining atoms', w - 95, 155);

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, gY2 - 20, 240, 75, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Radioactive Decay', 140, gY2);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`N(${obsTime}s) = ${N.toExponential(3)}`, 140, gY2 + 18);
  ctx.fillText(`Activity A = ${A.toExponential(3)} Bq`, 140, gY2 + 36);
  ctx.fillStyle = '#10b981';
  ctx.fillText(`λ = ${λ.toFixed(4)} s⁻¹`, 140, gY2 + 54);

  return {
    remainingAtoms: N.toExponential(4),
    activity_Bq: A.toExponential(4),
    decayConstant: λ.toFixed(5),
    halfLife_s: halfLife,
    observationTime_s: obsTime
  };
}

export function drawQuantumTunneling(ctx, w, h, values, time) {
  const hbar = 1.055e-34;
  const me = 9.109e-31;
  const eV = 1.6e-19;
  const { barrierHeight, barrierWidth, particleEnergy, particleMass } = values;

  const V = barrierHeight, E = particleEnergy;
  const m = particleMass * me;
  const a = barrierWidth * 1e-9;
  const kappa = V > E ? Math.sqrt(2 * m * (V - E) * eV) / hbar : 0;
  const T = V > E ? Math.exp(-2 * kappa * a) : 1;
  const R = 1 - T;

  const cx = w / 2, cy = h / 2;
  const barrierX1 = cx - 60, barrierX2 = cx + 60;
  const barrierTop = cy - 120, barrierBot = cy + 80;

  // Potential well and barrier
  ctx.fillStyle = 'rgba(239,68,68,0.15)';
  ctx.fillRect(barrierX1, barrierTop, 120, barrierBot - barrierTop);
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.strokeRect(barrierX1, barrierTop, 120, barrierBot - barrierTop);
  ctx.fillStyle = '#ef4444'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`V = ${barrierHeight} eV`, cx, barrierTop - 12);
  ctx.fillText(`a = ${barrierWidth} nm`, cx, barrierBot + 18);

  // Energy level
  const energyY = barrierBot - (E / V) * (barrierBot - barrierTop);
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(40, energyY); ctx.lineTo(w - 40, energyY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#3b82f6'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(`E = ${particleEnergy} eV`, 45, energyY - 6);

  // Wave function regions
  const amp = 60;
  const k = Math.sqrt(2 * m * E * eV) / hbar;
  const phase = time * 3;

  // Incident wave (left)
  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = 40; x < barrierX1; x++) {
    const normX = (x - 40) * k * 1e-10;
    const y = energyY - amp * Math.sin(normX - phase);
    if (x === 40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Evanescent wave inside barrier
  ctx.strokeStyle = 'rgba(255,165,0,0.8)'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = barrierX1; x <= barrierX2; x++) {
    const normX = (x - barrierX1) * kappa;
    const decayAmp = amp * Math.exp(-normX * 1e-10 * 30);
    const y = energyY - decayAmp * Math.sin(normX - phase);
    if (x === barrierX1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Transmitted wave (right), amplitude scaled by √T
  ctx.strokeStyle = `rgba(16,185,129,${T > 0.001 ? 1 : 0.3})`; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = barrierX2; x < w - 40; x++) {
    const normX = (x - barrierX2) * k * 1e-10;
    const y = energyY - amp * Math.sqrt(T) * Math.sin(normX - phase);
    if (x === barrierX2) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Labels
  ctx.fillStyle = '#00d4ff'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Incident ψ', (40 + barrierX1) / 2, energyY - amp - 15);
  ctx.fillStyle = '#f97316';
  ctx.fillText('Evanescent', cx, energyY - amp * Math.exp(-1) - 15);
  ctx.fillStyle = '#10b981';
  ctx.fillText('Transmitted ψ', (barrierX2 + w - 40) / 2, energyY - amp * Math.sqrt(T) - 15);

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 220, 110, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Quantum Tunneling', 130, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`κ = ${kappa.toExponential(3)} m⁻¹`, 130, 60);
  ctx.fillStyle = T > 0.01 ? '#10b981' : '#f59e0b';
  ctx.fillText(`T = ${T.toExponential(4)}`, 130, 78);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`R = ${R.toFixed(6)}`, 130, 96);
  ctx.fillText(T < 1e-10 ? 'Essentially opaque' : T > 0.1 ? 'Significant tunneling!' : 'Low tunneling', 130, 114);

  return {
    transmissionCoeff: T.toExponential(5),
    reflectionCoeff: R.toFixed(6),
    kappa_m: kappa.toExponential(4),
    barrierHeight_eV: barrierHeight,
    particleEnergy_eV: particleEnergy
  };
}

export function drawParticleInBox(ctx, w, h, values, time) {
  const hbar = 1.055e-34;
  const me = 9.109e-31;
  const eV = 1.6e-19;
  const { boxWidth, quantumNumber: n, particleMass } = values;
  const L = boxWidth * 1e-9;
  const m = particleMass * me;
  const E = (n * n * Math.PI * Math.PI * hbar * hbar) / (2 * m * L * L) / eV;
  const E1 = (Math.PI * Math.PI * hbar * hbar) / (2 * m * L * L) / eV;

  const cx = w / 2;
  const boxX1 = 80, boxX2 = w - 80;
  const baseY = h - 80;

  // Draw all energy levels (faint)
  for (let ni = 1; ni <= Math.min(8, n + 3); ni++) {
    const Ei = ni * ni * E1;
    const ey = baseY - (Ei / (n * n * E1 + E1)) * (baseY - 80);
    ctx.strokeStyle = ni === n ? '#00d4ff' : 'rgba(148,163,184,0.2)';
    ctx.lineWidth = ni === n ? 2 : 1;
    ctx.beginPath(); ctx.moveTo(boxX1, ey); ctx.lineTo(boxX2, ey); ctx.stroke();
    ctx.fillStyle = ni === n ? '#00d4ff' : 'rgba(148,163,184,0.3)';
    ctx.font = ni === n ? 'bold 11px sans-serif' : '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`n=${ni}  E=${(ni * ni * E1).toFixed(2)} eV`, boxX1 - 6, ey + 4);
  }

  // Box walls
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(boxX1 - 20, 30, 20, baseY - 30);
  ctx.fillRect(boxX2, 30, 20, baseY - 30);
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(boxX1, 30); ctx.lineTo(boxX1, baseY); ctx.lineTo(boxX2, baseY); ctx.lineTo(boxX2, 30); ctx.stroke();
  ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`L = ${boxWidth} nm`, cx, baseY + 20);
  ctx.fillText('V = ∞', boxX1 - 10, h - 30);
  ctx.fillText('V = ∞', boxX2 + 10, h - 30);

  // Wave function on energy level
  const energyY = baseY - (E / (n * n * E1 + E1)) * (baseY - 80);
  const wfAmp = 40;
  const phase = time * 3;

  // Probability density (|ψ|²) shaded
  for (let x = boxX1; x <= boxX2; x++) {
    const xNorm = (x - boxX1) / (boxX2 - boxX1);
    const psi2 = Math.pow(Math.sin(n * Math.PI * xNorm), 2);
    ctx.fillStyle = `rgba(0,212,255,${psi2 * 0.25})`;
    ctx.fillRect(x, energyY - wfAmp, 1, wfAmp * 2);
  }

  // Wave function ψ
  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2.5;
  ctx.shadowBlur = 8; ctx.shadowColor = '#00d4ff';
  ctx.beginPath();
  for (let x = boxX1; x <= boxX2; x++) {
    const xNorm = (x - boxX1) / (boxX2 - boxX1);
    const psi = Math.sqrt(2 / boxWidth) * Math.sin(n * Math.PI * xNorm) * Math.cos(phase * 0.5);
    const y = energyY - psi * wfAmp * 0.8;
    if (x === boxX1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Nodes
  for (let ni = 0; ni <= n; ni++) {
    const nx = boxX1 + (ni / n) * (boxX2 - boxX1);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(nx, energyY, 5, 0, Math.PI * 2); ctx.fill();
  }

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(w - 220, 20, 200, 110, 8); ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Particle in a Box', w - 120, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`n = ${n},  L = ${boxWidth} nm`, w - 120, 60);
  ctx.fillText(`E_n = ${E.toFixed(4)} eV`, w - 120, 78);
  ctx.fillText(`E₁ = ${E1.toFixed(4)} eV`, w - 120, 96);
  ctx.fillText(`Nodes: ${n + 1},  Antinodes: ${n}`, w - 120, 114);

  return {
    quantumNumber: n,
    boxWidth_nm: boxWidth,
    energyLevel_eV: E.toFixed(5),
    groundStateEnergy_eV: E1.toFixed(5),
    energyRatio_E_E1: (n * n).toFixed(0),
    nodes: n + 1,
    antinodes: n
  };
}

export function drawSuperconductivity(ctx, w, h, values, time) {
  const { temperature, criticalTemp, magneticField } = values;
  const T = temperature, Tc = criticalTemp;
  const isSuperC = T < Tc;
  const R = isSuperC ? 0 : 100 * (T - Tc) / Tc;
  const Hc = isSuperC ? Math.max(0, 1 * (1 - (T / Tc) ** 2)) : 0;
  const cx = w / 2, cy = h / 2;

  // R vs T graph
  const gX1 = 60, gX2 = w / 2 - 20;
  const gY1 = 40, gY2 = h - 80;

  ctx.strokeStyle = 'rgba(148,163,184,0.2)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(gX1, gY1); ctx.lineTo(gX1, gY2); ctx.lineTo(gX2, gY2); ctx.stroke();

  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = gX1; x <= gX2; x++) {
    const t = (x - gX1) / (gX2 - gX1) * (Tc + 50);
    const r = t < Tc ? 0 : 100 * (t - Tc) / Tc;
    const y = gY2 - (r / 150) * (gY2 - gY1);
    if (x === gX1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Current T marker
  const curX = gX1 + (T / (Tc + 50)) * (gX2 - gX1);
  const curR = isSuperC ? 0 : 100 * (T - Tc) / Tc;
  const curY = gY2 - (curR / 150) * (gY2 - gY1);
  ctx.fillStyle = isSuperC ? '#10b981' : '#ef4444';
  ctx.shadowBlur = 15; ctx.shadowColor = isSuperC ? '#10b981' : '#ef4444';
  ctx.beginPath(); ctx.arc(curX, curY, 8, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // Tc line
  const tcX = gX1 + (Tc / (Tc + 50)) * (gX2 - gX1);
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(tcX, gY1); ctx.lineTo(tcX, gY2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f59e0b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`Tc=${Tc}K`, tcX, gY1 - 6);

  ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
  ctx.fillText('Temperature (K)', (gX1 + gX2) / 2, gY2 + 20);
  ctx.save(); ctx.rotate(-Math.PI / 2);
  ctx.fillText('Resistance (Ω)', -(gY1 + gY2) / 2, gX1 - 30);
  ctx.restore();

  // Meissner effect visualization
  const mX = w / 2 + 40, mY = cy;
  const mR = 80;

  if (isSuperC) {
    // Superconductor (no field inside)
    ctx.fillStyle = '#1e3a5f';
    ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 3;
    ctx.shadowBlur = 20; ctx.shadowColor = '#00d4ff';
    ctx.beginPath(); ctx.arc(mX, mY, mR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('SC', mX, mY - 6);
    ctx.font = '11px sans-serif';
    ctx.fillText('B = 0 inside', mX, mY + 12);

    // Field lines go around
    for (let i = -3; i <= 3; i++) {
      const fy = mY + i * 25;
      ctx.strokeStyle = 'rgba(0,212,255,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (Math.abs(fy - mY) <= mR) {
        const dx = Math.sqrt(mR * mR - (fy - mY) ** 2) + 15;
        ctx.moveTo(mX - mR - 60, fy);
        ctx.quadraticCurveTo(mX - dx - 20, fy - (fy < mY ? -1 : 1) * 30, mX - dx, fy);
        ctx.moveTo(mX + dx, fy);
        ctx.quadraticCurveTo(mX + dx + 20, fy - (fy < mY ? -1 : 1) * 30, mX + mR + 60, fy);
      } else {
        ctx.moveTo(mX - mR - 60, fy); ctx.lineTo(mX + mR + 60, fy);
      }
      ctx.stroke();
    }
    ctx.fillStyle = '#00d4ff'; ctx.font = '12px sans-serif';
    ctx.fillText('Meissner Effect: B expelled', mX, mY + mR + 25);
  } else {
    // Normal conductor
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(mX, mY, mR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#64748b'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Normal', mX, mY - 6);
    // Field lines go through
    for (let i = -3; i <= 3; i++) {
      const fy = mY + i * 25;
      ctx.strokeStyle = 'rgba(148,163,184,0.4)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(mX - mR - 60, fy); ctx.lineTo(mX + mR + 60, fy); ctx.stroke();
    }
    ctx.fillStyle = '#64748b'; ctx.font = '12px sans-serif';
    ctx.fillText('B penetrates (normal state)', mX, mY + mR + 25);
  }

  // Status banner
  ctx.fillStyle = isSuperC ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)';
  ctx.roundRect(20, h - 60, w - 40, 40, 8); ctx.fill();
  ctx.fillStyle = isSuperC ? '#10b981' : '#ef4444';
  ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(
    isSuperC
      ? `✓ SUPERCONDUCTING  |  T = ${T}K < Tc = ${Tc}K  |  R = 0 Ω`
      : `✗ NORMAL STATE  |  T = ${T}K > Tc = ${Tc}K  |  R = ${R.toFixed(1)} Ω`,
    cx, h - 34
  );

  return {
    temperature_K: T,
    criticalTemp_K: Tc,
    state: isSuperC ? 'Superconducting' : 'Normal',
    resistance_ohm: R.toFixed(2),
    meissnerEffect: isSuperC ? 'Active (B=0 inside)' : 'None'
  };
}
