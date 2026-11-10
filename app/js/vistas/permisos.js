import { E, guardar } from '../estado.js';
import { h, eur, num, kpi, tabla } from '../ui.js';

const ESTADOS = [['pendiente', 'Pendiente'], ['en curso', 'En curso'], ['hecho', 'Hecho'], ['no aplica', 'No aplica']];
const COLOR = { pendiente: '#a9b58f', 'en curso': '#d69a2d', hecho: '#4c8a4a', 'no aplica': '#cfc8b8' };

export default function (raiz) {
  const arriba = h('div'), gantt = h('div', { class: 'tarjeta' });
  const pinta = () => {
    const P = E.permisos.filter((p) => p.estado !== 'no aplica'), fin = Math.max(12, ...P.map((p) => p.ini + p.dur));
    const apertura = Math.max(0, ...P.filter((p) => p.bloque === 'Apertura').map((p) => p.ini + p.dur));
    arriba.replaceChildren(h('div', { class: 'rejilla c4' },
      kpi('Trámites', P.length, `${P.filter((p) => p.estado === 'hecho').length} hechos`), kpi('Coste en técnicos y tasas', eur(P.reduce((a, p) => a + p.coste, 0)), 'sin impuesto de obras'),
      kpi('Apertura de la fase 1', apertura ? `mes ${num(apertura)}` : '—', 'desde que se elige finca'), kpi('Trámite más largo', P.length ? num(Math.max(...P.map((p) => p.dur))) + ' meses' : '—', 'declaración de interés comunitario', 'aviso')));
    const anios = Math.ceil(fin / 12);
    gantt.replaceChildren(h('h2', {}, 'Calendario'), h('div', { class: 'gantt' },
      h('div', { class: 'f' }, h('span'), h('div', { class: 'meses' }, Array.from({ length: anios }, (_, i) => h('span', {}, 'Año ' + (i + 1))))),
      P.map((p) => h('div', { class: 'f' }, h('span', { title: p.titulo, style: 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, p.titulo), h('div', { class: 'pista' }, h('i', { style: `left:${p.ini / (anios * 12) * 100}%;width:${Math.max(0.8, p.dur / (anios * 12) * 100)}%;background:${COLOR[p.estado]}`, title: `Mes ${p.ini} a ${p.ini + p.dur}` }))))),
      h('p', { class: 'suave', style: 'margin-top:10px' }, 'Lo que más acorta el calendario: elegir una finca donde el uso ya sea compatible, tramitar agua y medio ambiente a la vez que el urbanismo, y encargar las unidades mientras se espera la licencia.'));
  };
  const cambia = () => { guardar('permisos'); pinta(); };
  raiz.append(
    h('div', { class: 'nota rojo' }, 'La normativa cambia y cada ayuntamiento la aplica con matices. Esta lista es una guía de trabajo: antes de gastar dinero, confírmala con el técnico municipal y con el arquitecto o ingeniero que firme el proyecto. El detalle legal y las fuentes están en Documentos → Legal y permisos.'),
    arriba,
    h('div', { class: 'tarjeta', style: 'margin:14px 0' }, h('h2', {}, 'Lista de trámites'), h('p', { class: 'suave' }, 'Inicio y duración en meses, contando desde el mes 0 (elección de la finca).'),
      tabla({ filas: E.permisos, alCambiar: cambia, nueva: () => ({ id: 'p' + Date.now(), bloque: 'Otros', titulo: 'Nuevo trámite', org: '', ini: 0, dur: 1, coste: 0, estado: 'pendiente', nota: '' }),
        cols: [{ k: 'bloque', t: 'Bloque', w: 120 }, { k: 'titulo', t: 'Trámite', w: 330 }, { k: 'org', t: 'Dónde', w: 170 }, { k: 'ini', t: 'Inicio', tipo: 'num', w: 60 }, { k: 'dur', t: 'Meses', tipo: 'num', w: 60 }, { k: 'coste', t: 'Coste (€)', tipo: 'num', w: 85 }, { k: 'estado', t: 'Estado', tipo: 'sel', ops: ESTADOS, w: 105 }, { k: 'nota', t: 'Notas', w: 280 }] })),
    gantt);
  pinta();
}
