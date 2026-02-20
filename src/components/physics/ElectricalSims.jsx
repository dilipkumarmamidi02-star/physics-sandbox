export function drawPotentiometer(ctx, w, h, values, time) {
  const { emf1, emf2, wireLength, rheostat } = values;
  const l1 = wireLength * emf1 / (emf1 + emf2);
  const l2 = wireLength * emf2 / (emf1 + emf2);
  const ratio = emf1 / emf2;

  const wireY = h / 2 - 30;
  const wireX1 = 80;
  const wireX2 = w - 80;
  const wirePixels = wireX2 - wireX1;

  // Draw main wire
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(wireX1, wireY);
  ctx.lineTo(wireX2, wireY);
  ctx.stroke();

  // Wire endpoints labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', wireX1, wireY - 12);
  ctx.fillText('B', wireX2, wireY - 12);

  // Scale markings
  for (let i = 0; i <= 10; i++) {
    const x = wireX1 + (i / 10) * wirePixels;
    ctx.strokeStyle = 'rgba(148,163,184,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, wireY - 8);
    ctx.lineTo(x, wireY + 8);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.fillText(`${i * wireLength / 10}`, x, wireY + 20);
  }

  // Balance point for cell 1
  const bp1X = wireX1 + (l1 / wireLength) * wirePixels;
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(bp1X, wireY);
  ctx.lineTo(bp1X, wireY + 80);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(bp1X, wireY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('J₁', bp1X, wireY + 100);
  ctx.fillText(`l₁ = ${l1.toFixed(1)} cm`, bp1X, wireY + 115);

  // Cell 1 box
  ctx.fillStyle = '#10b981';
  ctx.fillRect(bp1X - 35, wireY + 120, 70, 28);
  ctx.fillStyle = '#fff';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`E₁ = ${emf1.toFixed(1)}V`, bp1X, wireY + 139);

  // Balance point for cell 2
  const bp2X = wireX1 + (l2 / wireLength) * wirePixels;
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(bp2X, wireY);
  ctx.lineTo(bp2X, wireY - 80);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(bp2X, wireY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('J₂', bp2X, wireY - 100);
  ctx.fillText(`l₂ = ${l2.toFixed(1)} cm`, bp2X, wireY - 115);

  // Cell 2 box
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(bp2X - 35, wireY - 148, 70, 28);
  ctx.fillStyle = '#fff';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`E₂ = ${emf2.toFixed(1)}V`, bp2X, wireY - 129);

  // Rheostat box
  ctx.fillStyle = '#7928ca';
  ctx.fillRect(wireX1 - 60, wireY - 20, 50, 40);
  ctx.fillStyle = '#fff';
  ctx.font = '10px sans-serif';
  ctx.fillText(`Rh=${rheostat}Ω`, wireX1 - 35, wireY + 5);

  // Results box
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(w - 200, 20, 180, 90, 8);
  ctx.fill();
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Results', w - 110, 40);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '12px sans-serif';
  ctx.fillText(`E₁/E₂ = ${ratio.toFixed(3)}`, w - 110, 60);
  ctx.fillText(`l₁/l₂ = ${(l1 / l2).toFixed(3)}`, w - 110, 78);
  ctx.fillStyle = Math.abs(ratio - l1 / l2) < 0.01 ? '#10b981' : '#ef4444';
  ctx.fillText('Verified ✓', w - 110, 96);

  return {
    balanceLength1: l1.toFixed(2),
    balanceLength2: l2.toFixed(2),
    EMF_ratio: ratio.toFixed(4),
    length_ratio: (l1 / l2).toFixed(4)
  };
}

export function drawMeterBridge(ctx, w, h, values, time) {
  const { knownR, unknownR, wireResistance } = values;
  const l = 100 * knownR / (knownR + unknownR);
  const measuredS = knownR * (100 - l) / l;
  const percentError = Math.abs((measuredS - unknownR) / unknownR) * 100;

  const bridgeY = h / 2;
  const bridgeX1 = 80;
  const bridgeX2 = w - 80;
  const bridgeLen = bridgeX2 - bridgeX1;

  // Draw meter bridge wire
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(bridgeX1, bridgeY);
  ctx.lineTo(bridgeX2, bridgeY);
  ctx.stroke();

  // cm markings
  for (let i = 0; i <= 10; i++) {
    const x = bridgeX1 + (i / 10) * bridgeLen;
    ctx.strokeStyle = 'rgba(148,163,184,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, bridgeY - 10); ctx.lineTo(x, bridgeY + 10); ctx.stroke();
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`${i * 10}`, x, bridgeY + 22);
  }

  // Balance point
  const bpX = bridgeX1 + (l / 100) * bridgeLen;
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 3;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(bpX, bridgeY - 60);
  ctx.lineTo(bpX, bridgeY + 60);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#00d4ff';
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#00d4ff';
  ctx.beginPath();
  ctx.arc(bpX, bridgeY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`D (${l.toFixed(1)} cm)`, bpX, bridgeY + 80);

  // Known R box (left)
  ctx.fillStyle = '#10b981';
  ctx.fillRect(bridgeX1 - 60, bridgeY - 30, 55, 35);
  ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('R (Known)', bridgeX1 - 32, bridgeY - 12);
  ctx.fillText(`${knownR} Ω`, bridgeX1 - 32, bridgeY + 5);

  // Unknown R box (right)
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(bridgeX2 + 5, bridgeY - 30, 55, 35);
  ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif';
  ctx.fillText('S (Unknown)', bridgeX2 + 32, bridgeY - 12);
  ctx.fillText(`${unknownR} Ω`, bridgeX2 + 32, bridgeY + 5);

  // Galvanometer
  ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bpX, bridgeY - 60);
  ctx.lineTo(bpX, bridgeY - 100);
  ctx.stroke();
  ctx.fillStyle = '#8b5cf6';
  ctx.beginPath();
  ctx.arc(bpX, bridgeY - 115, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('G', bpX, bridgeY - 110);

  // Results
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.roundRect(20, 20, 200, 100, 8);
  ctx.fill();
  ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Wheatstone Bridge', 120, 40);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif';
  ctx.fillText(`Balance Point l = ${l.toFixed(2)} cm`, 120, 60);
  ctx.fillText(`Measured S = ${measuredS.toFixed(2)} Ω`, 120, 78);
  ctx.fillStyle = percentError < 2 ? '#10b981' : '#f59e0b';
  ctx.fillText(`Error = ${percentError.toFixed(2)}%`, 120, 96);

  return {
    balancePoint: l.toFixed(2),
    measuredResistance: measuredS.toFixed(2),
    actualResistance: unknownR.toFixed(2),
    percentError: percentError.toFixed(2)
  };
}

export function drawGalvanometer(ctx, w, h, values, time) {
  const { Ig, G, I, V } = values;
  const shunt = (Ig * G) / (I - Ig);
  const series = (V / Ig) - G;

  const cx = w / 2;
  const cy = h / 2 - 20;

  // Galvanometer circle
  ctx.strokeStyle = '#7928ca';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#7928ca';
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#7928ca';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('G', cx, cy + 6);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText(`Rg = ${G} Ω`, cx, cy + 24);

  // Needle animation
  const angle = -Math.PI / 2 + Math.sin(time * 1.5) * 0.4;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 50 * Math.cos(angle), cy + 50 * Math.sin(angle));
  ctx.stroke();

  // Ammeter conversion (left panel)
  const panelLeft = 30;
  ctx.fillStyle = 'rgba(16,185,129,0.15)';
  ctx.roundRect(panelLeft, 40, 190, 180, 10);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.roundRect(panelLeft, 40, 190, 180, 10);
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔌 Ammeter', panelLeft + 95, 62);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '12px sans-serif';
  ctx.fillText(`Range: 0 – ${I} A`, panelLeft + 95, 84);
  ctx.fillText(`Shunt Resistance:`, panelLeft + 95, 106);
  ctx.fillStyle = '#00d4ff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`S = ${shunt.toFixed(4)} Ω`, panelLeft + 95, 128);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.fillText('Formula: S = IgG / (I - Ig)', panelLeft + 95, 150);
  ctx.fillText(`S connected in parallel`, panelLeft + 95, 168);
  ctx.fillText(`with galvanometer`, panelLeft + 95, 185);

  // Voltmeter conversion (right panel)
  const panelRight = w - 220;
  ctx.fillStyle = 'rgba(59,130,246,0.15)';
  ctx.roundRect(panelRight, 40, 190, 180, 10);
  ctx.fill();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.roundRect(panelRight, 40, 190, 180, 10);
  ctx.stroke();

  ctx.fillStyle = '#3b82f6';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ Voltmeter', panelRight + 95, 62);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '12px sans-serif';
  ctx.fillText(`Range: 0 – ${V} V`, panelRight + 95, 84);
  ctx.fillText(`Series Resistance:`, panelRight + 95, 106);
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`Rs = ${series.toFixed(2)} Ω`, panelRight + 95, 128);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.fillText('Formula: Rs = V/Ig - G', panelRight + 95, 150);
  ctx.fillText(`Rs connected in series`, panelRight + 95, 168);
  ctx.fillText(`with galvanometer`, panelRight + 95, 185);

  // Bottom label
  ctx.fillStyle = '#64748b';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Full-scale current: ${(Ig * 1000).toFixed(1)} mA   |   Galvanometer resistance: ${G} Ω`, cx, h - 30);

  return {
    shuntResistance: shunt.toFixed(4),
    seriesResistance: series.toFixed(2),
    fullScaleCurrent_mA: (Ig * 1000).toFixed(1),
    amperemeterRange: I.toFixed(2),
    voltmeterRange: V.toFixed(2)
  };
}

