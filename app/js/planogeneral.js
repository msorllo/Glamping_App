// Plano general de la parcela en SVG puro (unidades = metros). Lo usan la vista editable y el exportador.
import { CATALOGO } from './datos.js';
import { caja, alVial, arboles, cumplimiento } from './calculo.js';

const f = (v) => Math.round(v * 100) / 100;
const r_ = (x, y, w, h, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${extra}/>`;
const l_ = (x1, y1, x2, y2, extra = '') => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" ${extra}/>`;
const c_ = (x, y, r, extra = '') => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" ${extra}/>`;
const MAD = 'fill="#e2cfa4" stroke="#8a7a55" stroke-width=".12"', LIN = 'stroke="#55503f" stroke-width=".1" fill="none"', TELA = 'fill="#fbf7ea" stroke="#3b3a35" stroke-width=".18"';
const lamas = (x, y, w, h, paso = 0.8) => { let s = ''; for (let xx = x + paso; xx < x + w; xx += paso) s += l_(xx, y, xx, y + h, 'stroke="#a8946a" stroke-width=".1"'); return s; };

/** Símbolo en planta de cada tipo, centrado en el origen y con el frente hacia +y (sur). */
export function simbolo(tipo) {
  const k = CATALOGO[tipo], w = k.w, d = k.d, x = -w / 2, y = -d / 2;
  switch (tipo) {
    case 'domo6': case 'domo7': {
      const r = tipo === 'domo6' ? 3 : 3.5, cy = y + (tipo === 'domo6' ? 3.5 : 4);
      let s = r_(x, y, w, d, MAD) + c_(0, cy, r, TELA);
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.26, b = a + Math.PI / 3; s += l_(0, cy, r * Math.cos(a), cy + r * Math.sin(a), LIN) + l_(r * 0.55 * Math.cos(a), cy + r * 0.55 * Math.sin(a), r * 0.55 * Math.cos(b), cy + r * 0.55 * Math.sin(b), LIN); }
      s += `<path d="M${f(-r * 0.57)} ${f(cy + r * 0.82)}A${r} ${r} 0 0 0 ${f(r * 0.57)} ${f(cy + r * 0.82)}" stroke="#2f8fb5" stroke-width=".35" fill="none"/>`;
      if (tipo === 'domo7') s += c_(x + 2, y + d - 1.8, 1, 'fill="#9fd3e6" stroke="#3b89a8" stroke-width=".12"');
      return s;
    }
    case 'bell': { let s = r_(x, y, w, d, MAD) + c_(0, 0, 2.5, TELA); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; s += l_(0, 0, 2.5 * Math.cos(a), 2.5 * Math.sin(a), LIN); } return s + c_(0, 0, 0.18, 'fill="#3b3a35"'); }
    case 'parcela': return r_(x, y, w, d, 'fill="#cfd8a8" stroke="#6f8a45" stroke-width=".35" stroke-dasharray="1.2 .5" rx=".6"') + r_(x + 1.2, y + 1.5, 2.3, 5.2, 'fill="#f3efe2" stroke="#8a8478" stroke-width=".1" rx=".4"') + c_(x + 5.6, y + 6.5, 1.5, 'fill="#e9dcb8" stroke="#8a7a55" stroke-width=".1"') + c_(x + w - 0.7, y + 0.7, 0.3, 'fill="#d69a2d"');
    case 'safari': return r_(x, y, w, d, MAD) + r_(x + 0.3, y + 0.3, 5, 7, 'fill="#e9dcb8" stroke="#3b3a35" stroke-width=".18"') + l_(0, y + 0.3, 0, y + 7.3, LIN) + r_(x + 0.05, y + 7.3, 5.5, 2.5, 'fill="none" stroke="#3b3a35" stroke-width=".1" stroke-dasharray=".5 .3"');
    case 'cabana': return r_(x, y + 3.6, w, 1.8, MAD) + r_(x, y, w, 3.6, 'fill="#b98f5c" stroke="#3b3a35" stroke-width=".18"') + lamas(x, y, w, 3.6, 0.6);
    case 'kiosco': return r_(x, y + 2.4, w, 5, MAD) + lamas(x, y + 2.4, w, 5) + r_(x, y, w, 2.4, 'fill="#a9764a" stroke="#3b3a35" stroke-width=".18"');
    case 'restaurante': { let s = r_(x, y + 8, w, 6, MAD) + lamas(x, y + 8, w, 6, 1) + r_(x, y, w, 8, 'fill="#c9b9a0" stroke="#3b3a35" stroke-width=".25"'); for (let i = 0; i < 6; i++) s += r_(x + 1 + i * 2.1, y + 1, 1.7, 3, 'fill="#27456b" stroke="#16304f" stroke-width=".08"'); return s; }
    case 'sanitarios': return r_(x, y, w, d, 'fill="#d9d2c0" stroke="#3b3a35" stroke-width=".2"') + l_(x, 0, x + w, 0, LIN) + l_(x + 3.2, y, x + 3.2, y + d, LIN) + l_(x + 6.4, y, x + 6.4, y + d, LIN);
    case 'piscina': return r_(x, y, w, d, 'fill="#efe6d2" stroke="#555" stroke-width=".12" stroke-dasharray=".8 .3"') + r_(x + 2, y + 2, 12, 5, 'fill="#7cc3de" stroke="#2f7f9a" stroke-width=".2" rx=".3"') + r_(x + 2.4, y + 2.4, 11.2, 4.2, 'fill="#a9daec" rx=".2"');
    case 'spa': return r_(x, y, w, d, MAD) + c_(x + 1.8, y + 1.9, 1.1, 'fill="#9fd3e6" stroke="#3b89a8" stroke-width=".12"') + c_(x + 1.8, y + 4.4, 1.1, 'fill="#9fd3e6" stroke="#3b89a8" stroke-width=".12"') + r_(x + 4.4, y + 1.2, 2.4, 3.6, 'fill="#b98f5c" stroke="#3b3a35" stroke-width=".15" rx="1"');
    case 'eventos': return r_(x, y, w, d, 'fill="#f3ecd9" stroke="#3b3a35" stroke-width=".18"') + lamas(x, y, w, d, 1.5) + l_(x, y, x + w, y + d, LIN) + l_(x + w, y, x, y + d, LIN);
    case 'mirador': return r_(x, y, w, d, MAD) + c_(0, 0, 2, 'fill="none" stroke="#55503f" stroke-width=".12" stroke-dasharray=".4 .3"') + `<path d="M0 -1.3L.35 -.4L1.3 -.4L.55 .2L.85 1.1L0 .55L-.85 1.1L-.55 .2L-1.3 -.4L-.35 -.4z" fill="#d69a2d"/>`;
    case 'yoga': return r_(x, y, w, d, MAD) + lamas(x, y, w, d, 0.5);
    case 'juegos': return r_(x, y, w, d, 'fill="#ecd9a0" stroke="#a8946a" stroke-width=".12" rx="1"') + c_(-1.5, -1, 1.2, 'fill="#d98c4a"') + c_(1.8, 1.4, 0.9, 'fill="#6f9a52"') + r_(-3, 1.5, 2.4, 0.5, 'fill="#bd5d3a"');
    case 'huerto': { let s = r_(x, y, w, d, 'fill="#c9d8a2" stroke="#6f8a45" stroke-width=".12"'); for (let i = 0; i < 5; i++) s += r_(x + 0.6, y + 0.6 + i * 1.45, w - 1.2, 0.9, 'fill="#8fae5c"'); return s; }
    case 'parking': { let s = r_(x, y, w, d, 'fill="#d9d3c4" stroke="#8a8478" stroke-width=".12"'); for (let i = 0; i <= 10; i++) s += l_(x + i * 2.5, y, x + i * 2.5, y + 5, 'stroke="#fff" stroke-width=".15"'); return s; }
    case 'solar': { let s = r_(x, y, w, d, 'fill="#27456b" stroke="#16304f" stroke-width=".12" opacity=".92"'); for (let i = 1; i < 10; i++) s += l_(x + i * 1.25, y, x + i * 1.25, y + d, 'stroke="#6f8fb5" stroke-width=".06"'); return s + l_(x, 0, x + w, 0, 'stroke="#6f8fb5" stroke-width=".06"'); }
    case 'tecnico': return r_(x, y, w, d, 'fill="#aaa493" stroke="#3b3a35" stroke-width=".18"') + `<path d="M-.3 -1L.4 -.1H-.1L.3 1L-.5 0H0z" fill="#d69a2d"/>`;
    case 'deposito': return c_(0, 0, 1.8, 'fill="#9fc4d4" stroke="#2f7f9a" stroke-width=".18"') + c_(0, 0, 0.4, 'fill="none" stroke="#2f7f9a" stroke-width=".1"');
    case 'pozo': return c_(0, 0, 1, 'fill="#5d8597" stroke="#2c4a57" stroke-width=".18"') + c_(0, 0, 0.45, 'fill="#1c3340"');
    case 'depuradora': { let s = r_(x, y, 6, 3, 'fill="#bfb9a8" stroke="#3b3a35" stroke-width=".12" stroke-dasharray=".5 .3"') + r_(x, y + 3.6, w, 4.4, 'fill="#a9c58a" stroke="#5f8a45" stroke-width=".12" rx=".6"'); for (let i = 0; i < 9; i++) s += l_(x + 0.8 + i * 1.05, y + 4.1, x + 0.8 + i * 1.05, y + 7.5, 'stroke="#5f8a45" stroke-width=".12"'); return s; }
    case 'residuos': return r_(x, y, w, d, 'fill="#b8b2a4" stroke="#3b3a35" stroke-width=".15"') + [0, 1, 2].map((i) => r_(x + 0.4 + i * 1.5, y + 0.6, 1.1, 1.6, `fill="${['#d6b23a', '#3f7fb5', '#5f8a45'][i]}"`)).join('');
    default: return r_(x, y, w, d, `fill="${k.color}" stroke="#3b3a35" stroke-width=".15"`);
  }
}

export const CAPAS = [
  ['etiquetas', 'Nombres', '#26281f'], ['arboles', 'Arbolado', '#7d9a55'], ['fases', 'Colorear por fase', '#bd5d3a'], ['cotas', 'Cotas y retranqueo', '#b3472a'],
  ['elec', 'Red eléctrica', '#d69a2d'], ['agua', 'Agua potable', '#2f7f9a'], ['saneo', 'Saneamiento', '#7a5a3a'], ['fuego', 'Incendios y evacuación', '#c0392b'], ['wifi', 'Wifi', '#7a4fb5'],
];
const USA_AGUA = ['domo6', 'domo7', 'safari', 'cabana', 'sanitarios', 'kiosco', 'restaurante', 'piscina', 'spa'];
const COLOR_FASE = { 1: '#4c8a4a', 2: '#d69a2d', 3: '#bd5d3a' };
const CORTO = { parcela: 'Parcela', domo6: 'Cúpula', domo7: 'Suite', safari: 'Safari', bell: 'Bell', cabana: 'Cabaña', kiosco: 'Bar', restaurante: 'Restaurante', sanitarios: 'Aseos', piscina: 'Piscina', spa: 'Spa', eventos: 'Eventos', mirador: 'Mirador', yoga: 'Yoga', juegos: 'Juegos', huerto: 'Huerto', parking: 'Parking', solar: 'Solar', tecnico: 'Técnico', deposito: 'Depósito', pozo: 'Pozo', depuradora: 'Depuradora', residuos: 'Residuos' };

function red(E, els, color, desv, consumidores, fuente) {
  let s = '';
  for (const v of E.viales) s += `<polyline points="${v.pts.map((p) => f(p[0] + desv) + ',' + f(p[1] + desv)).join(' ')}" fill="none" stroke="${color}" stroke-width=".45" stroke-linejoin="round" class="flujo-red"/>`;
  for (const e of els.filter(consumidores)) { const p = alVial(E, e.x, e.y); s += l_(e.x, e.y, p.x + desv, p.y + desv, `stroke="${color}" stroke-width=".3" stroke-dasharray=".9 .5"`) + c_(e.x, e.y, 0.5, `fill="${color}"`); }
  for (const e of els.filter(fuente)) { const p = alVial(E, e.x, e.y); s += l_(e.x, e.y, p.x + desv, p.y + desv, `stroke="${color}" stroke-width=".7"`) + r_(e.x - 0.9, e.y - 0.9, 1.8, 1.8, `fill="${color}" stroke="#fff" stroke-width=".15"`); }
  return s;
}

/** Devuelve el contenido SVG (sin etiqueta <svg>) y el viewBox del plano general. */
export function svgPlano(E, n, capas = {}, sel = null) {
  const p = E.parcela, els = E.elementos.filter((e) => e.fase <= n), M = 9;
  let s = `<rect x="${-M}" y="${-M}" width="${p.ancho + 2 * M}" height="${p.fondo + 2 * M + 4}" fill="#e9e3d0"/>`;
  s += r_(-M, p.fondo + 1.5, p.ancho + 2 * M, 5, 'fill="#d3c8ad"') + `<text x="${p.ancho / 2 + 14}" y="${p.fondo + 5}" font-size="2.2" fill="#6d6f60">Camino público de acceso</text>`;
  s += r_(0, 0, p.ancho, p.fondo, 'fill="#dfe3c4" stroke="#3b3a35" stroke-width=".35"');
  if (capas.cotas) s += r_(p.retranqueo, p.retranqueo, p.ancho - 2 * p.retranqueo, p.fondo - 2 * p.retranqueo, 'fill="none" stroke="#b3472a" stroke-width=".15" stroke-dasharray="1.2 .8"');
  if (capas.fuego) s += `<path d="M0 0H${p.ancho}V${p.fondo}H0zM${p.retranqueo} ${p.retranqueo}V${p.fondo - p.retranqueo}H${p.ancho - p.retranqueo}V${p.retranqueo}z" fill="#c0392b" fill-opacity=".13"/>`;
  for (const v of E.viales) s += `<polyline points="${v.pts.map((q) => q.join(',')).join(' ')}" fill="none" stroke="#f1e9d2" stroke-width="${v.ancho}" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${v.pts.map((q) => q.join(',')).join(' ')}" fill="none" stroke="#cdbf9c" stroke-width=".12" stroke-dasharray="1.5 1"/>`;
  if (capas.arboles) for (const a of arboles(E, n)) s += c_(a.x, a.y, a.r, `fill="${a.tipo === 'olivo' ? '#9bb07a' : '#6f8f5a'}" fill-opacity=".8" stroke="#55703f" stroke-width=".1"`) + c_(a.x, a.y, 0.25, 'fill="#55503f"');
  if (capas.wifi) for (const e of els.filter((x) => ['kiosco', 'restaurante', 'sanitarios', 'mirador', 'eventos', 'spa'].includes(x.tipo))) s += c_(e.x, e.y, 32, 'fill="#7a4fb5" fill-opacity=".07" stroke="#7a4fb5" stroke-width=".15" stroke-dasharray="1 .8"');
  const orden = { instalacion: 0, ocio: 1, servicio: 2, alojamiento: 3 };
  for (const e of [...els].sort((a, b) => (a.tipo === 'solar') - (b.tipo === 'solar') || orden[CATALOGO[a.tipo].grupo] - orden[CATALOGO[b.tipo].grupo])) {
    const b = caja(E, e);
    s += `<g class="el" data-id="${e.id}" transform="translate(${f(e.x)} ${f(e.y)}) rotate(${e.rot || 0})" style="cursor:grab">${simbolo(e.tipo)}`;
    if (capas.fases) s += r_(-CATALOGO[e.tipo].w / 2, -CATALOGO[e.tipo].d / 2, CATALOGO[e.tipo].w, CATALOGO[e.tipo].d, `fill="${COLOR_FASE[e.fase]}" fill-opacity=".38" stroke="${COLOR_FASE[e.fase]}" stroke-width=".25"`);
    s += '</g>';
    if (sel === e.id) s += r_(b.x0 - 0.6, b.y0 - 0.6, b.w + 1.2, b.d + 1.2, 'fill="none" stroke="#bd5d3a" stroke-width=".35" stroke-dasharray="1 .6" pointer-events="none"');
  }
  if (capas.elec) s += red(E, els, '#d69a2d', -0.7, (e) => CATALOGO[e.tipo].kwh > 0 || CATALOGO[e.tipo].kwp, (e) => e.tipo === 'tecnico');
  if (capas.agua) { s += red(E, els, '#2f7f9a', 0, (e) => USA_AGUA.includes(e.tipo) || e.tipo === 'huerto', (e) => e.tipo === 'deposito'); const pz = els.find((e) => e.tipo === 'pozo'), dp = els.find((e) => e.tipo === 'deposito'); if (pz && dp) s += l_(pz.x, pz.y, dp.x, dp.y, 'stroke="#2f7f9a" stroke-width=".7"'); }
  if (capas.saneo) s += red(E, els, '#7a5a3a', 0.7, (e) => USA_AGUA.includes(e.tipo) && e.tipo !== 'piscina', (e) => e.tipo === 'depuradora');
  if (capas.fuego) {
    for (const e of els.filter((x) => ['alojamiento', 'servicio'].includes(CATALOGO[x.tipo].grupo) || x.tipo === 'tecnico' || x.tipo === 'eventos')) { const b = caja(E, e); s += r_(b.x1 - 0.2, b.y0 - 0.9, 1.1, 1.1, 'fill="#c0392b" stroke="#fff" stroke-width=".12" rx=".2"'); }
    const nodos = new Map(); for (const v of E.viales) for (const q of v.pts) nodos.set(q.join(','), q);
    for (const q of [...nodos.values()].filter((_, i) => i % 2 === 0)) s += c_(q[0], q[1], 25, 'fill="none" stroke="#c0392b" stroke-width=".18" stroke-dasharray="1.4 1"') + c_(q[0], q[1], 0.9, 'fill="#fff" stroke="#c0392b" stroke-width=".3"') + `<text x="${q[0]}" y="${q[1] + 0.55}" font-size="1.5" text-anchor="middle" fill="#c0392b" font-weight="700">H</text>`;
    const acc = E.viales[0].pts[0]; s += c_(acc[0] - 9, acc[1] - 6, 2.2, 'fill="#4c8a4a" stroke="#fff" stroke-width=".25"') + `<text x="${acc[0] - 9}" y="${acc[1] - 5.3}" font-size="1.8" text-anchor="middle" fill="#fff" font-weight="700">PR</text>`;
    for (const v of E.viales.slice(1, 4)) { const a = v.pts[v.pts.length - 1], z = v.pts[0]; const mx = (a[0] + z[0]) / 2, my = (a[1] + z[1]) / 2, an = Math.atan2(z[1] - a[1], z[0] - a[0]) * 180 / Math.PI; s += `<path d="M-2.5 0H1.5M.6 -.9L1.8 0L.6 .9" transform="translate(${f(mx)} ${f(my)}) rotate(${f(an)})" stroke="#4c8a4a" stroke-width=".45" fill="none"/>`; }
  }
  if (capas.etiquetas) for (const e of els) { if (e.tipo === 'solar') continue; const b = caja(E, e); s += `<text x="${f(e.x)}" y="${f(b.y1 + 2.1)}" font-size="1.9" text-anchor="middle" fill="#26281f" paint-order="stroke" stroke="#f5f0e6" stroke-width=".5" pointer-events="none">${e.nombre || CORTO[e.tipo]}</text>`; }
  if (capas.cotas) {
    const ct = 'stroke="#b3472a" stroke-width=".15"', tx = 'font-size="2.2" fill="#b3472a" text-anchor="middle"';
    s += l_(0, -4, p.ancho, -4, ct) + l_(0, -5, 0, -3, ct) + l_(p.ancho, -5, p.ancho, -3, ct) + `<text x="${p.ancho / 2}" y="-5" ${tx}>${p.ancho.toFixed(2).replace('.', ',')} m</text>`;
    s += l_(-4, 0, -4, p.fondo, ct) + l_(-5, 0, -3, 0, ct) + l_(-5, p.fondo, -3, p.fondo, ct) + `<text x="-5" y="${p.fondo / 2}" ${tx} transform="rotate(-90 -5 ${p.fondo / 2})">${p.fondo.toFixed(2).replace('.', ',')} m</text>`;
  }
  // entrada, norte y escala
  const acc = E.viales[0].pts[0];
  s += `<path d="M${acc[0]} ${p.fondo + 5.5}v-3.2m-1.3 1.4l1.3 -1.6l1.3 1.6" stroke="#bd5d3a" stroke-width=".5" fill="none"/><text x="${acc[0] + 2.5}" y="${p.fondo + 5}" font-size="2.2" fill="#bd5d3a" font-weight="700">ENTRADA</text>`;
  s += `<g transform="translate(${p.ancho + 3.5} 5)"><circle r="3" fill="#fff" stroke="#3b3a35" stroke-width=".2"/><path d="M0 -2.5L.9 1.2L0 .5L-.9 1.2z" fill="#3b3a35"/><text y="-3.6" font-size="2" text-anchor="middle">N</text></g>`;
  s += `<g transform="translate(4 ${p.fondo + 3.2})">${[0, 1, 2, 3].map((i) => `<rect x="${i * 10}" y="0" width="10" height=".8" fill="${i % 2 ? '#fff' : '#3b3a35'}" stroke="#3b3a35" stroke-width=".1"/>`).join('')}<text x="0" y="2.9" font-size="1.8">0</text><text x="20" y="2.9" font-size="1.8" text-anchor="middle">20</text><text x="40" y="2.9" font-size="1.8" text-anchor="middle">40 m</text></g>`;
  return { svg: s, viewBox: [-M, -M, p.ancho + 2 * M, p.fondo + 2 * M + 4] };
}

/** Plano general completo como archivo SVG independiente. */
export function laminaGeneral(E, n, capas, titulo) {
  const { svg, viewBox: v } = svgPlano(E, n, capas), q = cumplimiento(E, n);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${v[0]} ${v[1]} ${v[2]} ${v[3] + 9}" width="${v[2] * 8}" height="${(v[3] + 9) * 8}" font-family="Arial,sans-serif"><style>.flujo-red{}</style>${svg}<rect x="${v[0]}" y="${v[1] + v[3]}" width="${v[2]}" height="9" fill="#fff" stroke="#3b3a35" stroke-width=".25"/><text x="${v[0] + 3}" y="${v[1] + v[3] + 4}" font-size="3" font-weight="700">${titulo}</text><text x="${v[0] + 3}" y="${v[1] + v[3] + 7.3}" font-size="2">Parcela modelo de ${(q.sup / 10000).toFixed(2).replace('.', ',')} ha · ${q.uds} unidades fijas · ${q.libres} parcelas de acampada · ${q.plazas} plazas · ocupación ${(q.ocup * 100).toFixed(1).replace('.', ',')} % · Anteproyecto, cotas en metros</text></svg>`;
}
