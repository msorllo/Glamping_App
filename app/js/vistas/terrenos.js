import { E, guardar } from '../estado.js';
import { h, num, eur, tabla, campo, esc } from '../ui.js';

const W = 450, H = 488, X = (lon) => (lon - 0.03) / 0.53 * W, Y = (lat) => (40.66 - lat) / 0.44 * H;
const linea = (pts) => pts.map(([lo, la]) => X(lo).toFixed(1) + ',' + Y(la).toFixed(1)).join(' ');
const COSTA = [[0.275, 40.22], [0.295, 40.25], [0.34, 40.30], [0.385, 40.335], [0.403, 40.352], [0.412, 40.357], [0.404, 40.366], [0.425, 40.40], [0.44, 40.42], [0.465, 40.455], [0.482, 40.472], [0.50, 40.50], [0.515, 40.523], [0.53, 40.55], [0.56, 40.60]];
const VIAS = [['AP-7 / N-340', [[0.20, 40.22], [0.245, 40.30], [0.30, 40.345], [0.37, 40.39], [0.41, 40.425], [0.455, 40.475], [0.49, 40.53], [0.52, 40.60]]], ['N-232', [[0.455, 40.475], [0.335, 40.505], [0.29, 40.52], [0.25, 40.515], [0.16, 40.52], [0.03, 40.60]]], ['CV-10', [[0.03, 40.33], [0.17, 40.42], [0.18, 40.465], [0.25, 40.515]]]];

export const notaPrecio = (p) => Math.max(1, Math.min(5, 5 - (p - 1) * 0.8));
export function puntos(t) { const w = E.pesos, s = w.precio + w.acceso + w.atractivo + w.suministros + w.urbanismo + w.riesgo || 1; return (w.precio * notaPrecio(t.precio) + w.acceso * t.acceso + w.atractivo * t.atractivo + w.suministros * t.suministros + w.urbanismo * t.urbanismo + w.riesgo * t.riesgo) / s * 20; }
const color = (p) => p >= 70 ? '#4c8a4a' : p >= 60 ? '#8aa04a' : p >= 50 ? '#d69a2d' : '#bd5d3a';

export default function (raiz) {
  const mapa = h('div', { class: 'lienzo' }), podio = h('div');
  const pinta = () => {
    const orden = [...E.terrenos].sort((a, b) => puntos(b) - puntos(a));
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial,sans-serif"><rect width="${W}" height="${H}" fill="#e6e2c8"/>`;
    s += `<polygon points="${linea([...COSTA, [0.56, 40.22]])}" fill="#bcdcea"/><polyline points="${linea(COSTA)}" fill="none" stroke="#6aa9c4" stroke-width="1.5"/>`;
    s += `<ellipse cx="${X(0.34)}" cy="${Y(40.325)}" rx="34" ry="13" transform="rotate(-38 ${X(0.34)} ${Y(40.325)})" fill="#9db27a" opacity=".6"/><text x="${X(0.345)}" y="${Y(40.31)}" font-size="9" fill="#4d6a35" text-anchor="middle">Serra d'Irta</text>`;
    s += `<ellipse cx="${X(0.13)}" cy="${Y(40.635)}" rx="48" ry="18" fill="#9db27a" opacity=".5"/><text x="${X(0.13)}" y="${Y(40.63)}" font-size="9" fill="#4d6a35" text-anchor="middle">Tinença de Benifassà</text>`;
    for (const [nom, pts] of VIAS) { s += `<polyline points="${linea(pts)}" fill="none" stroke="#fff" stroke-width="4"/><polyline points="${linea(pts)}" fill="none" stroke="#b9a88a" stroke-width="1.6"/>`; const m = pts[Math.floor(pts.length / 2)]; s += `<text x="${X(m[0]) + 6}" y="${Y(m[1]) - 5}" font-size="8.5" fill="#8a7a55">${nom}</text>`; }
    for (const km of [10, 20, 30]) s += `<circle cx="${X(0.4273)}" cy="${Y(40.4167)}" r="${km * 10}" fill="none" stroke="#bd5d3a" stroke-width=".7" stroke-dasharray="4 4" opacity=".6"/><text x="${X(0.4273) - km * 7.1}" y="${Y(40.4167) - km * 7.1}" font-size="8" fill="#bd5d3a">${km} km</text>`;
    for (const t of E.terrenos) { const p = puntos(t), x = X(t.lon), y = Y(t.lat), izq = t.lon > 0.38 || t.muni.startsWith('Santa'); s += `<circle cx="${x}" cy="${y}" r="${5 + p / 12}" fill="${color(p)}" fill-opacity=".85" stroke="#fff" stroke-width="1.5"><title>${esc(t.muni)} · ${num(p)} puntos</title></circle><text x="${x + (izq ? -12 : 12)}" y="${y + 3.5}" font-size="10" text-anchor="${izq ? 'end' : 'start'}" fill="#26281f" paint-order="stroke" stroke="#e6e2c8" stroke-width="3">${esc(t.muni)}${t.despob ? ' ●' : ''}</text>`; }
    s += `<text x="${X(0.50)}" y="${Y(40.30)}" font-size="13" fill="#4f8fa8" font-style="italic" text-anchor="middle">Mar Mediterráneo</text><text x="8" y="${H - 8}" font-size="8.5" fill="#6d6f60">Mapa esquemático · ● posible exención de DIC por municipio rural (confirmar)</text></svg>`;
    mapa.innerHTML = s;
    podio.replaceChildren(h('h3', {}, 'Clasificación con tus pesos'), h('ol', { style: 'padding-left:20px;margin:0' }, orden.slice(0, 6).map((t) => h('li', { style: 'margin-bottom:6px' }, h('b', {}, t.muni), ` · ${num(puntos(t))} puntos · ${num(t.precio, 1)} €/m² · ${t.min} min`, h('br'), h('span', { class: 'suave', style: 'font-size:12.5px' }, t.nota)))));
  };
  const cambia = () => { guardar('terrenos'); pinta(); };
  const n15 = [1, 2, 3, 4, 5];
  raiz.append(
    h('div', { class: 'nota' }, 'El terreno decide el proyecto. Antes de enamorarse de una finca hay que confirmar en el ayuntamiento que el uso de camping es compatible y que tiene agua. Los precios y notas de esta tabla son orientativos: cámbialos con lo que veas en cada visita.'),
    h('div', { class: 'lado' }, mapa, h('div', { class: 'rejilla' },
      h('div', { class: 'tarjeta' }, podio),
      h('div', { class: 'tarjeta' }, h('h3', {}, 'Qué pesa más para vosotros'), ['precio', 'acceso', 'atractivo', 'suministros', 'urbanismo', 'riesgo'].map((k) => campo({ precio: 'Precio del suelo', acceso: 'Acceso y cercanía', atractivo: 'Atractivo turístico', suministros: 'Agua y luz', urbanismo: 'Facilidad urbanística', riesgo: 'Bajo riesgo (fuego, agua)' }[k], E.pesos, k, cambia))))),
    h('div', { class: 'tarjeta', style: 'margin-top:14px' }, h('h2', {}, 'Comparador de municipios'), h('p', { class: 'suave' }, 'Notas de 1 (peor) a 5 (mejor). La nota de precio se calcula sola a partir de los €/m².'),
      tabla({ filas: E.terrenos, alCambiar: cambia, nueva: () => ({ muni: 'Nueva zona', lat: 40.45, lon: 0.3, precio: 2, min: 20, playa: 20, despob: false, acceso: 3, atractivo: 3, suministros: 3, urbanismo: 3, riesgo: 3, nota: '' }),
        cols: [{ k: 'muni', t: 'Municipio', w: 150 }, { k: 'precio', t: '€/m²', tipo: 'num', w: 70 }, { k: 'min', t: 'Min a Benicarló', tipo: 'num', w: 70 }, { k: 'playa', t: 'Min a playa', tipo: 'num', w: 70 }, { k: 'despob', t: 'Sin DIC (confirmar)', tipo: 'chk' },
          ...[['acceso', 'Acceso'], ['atractivo', 'Atractivo'], ['suministros', 'Agua/luz'], ['urbanismo', 'Urbanismo'], ['riesgo', 'Riesgo']].map(([k, t]) => ({ k, t, tipo: 'sel', ops: n15, num: true, w: 62 })),
          { t: 'Puntos', tipo: 'ver', n: true, ver: (f) => h('b', {}, num(puntos(f))) }, { k: 'nota', t: 'Observaciones', w: 300 }] })),
    h('div', { class: 'rejilla c2', style: 'margin-top:14px' },
      h('div', { class: 'tarjeta' }, h('h3', {}, 'Qué mirar en cada finca'), h('ul', { style: 'padding-left:18px;margin:0' }, ['Superficie de 1,5 a 3 hectáreas en una sola pieza, con forma regular.', 'Acceso por camino público por el que pasen camiones y bomberos (4 m de ancho).', 'Agua: pozo legalizado, toma de riego o red a menos de 300 m.', 'Luz: línea cercana, o asumir instalación aislada con placas.', 'Fuera de zona inundable, de barrancos y de la franja litoral protegida.', 'A más de 500 m de monte arbolado, o con espacio para franja de seguridad.', 'Arbolado adulto (olivos, algarrobos): sombra y paisaje desde el primer día.', 'Vistas, silencio y cielo oscuro; sin granjas, carreteras ni naves cerca.', 'Pendiente suave: permite saneamiento por gravedad y unidades con vistas.', 'Sin cargas, servidumbres ni vías pecuarias que la crucen.'].map((t) => h('li', { style: 'margin-bottom:4px' }, t)))),
      h('div', { class: 'tarjeta' }, h('h3', {}, 'Comprar, alquilar o cesión'),
        h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Fórmula'), h('th', {}, 'A favor'), h('th', {}, 'En contra'))), h('tbody', {},
          [['Compra', 'Seguridad total; el banco la acepta como garantía; se revaloriza con la licencia.', `Inmoviliza capital: ${eur(E.eco.terreno.m2 * E.eco.terreno.precioM2)} con los datos actuales.`],
            ['Alquiler largo', 'Casi sin desembolso inicial; ideal para probar la fase 1.', 'Exige contrato de 20-25 años inscrito y permiso expreso del dueño para tramitar y construir.'],
            ['Derecho de superficie', 'Como un alquiler, pero con derecho real inscribible y financiable.', 'Notaría y negociación más complejas; al final revierte al dueño.'],
            ['Socio que aporta la finca', 'Cero coste de suelo; alinea intereses.', 'Se comparte la propiedad del negocio; pacto de socios imprescindible.']].map((f) => h('tr', {}, f.map((c, i) => h('td', { style: i ? 'font-size:12.5px' : 'font-weight:600' }, c)))))),
        h('h3', { style: 'margin-top:14px' }, 'Herramientas gratuitas'), h('ul', { style: 'padding-left:18px;margin:0' },
          [['Visor cartográfico de la Generalitat (inundabilidad, forestal, litoral, clasificación del suelo)', 'https://visor.gva.es/visor/'], ['Sede del Catastro (superficie, linderos, referencia)', 'https://www.sedecatastro.gob.es/'], ['PVGIS (producción solar en un punto)', 'https://re.jrc.ec.europa.eu/pvg_tools/es/']].map(([t, u]) => h('li', {}, h('a', { href: u, target: '_blank', rel: 'noopener' }, t)))))));
  pinta();
}
