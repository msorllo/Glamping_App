import { E, guardar, nEsc, cat, nuevoId, NOMBRE_ESC } from '../estado.js';
import { h, num, descargar, campo } from '../ui.js';
import { CATALOGO } from '../datos.js';
import { svgPlano, laminaGeneral, CAPAS } from '../planogeneral.js';
import { cumplimiento } from '../calculo.js';

const capas = { etiquetas: true, arboles: true };
let sel = null;

export default function (raiz) {
  const n = nEsc();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const lienzo = h('div', { class: 'lienzo' }); lienzo.append(svg);
  const panel = h('div', { class: 'rejilla' });
  let vb = null, arrastre = null;

  const aMetros = (ev) => { const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
  const pinta = () => {
    const r = svgPlano(E, n, capas, sel); vb ||= r.viewBox;
    svg.setAttribute('viewBox', vb.join(' ')); svg.innerHTML = r.svg; pintaPanel();
  };
  const elemento = () => E.elementos.find((e) => e.id === sel);

  function pintaPanel() {
    const q = cumplimiento(E, n), e = elemento();
    const grupos = ['alojamiento', 'servicio', 'ocio', 'instalacion'];
    panel.replaceChildren(
      h('div', { class: 'tarjeta' }, h('h3', {}, 'Elemento seleccionado'),
        e ? h('div', {},
          h('div', { class: 'campo' }, h('label', {}, 'Nombre'), h('input', { type: 'text', value: e.nombre, placeholder: cat(e.tipo).nombre, oninput: (ev) => { e.nombre = ev.target.value; guardar('plano'); } })),
          h('p', { class: 'suave' }, cat(e.tipo).nombre + ` · ${num(cat(e.tipo).w, 1)} × ${num(cat(e.tipo).d, 1)} m`),
          h('div', { class: 'campo' }, h('label', {}, 'Fase en la que se construye'), h('select', { onchange: (ev) => { e.fase = Number(ev.target.value); guardar('plano'); if (e.fase > n) sel = null; pinta(); } }, [1, 2, 3].map((f) => h('option', { value: f, selected: e.fase === f }, `Fase ${f} · ${NOMBRE_ESC[f]}`)))),
          campo('Posición X (m)', e, 'x', () => { guardar('plano'); pinta(); }), campo('Posición Y (m)', e, 'y', () => { guardar('plano'); pinta(); }),
          h('div', { class: 'barra' },
            h('button', { class: 'b mini', onclick: () => { e.rot = ((e.rot || 0) + 90) % 360; guardar('plano'); pinta(); } }, 'Girar 90°'),
            CATALOGO[e.tipo].plano ? h('a', { class: 'b mini', href: '#planos/' + e.tipo, style: 'text-decoration:none' }, 'Ver plano') : null,
            h('button', { class: 'b mini', onclick: () => { E.elementos.splice(E.elementos.indexOf(e), 1); sel = null; guardar('plano'); pinta(); } }, 'Eliminar')))
          : h('p', { class: 'suave' }, 'Pulsa un elemento para editarlo. Arrástralo para moverlo; tecla R para girar y Supr para borrar. Rueda para acercar y arrastra el fondo para desplazarte.')),
      h('div', { class: 'tarjeta' }, h('h3', {}, 'Capas'), h('div', { class: 'capas' }, CAPAS.map(([id, t, col]) => h('label', {}, h('input', { type: 'checkbox', checked: capas[id], onchange: (ev) => { capas[id] = ev.target.checked; pinta(); } }), h('i', { style: 'background:' + col }), t)))),
      h('div', { class: 'tarjeta' }, h('h3', {}, 'Comprobaciones'),
        h('p', {}, `${num(q.sup / 10000, 2)} ha · ${q.uds} unidades fijas · ${q.libres} parcelas · ${q.plazas} plazas`),
        q.pruebas.map((p) => h('div', { style: 'margin:4px 0;font-size:13px' }, h('span', { class: 'etq ' + (p.ok ? 'ok' : 'mal') }, p.ok ? 'Bien' : 'Revisar'), ' ' + p.t)),
        h('h3', { style: 'margin-top:12px' }, 'Parcela'),
        campo('Ancho este-oeste (m)', E.parcela, 'ancho', () => { vb = null; guardar('plano'); pinta(); }), campo('Fondo norte-sur (m)', E.parcela, 'fondo', () => { vb = null; guardar('plano'); pinta(); }),
        campo('Retranqueo a lindes (m)', E.parcela, 'retranqueo', () => { guardar('plano'); pinta(); }), campo('Ocupación máxima (%)', E.parcela, 'ocupacionMax', () => { guardar('plano'); pinta(); })),
      h('div', { class: 'tarjeta' }, h('h3', {}, 'Añadir al plano'),
        grupos.map((g) => h('div', {}, h('p', { class: 'suave', style: 'margin:8px 0 4px;text-transform:capitalize' }, g === 'instalacion' ? 'Instalaciones' : g + 's'),
          h('div', { class: 'paleta' }, Object.entries(CATALOGO).filter(([, k]) => k.grupo === g).map(([t, k]) => h('button', { class: 'b', title: k.nombre, onclick: () => { const id = nuevoId(); E.elementos.push({ id, tipo: t, x: E.parcela.ancho / 2, y: E.parcela.fondo / 2, rot: 0, fase: n, nombre: '' }); sel = id; guardar('plano'); pinta(); } }, k.nombre.split(' (')[0])))))),
    );
  }

  svg.addEventListener('pointerdown', (ev) => {
    const g = ev.target.closest?.('.el'), p = aMetros(ev);
    if (g) { sel = g.dataset.id; const e = elemento(); arrastre = { e, dx: p.x - e.x, dy: p.y - e.y, g, movido: false }; pinta(); arrastre.g = svg.querySelector(`[data-id="${sel}"]`); }
    else { arrastre = { fondo: true, x: ev.clientX, y: ev.clientY, vb: [...vb] }; if (sel) { sel = null; pinta(); } }
    svg.setPointerCapture(ev.pointerId);
  });
  svg.addEventListener('pointermove', (ev) => {
    if (!arrastre) return;
    if (arrastre.fondo) { const k = vb[2] / svg.clientWidth; vb[0] = arrastre.vb[0] - (ev.clientX - arrastre.x) * k; vb[1] = arrastre.vb[1] - (ev.clientY - arrastre.y) * k; svg.setAttribute('viewBox', vb.join(' ')); return; }
    const p = aMetros(ev), e = arrastre.e;
    e.x = Math.round((p.x - arrastre.dx) * 2) / 2; e.y = Math.round((p.y - arrastre.dy) * 2) / 2; arrastre.movido = true;
    arrastre.g?.setAttribute('transform', `translate(${e.x} ${e.y}) rotate(${e.rot || 0})`);
  });
  const soltar = () => { if (arrastre && !arrastre.fondo && arrastre.movido) { guardar('plano'); pinta(); } arrastre = null; };
  svg.addEventListener('pointerup', soltar); svg.addEventListener('pointercancel', soltar);
  svg.addEventListener('wheel', (ev) => {
    ev.preventDefault(); const p = aMetros(ev), k = ev.deltaY > 0 ? 1.15 : 0.87;
    if (vb[2] * k > 400 || vb[2] * k < 25) return;
    vb = [p.x - (p.x - vb[0]) * k, p.y - (p.y - vb[1]) * k, vb[2] * k, vb[3] * k]; svg.setAttribute('viewBox', vb.join(' '));
  }, { passive: false });
  const tecla = (ev) => {
    const e = elemento(); if (!e || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (ev.key === 'r' || ev.key === 'R') { e.rot = ((e.rot || 0) + 90) % 360; guardar('plano'); pinta(); }
    if (ev.key === 'Delete') { E.elementos.splice(E.elementos.indexOf(e), 1); sel = null; guardar('plano'); pinta(); }
  };
  document.addEventListener('keydown', tecla);

  raiz.append(
    h('div', { class: 'barra' },
      h('span', { class: 'etq f' + n }, `Escenario ${NOMBRE_ESC[n]}: fases 1 a ${n}`),
      h('span', { class: 'suave' }, 'Parcela modelo: se adapta a la finca real cambiando medidas y moviendo elementos.'),
      h('span', { style: 'flex:1' }),
      h('button', { class: 'b', onclick: () => { vb = null; pinta(); } }, 'Centrar'),
      h('button', { class: 'b p', onclick: () => descargar(`G-0${n}-plano-general-${E.escenario}.svg`, laminaGeneral(E, n, capas, `G-0${n} · Plano general · escenario ${NOMBRE_ESC[n].toLowerCase()} · ${E.nombre}`), 'image/svg+xml') }, 'Descargar plano (SVG)')),
    h('div', { class: 'lado' }, lienzo, panel));
  pinta();
  return () => document.removeEventListener('keydown', tecla);
}
