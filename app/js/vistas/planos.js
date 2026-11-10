import { E, cat, guardar, activos } from '../estado.js';
import { h, eur, descargar } from '../ui.js';
import { lamina, ORDEN_PLANOS } from '../planos.js';

export default function (raiz, inicial) {
  let tipo = ORDEN_PLANOS.includes(inicial) ? inicial : 'domo6';
  const lista = h('ul', { class: 'lista' }), hoja = h('div', { class: 'lienzo' }), ficha = h('div', { class: 'tarjeta' });
  const pinta = () => {
    const l = lamina(tipo, E.nombre, new Date().toLocaleDateString('es-ES')), k = cat(tipo);
    lista.replaceChildren(...ORDEN_PLANOS.map((t) => { const p = lamina(t); return h('li', { class: t === tipo ? 'activo' : '', onclick: () => { tipo = t; history.replaceState(null, '', '#planos/' + t); pinta(); } }, h('span', {}, p.cod + ' · ' + p.titulo)); }));
    hoja.innerHTML = l.svg; const svg = hoja.querySelector('svg'); svg.removeAttribute('width'); svg.removeAttribute('height');
    const uds = activos().filter((e) => e.tipo === tipo).length;
    const editar = (clave, etiqueta) => h('div', { class: 'campo' }, h('label', {}, etiqueta), h('input', { type: 'number', value: k[clave], oninput: (e) => { (E.catalogo[tipo] ||= {})[clave] = Number(e.target.value) || 0; guardar('catalogo'); } }));
    ficha.replaceChildren(
      h('h2', {}, l.titulo),
      h('p', { class: 'suave' }, `${uds} unidad(es) en el escenario actual`),
      h('table', {}, h('tbody', {}, l.specs.map(([a, b]) => h('tr', {}, h('td', { class: 'suave', style: 'width:42%' }, a), h('td', {}, b))))),
      h('h3', { style: 'margin-top:14px' }, 'Cifras editables'),
      editar('coste', 'Coste llave en mano (€, sin IVA)'), k.precio != null ? editar('precio', 'Precio base por noche (€)') : '', editar('kwh', 'Consumo eléctrico (kWh/día)'),
      h('h3', { style: 'margin-top:14px' }, 'Notas de diseño'), h('ul', { style: 'padding-left:18px;margin:0' }, l.notas.map((n) => h('li', { style: 'margin-bottom:6px' }, n))),
      h('div', { class: 'barra noimp', style: 'margin-top:14px' },
        h('button', { class: 'b p', onclick: () => descargar(`${l.cod}-${tipo}.svg`, l.svg, 'image/svg+xml') }, 'Descargar plano (SVG)'),
        h('button', { class: 'b', onclick: () => window.print() }, 'Imprimir / PDF')),
      h('p', { class: 'suave', style: 'font-size:12px' }, `Inversión de este tipo en el escenario: ${eur(uds * k.coste)}`),
    );
  };
  raiz.append(
    h('div', { class: 'nota' }, 'Planos de anteproyecto a escala, con cotas en metros. Sirven para decidir, pedir presupuestos y entregar al arquitecto o ingeniero, que debe firmar el proyecto oficial.'),
    h('div', { class: 'lado' }, h('div', {}, hoja), h('div', { class: 'rejilla' }, h('div', { class: 'tarjeta noimp' }, lista), ficha)));
  pinta();
}
