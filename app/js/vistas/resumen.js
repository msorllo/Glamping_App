import { E, guardar, nEsc, NOMBRE_ESC } from '../estado.js';
import { h, eur, num, pct, kpi } from '../ui.js';
import { explotacion, cumplimiento, equilibrio } from '../calculo.js';
import { svgPlano } from '../planogeneral.js';

export default function (raiz) {
  const n = nEsc(), x = explotacion(E, n), q = cumplimiento(E, n), eq = equilibrio(E, n);
  const plano = svgPlano(E, n, { arboles: true, fases: true });
  const fase = (i, titulo, texto) => { const r = explotacion(E, i); return h('div', { class: 'tarjeta', style: i === n ? 'border-color:var(--oliva);box-shadow:0 0 0 2px #dbe7cf' : '' },
    h('span', { class: 'etq f' + i }, 'Fase ' + i), h('h3', { style: 'margin-top:6px' }, titulo), h('p', {}, texto),
    h('table', {}, h('tbody', {}, [['Alojamientos y plazas', `${r.unidades} · ${r.plazas}`], ['Inversión acumulada', eur(r.capex.total)], ['Ingresos (año 3)', eur(r.neto)], ['Resultado de explotación', eur(r.ebitda)]].map(([a, b]) => h('tr', {}, h('td', { class: 'suave' }, a), h('td', { class: 'n' }, b))))),
    h('button', { class: 'b mini', style: 'margin-top:8px', onclick: () => { E.escenario = ['minimo', 'medio', 'completo'][i - 1]; guardar('escenario'); location.reload(); } }, i === n ? 'Escenario activo' : 'Ver este escenario')); };
  raiz.append(
    h('div', { class: 'tarjeta', style: 'margin-bottom:14px' },
      h('div', { class: 'campo', style: 'grid-template-columns:auto 1fr;max-width:520px' }, h('label', {}, 'Nombre del proyecto'), h('input', { type: 'text', value: E.nombre, oninput: (e) => { E.nombre = e.target.value; document.getElementById('nombreProyecto').textContent = E.nombre; guardar('nombre'); } })),
      h('p', { style: 'margin-top:8px' }, 'Glamping de cúpulas, tiendas y cabañas en el Baix Maestrat, a menos de 30 minutos de Benicarló, que se abre por fases: primero lo mínimo para empezar a facturar, y lo demás se construye con lo que el propio negocio genera.')),
    h('div', { class: 'rejilla c4' },
      kpi('Inversión · ' + NOMBRE_ESC[n].toLowerCase(), eur(x.capex.total)), kpi('Alojamientos y plazas', `${x.unidades} · ${x.plazas}`, `${q.uds} unidades y ${q.libres} parcelas en ${num(q.sup / 10000, 1)} ha`),
      kpi('Resultado de explotación (año 3)', eur(x.ebitda), `margen ${pct(x.margen)}`, x.ebitda > 0 ? 'ok' : 'mal'), kpi('Ocupación de equilibrio', eq ? pct(eq) : 'No llega', `prevista ${pct(x.ocupacion)}`, eq && eq < x.ocupacion ? 'ok' : 'mal')),
    h('h2', { style: 'margin:20px 0 10px' }, 'El plan en tres fases'),
    h('div', { class: 'rejilla c3' },
      fase(1, 'Abrir con lo mínimo', '4 tiendas bell, 2 cúpulas y 4 parcelas de acampada, bloque sanitario, quiosco-bar con recepción, placas solares, agua y depuradora.'),
      fase(2, 'Hacerlo rentable', 'Más cúpulas y tiendas safari, restaurante abierto al público y piscina. Aquí el negocio empieza a dar beneficio de verdad.'),
      fase(3, 'Completarlo', 'Suites, cabañas para invierno, spa, zona de eventos y yoga. Sube el precio medio y se alarga la temporada.')),
    h('div', { class: 'lado', style: 'margin-top:14px' },
      h('div', { class: 'lienzo' }, h('div', { html: `<svg viewBox="${plano.viewBox.join(' ')}" xmlns="http://www.w3.org/2000/svg">${plano.svg}</svg>` })),
      h('div', { class: 'rejilla' },
        h('div', { class: 'tarjeta' }, h('h3', {}, 'Lo que hay que saber antes de nada'), h('ul', { style: 'padding-left:18px;margin:0' },
          ['El permiso urbanístico manda: sin uso compatible no hay glamping, por barata que sea la finca.', 'La tramitación en suelo rústico puede llevar entre 1 y 2 años. Ese tiempo se usa para financiar, diseñar y construir marca.', 'El agua es el segundo filtro: pozo legal o red cercana.', 'Con solo 6 unidades el negocio paga gastos pero no sueldos completos: la fase 1 es para aprender y llegar a la 2.', 'Julio y agosto se llenan solos. El dinero está en llenar primavera, otoño y fines de semana.'].map((t) => h('li', { style: 'margin-bottom:5px' }, t)))),
        h('div', { class: 'tarjeta' }, h('h3', {}, 'Próximos pasos'), h('ol', { style: 'padding-left:20px;margin:0' }, E.tareas.filter((t) => t.col < 2).slice(0, 6).map((t) => h('li', { style: 'margin-bottom:4px' }, t.t))), h('a', { href: '#organizacion', style: 'font-size:13px' }, 'Abrir el tablero de tareas')),
        h('div', { class: 'tarjeta' }, h('h3', {}, 'Leyenda del plano'), [1, 2, 3].map((i) => h('span', { class: 'etq f' + i, style: 'margin-right:6px' }, `Fase ${i}`)), h('p', { class: 'suave', style: 'margin-top:8px' }, 'El plano editable está en «Plano general» y su versión en volumen en «Vista 3D».')))));
}
