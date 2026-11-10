// Planos de anteproyecto dibujados por código (SVG puro, sin DOM): sirven en la app y para exportar a /planos.
// Todas las medidas están en metros; S = píxeles por metro.
const S = 50;
const m = (v) => Math.round(v * S * 10) / 10;
const R = (x, y, w, hh, cl = 'fino', rx = 0) => `<rect x="${m(x)}" y="${m(y)}" width="${m(w)}" height="${m(hh)}" rx="${m(rx)}" class="${cl}"/>`;
const L = (x1, y1, x2, y2, cl = 'fino') => `<line x1="${m(x1)}" y1="${m(y1)}" x2="${m(x2)}" y2="${m(y2)}" class="${cl}"/>`;
const C = (x, y, r, cl = 'fino') => `<circle cx="${m(x)}" cy="${m(y)}" r="${m(r)}" class="${cl}"/>`;
const EL = (x, y, rx, ry, cl = 'mob') => `<ellipse cx="${m(x)}" cy="${m(y)}" rx="${m(rx)}" ry="${m(ry)}" class="${cl}"/>`;
const PL = (pts, cl = 'fino', cerrar = false) => `<${cerrar ? 'polygon' : 'polyline'} points="${pts.map((p) => m(p[0]) + ',' + m(p[1])).join(' ')}" class="${cl}"/>`;
const T = (x, y, s, cl = 't', giro = 0) => `<text x="${m(x)}" y="${m(y)}" class="${cl}"${giro ? ` transform="rotate(${giro} ${m(x)} ${m(y)})"` : ''}>${s}</text>`;
const G = (x, y, rot, dentro) => `<g transform="translate(${m(x)} ${m(y)}) rotate(${rot})">${dentro}</g>`;
const rad = (a) => a * Math.PI / 180;
const pc = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
const ARC = (cx, cy, r, a0, a1, cl = 'fino') => { const p = pc(cx, cy, r, a0), q = pc(cx, cy, r, a1); return `<path d="M${m(p[0])} ${m(p[1])}A${m(r)} ${m(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${m(q[0])} ${m(q[1])}" class="${cl}"/>`; };
const dec = (v) => v.toFixed(2).replace('.', ',');

// Cota horizontal o vertical. off = separación de la línea de cota respecto a los puntos medidos.
function cota(x1, y1, x2, y2, off, txt) {
  const hor = Math.abs(y1 - y2) < 1e-6, d = hor ? Math.abs(x2 - x1) : Math.abs(y2 - y1), e = 0.12;
  if (hor) { const y = y1 + off; return L(x1, y1 + Math.sign(off) * 0.1, x1, y + Math.sign(off) * e, 'cota') + L(x2, y1 + Math.sign(off) * 0.1, x2, y + Math.sign(off) * e, 'cota') + L(x1, y, x2, y, 'cota') + L(x1 - e, y + e, x1 + e, y - e, 'cota') + L(x2 - e, y + e, x2 + e, y - e, 'cota') + T((x1 + x2) / 2, y - 0.1, txt || dec(d), 'tc'); }
  const x = x1 + off; return L(x1 + Math.sign(off) * 0.1, y1, x + Math.sign(off) * e, y1, 'cota') + L(x1 + Math.sign(off) * 0.1, y2, x + Math.sign(off) * e, y2, 'cota') + L(x, y1, x, y2, 'cota') + L(x - e, y1 + e, x + e, y1 - e, 'cota') + L(x - e, y2 + e, x + e, y2 - e, 'cota') + T(x - 0.1, (y1 + y2) / 2, txt || dec(d), 'tc', -90);
}
// Mobiliario y sanitarios (origen en el centro, mirando hacia +y salvo giro)
const cama = (x, y, w, l, rot = 0) => G(x, y, rot, R(-w / 2, -l / 2, w, l, 'mob', 0.05) + R(-w / 2 + 0.1, -l / 2 + 0.08, w / 2 - 0.15, 0.4, 'mob', 0.08) + R(0.05, -l / 2 + 0.08, w / 2 - 0.15, 0.4, 'mob', 0.08) + L(-w / 2, -l / 2 + 0.62, w / 2, -l / 2 + 0.62, 'fino'));
const wc = (x, y, rot = 0) => G(x, y, rot, R(-0.2, -0.33, 0.4, 0.18, 'mob', 0.03) + EL(0, 0.08, 0.19, 0.25, 'mob'));
const lav = (x, y, rot = 0, w = 0.55) => G(x, y, rot, R(-w / 2, -0.22, w, 0.44, 'mob', 0.04) + EL(0, 0.02, w / 2 - 0.09, 0.14, 'mob') + C(0, -0.14, 0.025, 'fino'));
const ducha = (x, y, w, hh) => R(x, y, w, hh, 'mob') + L(x, y, x + w, y + hh, 'tabla') + L(x + w, y, x, y + hh, 'tabla') + C(x + w / 2, y + hh / 2, 0.05, 'fino');
const mesa = (x, y, r = 0.4, n = 4) => C(x, y, r, 'mob') + Array.from({ length: n }, (_, i) => { const p = pc(x, y, r + 0.22, i * 360 / n + 45); return C(p[0], p[1], 0.17, 'mob'); }).join('');
const mesa4 = (x, y) => R(x - 0.4, y - 0.4, 0.8, 0.8, 'mob') + [[0, -0.6], [0, 0.6], [-0.6, 0], [0.6, 0]].map((d) => R(x + d[0] - 0.19, y + d[1] - 0.19, 0.38, 0.38, 'mob', 0.08)).join('');
const butaca = (x, y, rot = 0) => G(x, y, rot, R(-0.35, -0.35, 0.7, 0.7, 'mob', 0.12) + R(-0.35, -0.35, 0.7, 0.18, 'mob', 0.06));
const hamaca = (x, y, rot = 0) => G(x, y, rot, R(-0.33, -0.95, 0.66, 1.9, 'mob', 0.1) + L(-0.33, -0.4, 0.33, -0.4, 'fino'));
const caja = (x, y, w, hh, txt, cl = 'mob') => R(x, y, w, hh, cl) + (txt ? T(x + w / 2, y + hh / 2 + 0.07, txt, 'ts') : '');
function tarima(x, y, w, hh, paso = 0.45) { let s = R(x, y, w, hh, 'mad'); for (let yy = y + paso; yy < y + hh - 0.01; yy += paso) s += L(x, yy, x + w, yy, 'tabla'); return s; }
const muros = (x, y, w, hh, t) => R(x, y, w, hh, 'muro') + R(x + t, y + t, w - 2 * t, hh - 2 * t, 'int');
const vano = (x, y, w, hh) => R(x, y, w, hh, 'int');
const tab = (x1, y1, x2, y2) => L(x1, y1, x2, y2, 'tab');
// Puerta abatible: bisagra en (hx,hy), ancho w, hoja abierta en el ángulo aAb y cerrada en aCe (grados, sentido horario desde +x)
function puerta(hx, hy, w, aCe, aAb) { const q = pc(hx, hy, w, aAb); return L(hx, hy, q[0], q[1], 'hoja') + ARC(hx, hy, w, Math.min(aCe, aAb), Math.max(aCe, aAb), 'disc'); }
const zona = (x, y, nombre, sup) => T(x, y, nombre, 'tz') + (sup ? T(x, y + 0.3, sup, 'ts') : '');
const suelo = (x0, x1, y) => L(x0, y, x1, y, 'suelo') + Array.from({ length: Math.floor((x1 - x0) / 0.5) }, (_, i) => L(x0 + i * 0.5 + 0.35, y, x0 + i * 0.5 + 0.1, y + 0.22, 'tabla')).join('');
const persona = (x, y) => C(x, y - 1.62, 0.11, 'fino') + PL([[x, y - 1.5], [x, y - 0.8], [x - 0.18, y], [x, y - 0.8], [x + 0.18, y]], 'fino') + L(x - 0.25, y - 1.25, x + 0.25, y - 1.25, 'fino');
const flecha = (x1, y1, x2, y2, txt) => L(x1, y1, x2, y2, 'flecha') + (txt ? T((x1 + x2) / 2, (y1 + y2) / 2 - 0.12, txt, 'tf') : '');

// Malla geodésica vista de frente (media esfera)
function geoFrente(cx, base, r) {
  const anillos = [[0, 14, 0], [26, 14, 0.5], [50, 7, 0], [72, 7, 0.5], [90, 1, 0]], V = [];
  anillos.forEach(([el, n, des], k) => { V[k] = []; for (let i = 0; i < n; i++) { const az = (i + des) * 2 * Math.PI / n; V[k].push({ x: cx + r * Math.cos(rad(el)) * Math.cos(az), y: base - r * Math.sin(rad(el)), f: Math.sin(az) }); } });
  let s = '';
  const ar = (a, b) => { if (a.f >= -0.02 && b.f >= -0.02) s += L(a.x, a.y, b.x, b.y, 'geo'); };
  V.forEach((an, k) => {
    an.forEach((p, i) => { if (an.length > 1) ar(p, an[(i + 1) % an.length]); });
    const sig = V[k + 1]; if (!sig) return;
    an.forEach((p) => { [...sig].sort((a, b) => Math.hypot(a.x - p.x, a.f - p.f) - Math.hypot(b.x - p.x, b.f - p.f)).slice(0, sig.length === 1 ? 1 : 2).forEach((q) => ar(p, q)); });
  });
  return s;
}

// ------------------------------------------------------------------ CÚPULAS
function domo(suite) {
  const r = suite ? 3.5 : 3, pw = suite ? 9 : 8, pd = suite ? 11 : 9, cx = pw / 2, cy = suite ? 4 : 3.5, f = r / 3, pr = r * 0.42, hc = Math.sqrt(r * r - pr * pr), yp = cy - pr;
  const g0 = cx + r * 0.5, g1 = g0 + 0.75;
  let s = tarima(0, 0, pw, pd) + C(cx, cy, r, 'tela') + C(cx, cy, r - 0.06, 'fino');
  s += ARC(cx, cy, r, 55, 125, 'vid') + ARC(cx, cy, r, 30, 30 + 0.9 / r * 180 / Math.PI, 'corte');
  const b = pc(cx, cy, r, 30); s += puerta(b[0], b[1], 0.9, 120 + 0.9 / r * 90 / Math.PI, 30);
  s += tab(cx - hc, yp, g0, yp) + tab(g1, yp, cx + hc, yp) + puerta(g1, yp, 0.75, 180, 90);
  s += ducha(cx - r * 0.55, cy - r * 0.82, 0.9, r * 0.82 - pr - 0.06) + wc(cx + 0.15, cy - r * 0.83 + 0.33) + lav(cx + 0.85, yp - 0.24, 180);
  s += zona(cx - 0.55, yp - 0.5, 'Baño', suite ? '5,1 m²' : '3,9 m²');
  s += cama(cx, yp + 0.1 + 1.0, 1.8, 2.0) + R(cx - 1.32, yp + 0.12, 0.38, 0.38, 'mob') + R(cx + 0.94, yp + 0.12, 0.38, 0.38, 'mob');
  s += caja(cx + 2.2 * f, cy - 0.3 * f, 0.55, 1.0 * f, '', 'mob') + T(cx + 2.2 * f + 0.27, cy + 0.2 * f, 'Arm.', 'ts', -90);
  if (suite) s += R(cx - 2.95, cy - 0.3, 0.85, 1.9, 'mob', 0.1) + R(cx - 2.95, cy - 0.3, 0.22, 1.9, 'mob', 0.08) + T(cx - 2.4, cy + 0.7, 'Sofá cama', 'ts', -90);
  else s += caja(cx - 2.75, cy - 0.5, 0.5, 1.1, '', 'mob') + T(cx - 2.5, cy + 0.05, 'Office', 'ts', -90);
  s += butaca(cx - 0.75, cy + r * 0.66, 160) + butaca(cx + 0.75, cy + r * 0.66, 200) + C(cx, cy + r * 0.8, 0.25, 'mob');
  s += T(cx, cy + r * 0.38, suite ? 'Dormitorio-estar · 33,4 m²' : 'Dormitorio-estar · 24,4 m²', 'tz') + T(cx, cy + r + 0.32, 'Ventanal panorámico', 'ts');
  s += hamaca(pw - 1.6, pd - 1.25, 0) + hamaca(pw - 0.75, pd - 1.25, 0) + T(cx, pd - 0.3, 'Terraza de tarima', 'ts');
  if (suite) s += C(2.0, pd - 1.8, 1.0, 'agua') + C(2.0, pd - 1.8, 0.8, 'agua') + T(2.0, pd - 1.75, 'Jacuzzi', 'ts');
  else s += mesa(1.6, pd - 1.2, 0.35, 2);
  s += L(cx, cy - r - 0.3, cx, cy + r + 0.15, 'eje') + L(cx - r - 0.3, cy, cx + r + 0.3, cy, 'eje');
  s += cota(0, 0, pw, 0, -0.7) + cota(0, 0, 0, pd, -0.7) + cota(cx - r, pd, cx + r, pd, 0.7, 'Ø ' + dec(2 * r)) + cota(pw, 0, pw, cy + r, 0.7) + cota(pw, cy + r, pw, pd, 0.7);
  // alzado
  const gy = r + 1.1, by = gy - 0.5;
  let a = suelo(-0.6, pw + 0.6, gy) + R(0, by - 0.12, pw, 0.12, 'mad');
  for (let x = 0.3; x < pw; x += 1.48) a += L(x, by, x, gy, 'fino');
  a += `<path d="M${m(cx - r)} ${m(by - 0.12)}A${m(r)} ${m(r)} 0 0 1 ${m(cx + r)} ${m(by - 0.12)}Z" class="tela"/>` + geoFrente(cx, by - 0.12, r);
  a += `<path d="M${m(cx - r * 0.55)} ${m(by - 0.12)}L${m(cx - r * 0.55)} ${m(by - r * 0.62)}A${m(r)} ${m(r)} 0 0 1 ${m(cx + r * 0.55)} ${m(by - r * 0.62)}L${m(cx + r * 0.55)} ${m(by - 0.12)}Z" class="vidrio"/>`;
  a += R(cx + r * 0.62, by - 0.12 - 2.0, 0.85, 2.0, 'mob') + persona(pw - 0.8, by - 0.12);
  a += cota(pw, gy, pw, by - 0.12, 0.6) + cota(pw, by - 0.12, pw, by - 0.12 - r, 1.2) + cota(cx - r, gy, cx + r, gy, 0.6);
  return {
    titulo: suite ? 'Cúpula geodésica suite Ø7 m' : 'Cúpula geodésica Ø6 m', cod: suite ? 'A-02' : 'A-01',
    vistas: [{ nombre: 'Planta', w: pw, h: pd, svg: s }, { nombre: 'Alzado sur', w: pw, h: gy + 0.3, svg: a }],
    specs: [['Superficie interior', suite ? '38,5 m²' : '28,3 m²'], ['Plataforma', `${dec(pw)} × ${dec(pd)} m sobre tornillos de cimentación`], ['Capacidad', suite ? '2 adultos + 2 niños' : '2 personas'], ['Altura libre', dec(r) + ' m'],
      ['Estructura', 'Tubo de acero galvanizado, frecuencia 3V'], ['Cubierta', 'Lona de PVC 850 g/m² ignífuga M2 + aislamiento multicapa'], ['Climatización', 'Bomba de calor aire-aire 2,5 kW + ventilador solar de coronación'], ['Agua caliente', 'Termo eléctrico 50 L (o aerotermia común)']],
    notas: ['Anclaje calculado para viento: la cúpula se atornilla a la plataforma y esta a tornillos de cimentación (reversible, sin hormigón).', 'Toldo o malla de sombreo exterior imprescindible en julio y agosto sobre el ventanal.', suite ? 'Jacuzzi exterior con tapa térmica y tratamiento contra legionela.' : 'Baño completo tras el cabecero: ducha, inodoro y lavabo.'],
  };
}

// ------------------------------------------------------------------ TIENDA BELL
function bell() {
  const cx = 3, cy = 3, r = 2.5;
  let s = tarima(0, 0, 6, 6) + C(cx, cy, r, 'tela');
  for (let i = 0; i < 12; i++) { const p = pc(cx, cy, r, i * 30 + 15); s += L(cx, cy, p[0], p[1], 'tabla'); }
  s += ARC(cx, cy, r, 78, 102, 'corte') + L(cx - 0.52, cy + 2.45, cx - 0.9, cy + 2.95, 'hoja') + L(cx + 0.52, cy + 2.45, cx + 0.9, cy + 2.95, 'hoja');
  s += cama(cx, 1.75, 1.6, 2.0) + R(cx - 1.25, 0.95, 0.38, 0.38, 'mob') + R(cx + 0.87, 0.95, 0.38, 0.38, 'mob');
  s += C(cx, cy, 0.06, 'muro') + C(cx, cy + 0.95, 1.05, 'disc') + T(cx, cy + 1.0, 'Alfombra', 'ts');
  s += butaca(cx - 1.25, cy + 0.9, 135) + butaca(cx + 1.25, cy + 0.9, 225) + caja(cx + 1.55, cy - 0.5, 0.45, 0.9, '') + T(cx + 1.78, cy, 'Baúl', 'ts', -90);
  s += T(cx, cy - 2.2, '19,6 m²', 'ts') + T(cx, 5.75, 'Entrada', 'ts');
  s += cota(0, 0, 6, 0, -0.7) + cota(0, 0, 0, 6, -0.7) + cota(cx - r, 6, cx + r, 6, 0.7, 'Ø 5,00');
  const gy = 4.2, by = gy - 0.3;
  let a = suelo(-0.6, 6.6, gy) + R(0, by - 0.1, 6, 0.1, 'mad');
  for (let x = 0.3; x < 6; x += 1.35) a += L(x, by, x, gy, 'fino');
  a += PL([[cx - r, by - 0.1], [cx - r, by - 0.7], [cx, by - 3.1], [cx + r, by - 0.7], [cx + r, by - 0.1]], 'tela', true) + L(cx - r, by - 0.7, cx + r, by - 0.7, 'fino');
  a += PL([[cx - 0.55, by - 0.1], [cx, by - 1.9], [cx + 0.55, by - 0.1]], 'mob', true) + L(cx - r, by - 0.7, 0.05, by - 0.1, 'fino') + L(cx + r, by - 0.7, 5.95, by - 0.1, 'fino') + persona(5.4, by - 0.1);
  a += cota(6, by - 0.1, 6, by - 3.1, 0.6) + cota(6, gy, 6, by - 0.1, 1.2) + cota(0.5, by - 0.1, 0.5, by - 0.7, -0.9);
  return { titulo: 'Tienda bell Ø5 m', cod: 'A-04', vistas: [{ nombre: 'Planta', w: 6, h: 6, svg: s }, { nombre: 'Alzado', w: 6, h: gy + 0.3, svg: a }],
    specs: [['Superficie interior', '19,6 m²'], ['Plataforma', '6,00 × 6,00 m de tarima'], ['Capacidad', '2 personas'], ['Altura central', '3,00 m'], ['Lona', 'Algodón o polialgodón 360 g/m² con tratamiento ignífugo'], ['Baño', 'En el bloque sanitario, a menos de 40 m'], ['Electricidad', '1 circuito: luz LED, 2 enchufes, ventilador']],
    notas: ['Es la unidad más barata: permite abrir con poca inversión. La lona dura 3-5 temporadas y conviene desmontarla en invierno.', 'En verano necesita sombra (arbolado o malla) y ventilación cruzada; no es apta para aire acondicionado.'] };
}

// ------------------------------------------------------------------ TIENDA SAFARI
function safari() {
  let s = tarima(0, 0, 5.6, 10.2) + R(0.3, 0.3, 5, 7, 'tela');
  s += L(0.3, 2.6, 1.45, 2.6, 'lona') + L(2.2, 2.6, 4.5, 2.6, 'lona') + L(5.2, 2.6, 5.3, 2.6, 'lona') + L(2.4, 0.3, 2.4, 2.6, 'tab');
  s += vano(1.9, 7.22, 1.8, 0.16) + L(1.9, 7.3, 1.5, 7.75, 'hoja') + L(3.7, 7.3, 4.1, 7.75, 'hoja');
  s += ducha(0.38, 0.38, 0.9, 1.2) + wc(1.75, 0.72) + lav(0.62, 2.15, 90) + puerta(1.45, 2.6, 0.75, 0, 90) + zona(1.55, 1.75, 'Baño', '4,8 m²');
  s += cama(3.45, 0.85, 0.9, 1.9, -90) + cama(3.45, 2.05, 0.9, 1.9, -90) + T(4.9, 1.5, 'Dorm. 2', 'tz', -90);
  s += cama(1.3, 4.1, 1.6, 2.0, -90) + R(0.38, 3.0, 0.36, 0.3, 'mob') + R(0.38, 4.9, 0.36, 0.3, 'mob') + T(3.4, 3.9, 'Dormitorio principal', 'tz');
  s += R(4.5, 3.2, 0.78, 1.8, 'mob', 0.1) + R(5.06, 3.2, 0.22, 1.8, 'mob', 0.06) + caja(0.38, 5.5, 0.55, 1.6, '') + T(0.66, 6.3, 'Office', 'ts', -90) + mesa(3.3, 6.1, 0.42, 4) + T(3.3, 5.2, 'Estar-comedor · 35 m² en total', 'ts');
  s += butaca(1.4, 8.6, 180) + butaca(4.2, 8.6, 180) + C(2.8, 8.7, 0.3, 'mob') + T(2.8, 9.75, 'Porche cubierto', 'ts');
  s += R(0, 7.3, 5.6, 2.5, 'disc') + cota(0, 0, 5.6, 0, -0.7) + cota(0, 0, 0, 10.2, -0.7) + cota(5.6, 0.3, 5.6, 7.3, 0.7) + cota(5.6, 7.3, 5.6, 9.8, 0.7) + cota(0.3, 10.2, 5.3, 10.2, 0.7);
  const gy = 4.4, by = gy - 0.4;
  let a = suelo(-0.6, 6.2, gy) + R(0, by - 0.12, 5.6, 0.12, 'mad');
  for (let x = 0.3; x < 5.6; x += 1.25) a += L(x, by, x, gy, 'fino');
  const p = by - 0.12;
  a += PL([[0.3, p], [0.3, p - 1.9], [2.8, p - 3.2], [5.3, p - 1.9], [5.3, p]], 'tela', true) + PL([[-0.05, p - 1.75], [2.8, p - 3.3], [5.65, p - 1.75]], 'hoja');
  a += R(1.9, p - 1.9, 1.8, 1.9, 'mob') + L(2.8, p - 1.9, 2.8, p, 'fino') + L(0.3, p - 1.9, 5.3, p - 1.9, 'fino') + R(0.25, p - 1.9, 0.1, 1.9, 'mad') + R(5.25, p - 1.9, 0.1, 1.9, 'mad') + persona(4.5, p);
  a += cota(5.6, p, 5.6, p - 1.9, 0.6) + cota(5.6, p, 5.6, p - 3.2, 1.2) + cota(0.3, gy, 5.3, gy, 0.6);
  return { titulo: 'Tienda safari familiar 5×7 m', cod: 'A-03', vistas: [{ nombre: 'Planta', w: 5.6, h: 10.2, svg: s }, { nombre: 'Alzado frontal', w: 5.6, h: gy + 0.3, svg: a }],
    specs: [['Superficie interior', '35,0 m² + 12,5 m² de porche'], ['Plataforma', '5,60 × 10,20 m'], ['Capacidad', '2 adultos + 2 niños'], ['Altura', '1,90 m en alero · 3,20 m en cumbrera'], ['Estructura', 'Madera laminada o acero, doble techo ventilado'], ['Lona', 'Polialgodón 450 g/m² + sobretecho de PVC 650 g/m², ignífugos'], ['Baño', 'Completo, en módulo rígido interior'], ['Climatización', 'Ventilador de techo y estufa; opcional split 2,5 kW']],
    notas: ['El doble techo ventilado baja varios grados la temperatura interior en verano.', 'Las divisiones interiores son de lona con cremallera, salvo el baño, que es un módulo rígido impermeable.'] };
}

// ------------------------------------------------------------------ CABAÑA
function cabana() {
  const t = 0.12;
  let s = tarima(0, 3.6, 6, 1.8) + muros(0, 0, 6, 3.6, t);
  s += tab(4.1, t, 4.1, 1.15) + tab(4.1, 1.9, 4.1, 2.25) + tab(4.1, 2.25, 6 - t, 2.25) + puerta(4.1, 1.9, 0.75, 270, 180);
  s += ducha(5.0, t, 0.88, 0.9) + wc(5.62, 1.6, 90) + lav(4.5, 0.36, 0) + zona(4.75, 1.45, 'Baño', '3,7 m²');
  s += caja(4.2, 2.86, 1.68, 0.6, 'Cocina') + C(4.6, 3.16, 0.14, 'fino') + R(5.2, 2.96, 0.5, 0.4, 'fino');
  s += cama(1.14, 1.6, 1.6, 2.0, -90) + R(t + 0.02, 0.38, 0.36, 0.36, 'mob') + R(t + 0.02, 2.46, 0.36, 0.36, 'mob') + caja(2.4, t, 1.3, 0.58, 'Armario');
  s += mesa(3.2, 2.2, 0.38, 2) + T(2.3, 3.2, 'Estar-dormitorio · 16,2 m²', 'tz');
  s += vano(2.6, 3.6 - t, 0.9, t) + puerta(2.6, 3.6, 0.9, 0, 90) + R(0.5, 3.6 - t, 1.6, t, 'vidrio') + R(0, 1.0, t, 1.2, 'vidrio') + R(4.4, 0, 0.5, t, 'vidrio');
  s += butaca(1.2, 4.6, 180) + butaca(4.6, 4.6, 180) + C(2.9, 4.7, 0.28, 'mob') + T(3, 5.25, 'Porche', 'ts');
  s += cota(0, 0, 6, 0, -0.7) + cota(0, 0, 0, 3.6, -0.7) + cota(0, 3.6, 0, 5.4, -0.7) + cota(4.1, 3.6, 6, 3.6, 0.35) ;
  const gy = 4.0, by = gy - 0.35;
  let a = suelo(-0.6, 6.2, gy) + R(0, by - 0.12, 5.4, 0.12, 'mad');
  for (let x = 0.3; x < 5.4; x += 1.2) a += L(x, by, x, gy, 'fino');
  const p = by - 0.12;
  a += PL([[0, p], [0, p - 2.3], [3.6, p - 2.85], [3.6, p]], 'mad', true) + PL([[-0.3, p - 2.4], [5.5, p - 3.28], [5.5, p - 3.16], [-0.3, p - 2.28]], 'muro', true);
  for (let y = p - 0.3; y > p - 2.3; y -= 0.3) a += L(0, y, 3.6, y, 'tabla');
  a += R(5.2, p - 3.1, 0.12, 3.1, 'mad') + R(1.2, p - 2.0, 1.2, 1.1, 'vidrio') + persona(4.4, p) + T(1.8, p + 0.75, 'Cuerpo cerrado', 'ts') + T(4.5, p + 0.75, 'Porche', 'ts');
  a += cota(0, p, 0, p - 2.3, -0.6) + cota(5.4, p, 5.4, p - 3.1, 0.7) + cota(0, gy, 3.6, gy, 1.0) + cota(3.6, gy, 5.4, gy, 1.0);
  return { titulo: 'Cabaña de madera 6,0×3,6 m', cod: 'A-05', vistas: [{ nombre: 'Planta', w: 6, h: 5.4, svg: s }, { nombre: 'Alzado lateral', w: 5.4, h: gy + 0.3, svg: a }],
    specs: [['Superficie construida', '21,6 m² + 10,8 m² de porche'], ['Capacidad', '2 personas'], ['Altura', '2,30 m a 2,85 m (cubierta a un agua)'], ['Cerramiento', 'Entramado ligero de madera con 10 cm de aislamiento'], ['Cimentación', 'Tornillos de cimentación, sin hormigón'], ['Climatización', 'Split 2,5 kW frío-calor'], ['Uso', 'Las 4 estaciones: es la unidad que sostiene el invierno']],
    notas: ['Prefabricada en taller y montada en 2-3 días; cuenta como edificación a efectos urbanísticos.', 'Cubierta preparada para 2 paneles solares y recogida de pluviales.'] };
}

// ------------------------------------------------------------------ BLOQUE SANITARIO
function sanitarios() {
  const t = 0.15;
  let s = R(-0.1, -0.9, 9.2, 0.9, 'disc') + muros(0, 0, 9, 4.2, t) + tab(3.2, t, 3.2, 4.05) + tab(6.4, t, 6.4, 4.05) + tab(6.4, 1.5, 8.85, 1.5);
  const aseo = (x0, nombre) => {
    let g = tab(x0 + 0.95, t, x0 + 0.95, 1.6) + tab(x0 + 1.9, t, x0 + 1.9, 1.6);
    g += tab(x0, 1.6, x0 + 0.2, 1.6) + tab(x0 + 0.85, 1.6, x0 + 1.15, 1.6) + tab(x0 + 1.8, 1.6, x0 + 2.1, 1.6) + tab(x0 + 2.85, 1.6, x0 + 3.05, 1.6);
    g += puerta(x0 + 0.2, 1.6, 0.65, 0, 90) + puerta(x0 + 1.15, 1.6, 0.65, 0, 90) + puerta(x0 + 2.1, 1.6, 0.75, 0, 90);
    g += wc(x0 + 0.475, 0.55) + wc(x0 + 1.425, 0.55) + ducha(x0 + 1.98, 0.2, 1.0, 1.32);
    g += tab(x0 + 2.0, 2.55, x0 + 2.0, 3.3) + tab(x0 + 2.0, 3.3, x0 + 3.05, 3.3) + ducha(x0 + 2.08, 2.2, 0.92, 1.05);
    g += lav(x0 + 0.3, 2.3, 90) + lav(x0 + 0.3, 3.1, 90) + vano(x0 + 0.9, 4.05, 0.8, t) + puerta(x0 + 0.9, 4.05, 0.8, 0, -90) + zona(x0 + 1.2, 2.75, nombre, '11,9 m²');
    return g;
  };
  s += aseo(0.15, 'Aseo A') + aseo(3.3, 'Aseo B');
  s += ducha(6.5, 1.6, 0.95, 0.95) + wc(8.5, 2.1, 90) + L(8.05, 1.62, 8.05, 2.45, 'hoja') + lav(6.72, 3.4, 90) + C(7.65, 3.0, 0.75, 'disc') + T(7.65, 3.05, 'Ø1,50', 'ts') + zona(7.6, 3.75, 'Adaptado', '');
  s += vano(7.1, 4.05, 0.9, t) + puerta(7.1, 4.2, 0.9, 0, 90) + caja(6.6, 0.3, 0.6, 0.6, 'ACS') + caja(7.3, 0.3, 0.6, 0.6, 'ACS') + T(8.3, 0.9, 'Técnico', 'ts') + vano(8.85, 0.5, t, 0.8);
  s += caja(0.8, -0.65, 2.0, 0.55, 'Fregaderos de vajilla') + caja(3.6, -0.65, 1.8, 0.55, 'Lavadero') + caja(6.2, -0.65, 1.4, 0.55, 'Lavadora') + T(4.5, -1.0, 'Alero de 0,90 m', 'ts');
  s += cota(0, 4.2, 9, 4.2, 0.9) + cota(0, 0, 0, 4.2, -0.7) + cota(0, 4.2, 3.2, 4.2, 0.4) + cota(3.2, 4.2, 6.4, 4.2, 0.4) + cota(6.4, 4.2, 9, 4.2, 0.4);
  const gy = 3.7;
  let a = suelo(-0.6, 9.6, gy) + R(0, gy - 2.5, 9, 2.5, 'int') + R(0, gy - 2.5, 9, 2.5, 'fino') + PL([[-0.4, gy - 2.5], [9.4, gy - 2.5], [9.4, gy - 2.95], [-0.4, gy - 2.95]], 'muro', true);
  for (const [x, w, n] of [[1.05, 0.8, 'A'], [4.2, 0.8, 'B'], [7.1, 0.9, 'PMR']]) a += R(x, gy - 2.05, w, 2.05, 'mad') + T(x + w / 2, gy - 1.1, n, 'tz');
  for (const x of [0.3, 2.2, 3.5, 5.4]) a += R(x, gy - 2.25, 0.6, 0.35, 'vidrio');
  for (let x = 1; x < 8; x += 1.2) a += PL([[x, gy - 2.97], [x + 1.0, gy - 2.97], [x + 1.0, gy - 3.32], [x, gy - 3.12]], 'panel', true);
  a += persona(8.5, gy) + cota(9, gy, 9, gy - 2.5, 0.8) + cota(0, gy, 9, gy, 0.6) + T(4.5, gy - 3.45, 'Captadores solares de agua caliente', 'ts');
  return { titulo: 'Bloque sanitario 9,0×4,2 m', cod: 'S-01', vistas: [{ nombre: 'Planta', w: 9, h: 4.2, svg: s }, { nombre: 'Alzado sur', w: 9, h: gy + 0.3, svg: a }],
    specs: [['Superficie', '37,8 m² construidos'], ['Dotación', '4 inodoros, 4 duchas, 4 lavabos + aseo adaptado con ducha'], ['Exterior', 'Fregaderos de vajilla, lavadero y lavadora de monedas'], ['Agua caliente', 'Solar térmica con apoyo de aerotermia, acumulador 500 L'], ['Construcción', 'Módulo prefabricado o panel sándwich sobre losa'], ['Accesibilidad', 'Itinerario sin escalones, giro Ø1,50 m y barras de apoyo']],
    notas: ['Da servicio a las tiendas sin baño, a los usuarios de la piscina y a visitantes del día.', 'Ventilación cruzada alta, suelos antideslizantes con pendiente a sumidero y grifería temporizada para ahorrar agua.'] };
}

// ------------------------------------------------------------------ RESTAURANTE
function restaurante() {
  const t = 0.2;
  let s = tarima(0, 8, 14, 6, 0.6) + muros(0, 0, 14, 8, t);
  s += tab(6, t, 6, 1.0) + tab(6, 2.2, 6, 3.3) + tab(6, 4.2, 6, 5.5) + tab(6, 6.4, 6, 7.8) + L(6, 1.0, 6, 2.2, 'vid');
  s += tab(t, 4.6, 6, 4.6) + tab(2.2, t, 2.2, 1.0) + tab(2.2, 1.85, 2.2, 3.1) + tab(2.2, 3.85, 2.2, 4.6) + tab(t, 2.6, 2.2, 2.6) + tab(3, 4.6, 3, 7.8) + tab(4.9, 4.6, 4.9, 5.1) + tab(4.9, 6.0, 4.9, 6.75) + tab(4.9, 7.45, 4.9, 7.8) + tab(3, 6.5, 4.9, 6.5);
  s += puerta(2.2, 1.0, 0.85, 90, 0) + puerta(2.2, 3.85, 0.75, 270, 180) + puerta(6, 3.3, 0.9, 90, 0) + puerta(6, 5.5, 0.9, 90, 0) + puerta(4.9, 5.1, 0.9, 90, 180) + puerta(4.9, 6.75, 0.7, 90, 180);
  s += vano(0, 1.0, t, 0.9) + puerta(0, 1.0, 0.9, 90, 180) + vano(1.0, 8 - t, 1.0, t) + puerta(1.0, 8, 1.0, 0, 90);
  // cocina
  s += caja(2.4, 0.25, 2.7, 0.75, 'Cocción') + R(2.3, 0.22, 2.9, 1.0, 'disc') + T(3.75, 1.4, 'campana', 'ts') + caja(5.2, 0.25, 0.7, 0.75, 'Horno') + caja(3.2, 2.0, 1.7, 0.75, 'Preparación') + caja(2.3, 3.95, 2.2, 0.6, 'Lavado') + caja(4.6, 3.95, 0.7, 0.6, 'Frío') + zona(4.1, 3.2, 'Cocina', '16,7 m²');
  s += caja(0.3, 0.3, 0.5, 2.2, '') + caja(1.1, 0.3, 1.0, 0.6, 'Cámara') + zona(1.3, 1.8, 'Almacén', '4,8 m²') + lav(0.5, 2.95, 90, 0.45) + wc(1.8, 3.1, 90) + caja(0.3, 3.9, 1.0, 0.6, 'Taquillas') + zona(1.25, 3.6, 'Personal', '');
  s += caja(0.35, 4.75, 2.4, 0.55, 'Tienda de producto local') + caja(0.5, 6.2, 1.8, 0.6, 'Mostrador') + zona(1.6, 5.8, 'Recepción', '9,0 m²');
  s += wc(3.55, 4.95) + lav(4.5, 4.9, 0, 0.45) + C(3.95, 5.65, 0.75, 'disc') + wc(3.4, 7.2, 90) + lav(4.4, 7.55, 180, 0.45) + lav(5.45, 4.9, 0) + zona(5.45, 7.2, 'Aseos', '');
  // sala
  s += R(6.9, 0.5, 0.55, 3.9, 'mob') + T(7.18, 2.5, 'Barra', 'tz', -90) + caja(6.1, 2.3, 0.45, 0.9, '');
  for (const y of [1.4, 3.4, 5.4]) for (const x of [8.9, 10.7, 12.5]) s += mesa4(x, y);
  s += mesa(7.4, 6.6, 0.35, 2) + zona(10.7, 7.0, 'Sala · 59 m² · 38 plazas', '') + R(7.0, 8 - t, 6.4, t, 'vidrio') + vano(9.5, 8 - t, 1.6, t) + L(9.5, 8, 9.5, 8.75, 'hoja') + L(11.1, 8, 11.1, 8.75, 'hoja');
  for (const y of [9.8, 12.3]) for (const x of [1.6, 4.3, 7, 9.7, 12.4]) s += mesa4(x, y);
  for (const x of [0.15, 3.6, 7, 10.4, 13.85]) for (const y of [8.15, 11, 13.85]) s += R(x - 0.1, y - 0.1, 0.2, 0.2, 'muro');
  s += zona(7, 11.15, 'Terraza bajo pérgola · 84 m² · 40 plazas', '');
  s += flecha(-1.0, 1.45, 0.9, 1.45, '1 mercancía') + flecha(1.5, 1.45, 3.0, 1.75, '2') + flecha(4.2, 1.5, 5.9, 1.6, '3') + flecha(6.2, 1.6, 8.0, 1.6, '4 pase') + flecha(7.8, 3.75, 5.0, 3.75, '5 retorno');
  s += cota(0, 0, 14, 0, -0.7) + cota(0, 0, 0, 8, -1.3) + cota(0, 8, 0, 14, -1.3) + cota(0, 0, 6, 0, -0.3) + cota(6, 0, 14, 0, -0.3);
  const gy = 4.4;
  let a = suelo(-0.6, 14.6, gy) + R(0, gy - 3.2, 14, 3.2, 'int') + R(0, gy - 3.2, 14, 3.2, 'fino') + R(-0.2, gy - 3.6, 14.4, 0.4, 'muro');
  a += R(7.0, gy - 2.6, 6.4, 2.6, 'vidrio') + [8.6, 9.5, 11.1, 12.0].map((x) => L(x, gy - 2.6, x, gy, 'fino')).join('') + R(1.0, gy - 2.1, 1.0, 2.1, 'mad') + R(2.6, gy - 2.1, 2.6, 1.2, 'vidrio');
  for (const x of [0.15, 3.6, 7, 10.4, 13.85]) a += R(x - 0.08, gy - 2.8, 0.16, 2.8, 'mad');
  a += R(-0.1, gy - 2.95, 14.2, 0.15, 'mad');
  for (let x = 1; x < 13; x += 1.7) a += PL([[x, gy - 3.62], [x + 1.5, gy - 3.62], [x + 1.5, gy - 4.05], [x, gy - 3.78]], 'panel', true);
  a += persona(5.6, gy) + cota(14, gy, 14, gy - 3.6, 0.7) + cota(0, gy, 14, gy, 0.6) + T(4.5, gy - 3.0 - 0.1, 'Pérgola de madera (en primer plano)', 'ts');
  return { titulo: 'Restaurante, recepción y terraza', cod: 'S-02', vistas: [{ nombre: 'Planta', w: 14, h: 14, svg: s }, { nombre: 'Alzado sur', w: 14, h: gy + 0.3, svg: a }],
    specs: [['Superficie construida', '112 m² + 84 m² de terraza'], ['Aforo', '38 plazas en sala + 40 en terraza'], ['Cocina', '16,7 m² con circuito de marcha adelante'], ['Recepción', '9 m² con tienda de producto local'], ['Aseos', '1 adaptado + 1 estándar + lavabos'], ['Construcción', 'Entramado de madera o modular, cubierta plana con fotovoltaica'], ['Cocción', 'Gas propano y horno mixto; extracción con filtros']],
    notas: ['Circuito higiénico: 1 recepción de mercancía → 2 almacén y cámara → 3 preparación y cocción → 4 pase a sala → 5 retorno de sucio a lavado, sin cruces.', 'La terraza mira al sur y a la piscina; la pérgola lleva cañizo o lamas y nebulización para el verano.', 'Abierto al público externo: es la segunda fuente de ingresos y alarga la temporada.'] };
}

// ------------------------------------------------------------------ QUIOSCO
function kiosco() {
  const t = 0.08;
  let s = tarima(0, 2.4, 6, 5, 0.5) + muros(0, 0, 6, 2.4, t) + tab(4.6, t, 4.6, 2.32);
  s += R(0.6, 2.32, 3.4, t, 'vidrio') + R(0.5, 2.4, 3.6, 0.4, 'mob') + T(2.3, 2.68, 'Barra exterior', 'ts');
  s += caja(0.15, 0.12, 1.9, 0.6, 'Plancha y freidora') + caja(2.15, 0.12, 1.0, 0.6, 'Fregadero') + caja(3.25, 0.12, 1.25, 0.6, 'Neveras') + caja(0.7, 1.7, 2.6, 0.55, 'Cafetera y caja') + zona(2.3, 1.3, 'Bar · 10,4 m²', '');
  s += vano(0, 0.9, t, 0.85) + puerta(0, 0.9, 0.85, 90, 180) + R(4.9, 2.32, 0.8, t, 'vidrio') + caja(4.75, 0.15, 1.1, 0.5, 'Llaves') + zona(5.28, 1.4, 'Recepción', '') + vano(5.92, 0.9, t, 0.8) + puerta(6, 0.9, 0.8, 90, 0);
  for (const [x, y] of [[1.4, 4.2], [4.4, 4.2], [1.4, 6.3], [4.4, 6.3]]) s += mesa4(x, y);
  for (const x of [0.12, 5.88]) for (const y of [2.6, 7.28]) s += R(x - 0.08, y - 0.08, 0.16, 0.16, 'muro');
  s += T(3, 5.3, 'Pérgola · 30 m² · 16 plazas', 'tz') + cota(0, 0, 6, 0, -0.7) + cota(0, 0, 0, 2.4, -0.7) + cota(0, 2.4, 0, 7.4, -0.7);
  const gy = 3.6;
  let a = suelo(-0.6, 6.6, gy) + R(0, gy - 2.6, 6, 2.6, 'int') + R(0, gy - 2.6, 6, 2.6, 'fino');
  for (let x = 0.25; x < 6; x += 0.25) a += L(x, gy - 2.6, x, gy - 2.25, 'tabla');
  a += R(0.6, gy - 2.1, 3.4, 1.1, 'vidrio') + R(0.5, gy - 1.05, 3.6, 0.08, 'mad') + R(4.9, gy - 2.1, 0.8, 1.1, 'vidrio') + R(0.04, gy - 2.6, 0.14, 2.6, 'mad') + R(5.82, gy - 2.6, 0.14, 2.6, 'mad') + R(-0.2, gy - 2.78, 6.4, 0.16, 'mad') + persona(4.4, gy);
  a += cota(6, gy, 6, gy - 2.6, 0.7) + cota(0, gy, 6, gy, 0.6);
  return { titulo: 'Quiosco-bar y recepción (fase 1)', cod: 'S-03', vistas: [{ nombre: 'Planta', w: 6, h: 7.4, svg: s }, { nombre: 'Alzado sur', w: 6, h: gy + 0.3, svg: a }],
    specs: [['Superficie', '14,4 m² de módulo + 30 m² de pérgola'], ['Aforo', '16 plazas sentadas'], ['Oferta', 'Desayunos, bocadillos, tapas, plancha y bebidas'], ['Construcción', 'Contenedor marítimo de 20 pies adaptado o módulo de madera'], ['Recepción', 'Ventanilla propia con armario de llaves y cobro'], ['Después', 'En la fase 2 pasa a ser el bar de la piscina']],
    notas: ['Es la forma más barata de tener restauración y recepción legales desde el primer día.', 'Sin cocina de humos complejos: plancha y freidora con campana compacta.'] };
}

// ------------------------------------------------------------------ PISCINA
function piscina() {
  let s = R(0, 0, 16, 9, 'playa') + R(0, 0, 16, 9, 'valla') + R(2, 2, 12, 5, 'agua', 0.15) + R(2.25, 2.25, 11.5, 4.5, 'aguaInt', 0.1);
  for (let i = 0; i < 4; i++) s += L(2 + i * 0.3, 3.2, 2 + i * 0.3, 5.8, 'fino');
  s += T(3.7, 4.6, 'Prof. 1,10', 'ts') + T(12.4, 4.6, 'Prof. 1,60', 'ts') + T(8, 4.4, 'Lámina de agua 60 m²', 'tz') + T(8, 4.75, 'Aforo: 30 bañistas', 'ts') + L(8, 2.25, 8, 6.75, 'disc');
  for (let x = 3; x <= 13; x += 2) s += hamaca(x, 0.95, 0);
  s += C(6.3, 8.2, 0.3, 'mob') + C(9.7, 8.2, 0.3, 'mob') + T(8, 8.0, 'Duchas', 'ts') + vano(7.4, 8.9, 1.2, 0.2) + puerta(7.4, 9, 1.2, 0, -90) + T(8, 9.45, 'Puerta con cierre automático', 'ts');
  s += caja(14.2, 0.2, 1.6, 1.6, 'Depuración') + C(1.0, 4.5, 0.35, 'mob') + T(1.0, 5.2, 'Socorrista', 'ts') + C(15.2, 7.9, 0.28, 'fino') + T(15.2, 8.5, 'Aro', 'ts') + caja(0.3, 7.7, 1.2, 0.9, 'Botiquín');
  s += cota(0, 0, 16, 0, -0.7) + cota(0, 0, 0, 9, -0.7) + cota(2, 7, 14, 7, 0.45) + cota(14, 2, 14, 7, 0.5);
  const gy = 1.2;
  let a = suelo(-0.6, 2, gy) + suelo(14, 16.6, gy) + PL([[2, gy], [2, gy + 1.25], [8, gy + 1.25], [14, gy + 1.75], [14, gy]], 'aguaSec', true) + PL([[1.75, gy], [1.75, gy + 1.5], [8, gy + 1.5], [14.25, gy + 2.0], [14.25, gy]], 'hoja');
  a += L(2, gy + 0.15, 14, gy + 0.15, 'vid') + R(0, gy - 1.2, 0.05, 1.2, 'muro') + R(15.95, gy - 1.2, 0.05, 1.2, 'muro') + persona(1, gy);
  a += cota(2, gy + 0.15, 2, gy + 1.25, -0.6, '1,10') + cota(14, gy + 0.15, 14, gy + 1.75, 0.8, '1,60') + cota(2, gy + 2.0, 14, gy + 2.0, 0.4) + T(0.5, gy - 1.35, 'Vallado 1,20 m', 'ts');
  return { titulo: 'Piscina de uso colectivo 12×5 m', cod: 'O-01', vistas: [{ nombre: 'Planta', w: 16, h: 9, svg: s }, { nombre: 'Sección longitudinal', w: 16, h: gy + 2.6, svg: a }],
    specs: [['Vaso', '12,00 × 5,00 m · 60 m² de lámina · 81 m³'], ['Profundidad', '1,10 m a 1,60 m'], ['Aforo', '30 bañistas (1 por cada 2 m² de lámina)'], ['Recinto', '16 × 9 m vallado a 1,20 m con puerta de cierre automático'], ['Depuración', 'Filtro de arena o vidrio, cloración salina, recirculación en 4 h'], ['Seguridad', 'Socorrista en horario de baño, aro, botiquín, duchas de acceso']],
    notas: ['Piscina de uso colectivo: exige control diario del agua, libro de registro y analíticas periódicas.', 'Cloración salina y cubierta de invierno para reducir químicos, evaporación y coste.', 'Alternativa de menor coste para empezar: vaso prefabricado de poliéster de 8×4 m.'] };
}

export const PLANOS = { domo6: () => domo(false), domo7: () => domo(true), safari, bell, cabana, sanitarios, restaurante, kiosco, piscina };
export const ORDEN_PLANOS = ['domo6', 'domo7', 'safari', 'bell', 'cabana', 'sanitarios', 'restaurante', 'kiosco', 'piscina'];

const ESTILO = `.muro{fill:#3b3a35;stroke:none}.int{fill:#fff;stroke:none}.tab{stroke:#3b3a35;stroke-width:5;fill:none;stroke-linecap:square}.fino{fill:none;stroke:#222;stroke-width:1}
.mob{fill:#fff;stroke:#555;stroke-width:1}.mad{fill:#eadcbf;stroke:#8a7a55;stroke-width:1}.tabla{stroke:#bfae84;stroke-width:.6;fill:none}.tela{fill:#faf6ea;stroke:#222;stroke-width:2.2}
.lona{stroke:#222;stroke-width:2;stroke-dasharray:9 4;fill:none}.agua{fill:#bfe1ef;stroke:#3b89a8;stroke-width:1.2}.aguaInt{fill:#d9eef6;stroke:#8cc3d8;stroke-width:.8}.aguaSec{fill:#cfe8f3;stroke:none}
.vid{stroke:#2f8fb5;stroke-width:4;fill:none}.vidrio{fill:#cfe8f3;stroke:#2f8fb5;stroke-width:1}.corte{stroke:#fff;stroke-width:6;fill:none}.hoja{stroke:#222;stroke-width:1.6;fill:none}
.eje{stroke:#999;stroke-width:.7;stroke-dasharray:10 3 2 3;fill:none}.disc{stroke:#777;stroke-width:.8;stroke-dasharray:5 4;fill:none}.geo{stroke:#6b6b60;stroke-width:.8}
.cota{stroke:#b3472a;stroke-width:.8;fill:none}.tc{font:11px Arial,sans-serif;fill:#b3472a;text-anchor:middle}.t{font:11px Arial,sans-serif;fill:#222;text-anchor:middle}
.tz{font:bold 11.5px Arial,sans-serif;fill:#222;text-anchor:middle}.ts{font:9.5px Arial,sans-serif;fill:#555;text-anchor:middle}.tf{font:bold 9.5px Arial,sans-serif;fill:#bd5d3a;text-anchor:middle}
.suelo{stroke:#222;stroke-width:2}.playa{fill:#efe6d2;stroke:none}.valla{fill:none;stroke:#444;stroke-width:1.6;stroke-dasharray:14 4}.panel{fill:#27456b;stroke:#16304f;stroke-width:1}
.flecha{stroke:#bd5d3a;stroke-width:1.8;fill:none;marker-end:url(#fl)}.marco{fill:none;stroke:#222;stroke-width:1.5}.h1{font:bold 16px Arial,sans-serif;fill:#222}.h2{font:11px Arial,sans-serif;fill:#444}.vt{font:bold 12px Arial,sans-serif;fill:#222;letter-spacing:1px}`;

/** Lámina completa (marco, vistas, escala gráfica, norte y cajetín) como SVG independiente. */
export function lamina(tipo, proyecto = 'Glamping Maestrat', fecha = '') {
  const p = PLANOS[tipo](), M = 1.7, sep = 2.4;
  const apilar = p.vistas[0].w > 11;
  const [v1, v2] = p.vistas;
  const anchoM = apilar ? Math.max(v1.w, v2.w) + 2 * M : v1.w + v2.w + 2 * M + sep;
  const altoM = (apilar ? v1.h + v2.h + sep + 0.6 : Math.max(v1.h, v2.h)) + 2 * M + 2.6;
  const W = m(anchoM), H = m(altoM);
  const x2 = apilar ? M : M + v1.w + sep, y2 = apilar ? M + v1.h + sep + 0.6 : M + Math.max(0, (v1.h - v2.h));
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial,sans-serif"><style>${ESTILO}</style>`;
  s += `<defs><marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#bd5d3a"/></marker></defs>`;
  s += `<rect width="${W}" height="${H}" fill="#fff"/><rect x="8" y="8" width="${W - 16}" height="${H - 16}" class="marco"/>`;
  s += `<g transform="translate(${m(M)} ${m(M)})">${v1.svg}</g><text x="${m(M)}" y="${m(M - 1.15)}" class="vt">${v1.nombre.toUpperCase()}</text>`;
  s += `<g transform="translate(${m(x2)} ${m(y2)})">${v2.svg}</g><text x="${m(x2)}" y="${m(y2 - (apilar ? 0.5 : 1.15))}" class="vt">${v2.nombre.toUpperCase()}</text>`;
  const cy = H - m(1.9);
  s += `<line x1="8" y1="${cy}" x2="${W - 8}" y2="${cy}" class="marco"/><text x="24" y="${cy + 30}" class="h1">${p.cod} · ${p.titulo}</text><text x="24" y="${cy + 50}" class="h2">${proyecto} · Anteproyecto · Cotas en metros${fecha ? ' · ' + fecha : ''}</text><text x="24" y="${cy + 68}" class="h2">Documento de trabajo: requiere proyecto firmado por técnico competente para su tramitación.</text>`;
  const ex = W - m(6.4), ey = cy + 34;
  s += `<g transform="translate(${ex} ${ey})">` + [0, 1, 2, 3, 4].map((i) => `<rect x="${m(i)}" y="0" width="${m(1)}" height="7" fill="${i % 2 ? '#fff' : '#222'}" stroke="#222"/><text x="${m(i)}" y="22" class="ts">${i}</text>`).join('') + `<text x="${m(5)}" y="22" class="ts">5 m</text><text x="${m(2.5)}" y="-8" class="ts">Escala gráfica</text></g>`;
  s += `<g transform="translate(${W - 46} ${cy + 46})"><circle r="20" class="fino"/><path d="M0 -17L6 8L0 3L-6 8z" fill="#222"/><text y="-23" class="ts">N</text></g>`;
  return { svg: s + '</svg>', ...p };
}
