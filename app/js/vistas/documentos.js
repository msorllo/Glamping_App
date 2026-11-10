import { h, esc } from '../ui.js';
import { ORDEN_PLANOS, lamina } from '../planos.js';

const DOCS = [['00-RESUMEN-EJECUTIVO', 'Resumen ejecutivo'], ['01-LEGAL-Y-PERMISOS', 'Legal y permisos'], ['02-TERRENOS-Y-LOCALIZACION', 'Terrenos y localización'], ['03-DISENO-Y-PLANOS', 'Diseño y planos'], ['04-INSTALACIONES', 'Instalaciones: luz, agua, saneamiento'],
  ['05-MODELO-DE-NEGOCIO', 'Modelo de negocio'], ['06-PLAN-ECONOMICO', 'Plan económico'], ['07-OPERACIONES-Y-EQUIPO', 'Operaciones y equipo'], ['08-MARKETING-Y-CLIENTES', 'Marketing y clientes'], ['09-HOJA-DE-RUTA', 'Hoja de ruta'], ['10-RIESGOS', 'Riesgos y cómo reducirlos'], ['FUENTES', 'Fuentes y fiabilidad de los datos']];

// Conversor mínimo de Markdown a HTML (títulos, listas, tablas, negrita, enlaces, citas)
function md(txt) {
  const linea = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/\[(.+?)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  const L = txt.replace(/\r/g, '').split('\n'); let o = '', i = 0;
  while (i < L.length) {
    const l = L[i];
    if (/^\|/.test(l)) { const f = []; while (i < L.length && /^\|/.test(L[i])) f.push(L[i++]); const cel = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => linea(c.trim())); o += '<div class="tablaWrap"><table><thead><tr>' + cel(f[0]).map((c) => `<th>${c}</th>`).join('') + '</tr></thead><tbody>' + f.slice(2).map((r) => '<tr>' + cel(r).map((c) => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>'; continue; }
    if (/^\s*([-*]|\d+\.)\s/.test(l)) { const ord = /^\s*\d+\./.test(l); o += ord ? '<ol>' : '<ul>'; while (i < L.length && /^\s*([-*]|\d+\.)\s/.test(L[i])) o += '<li>' + linea(L[i++].replace(/^\s*([-*]|\d+\.)\s/, '')) + '</li>'; o += ord ? '</ol>' : '</ul>'; continue; }
    const t = /^(#{1,4})\s+(.*)/.exec(l);
    if (t) o += `<h${Math.min(3, t[1].length)} style="margin-top:${t[1].length === 1 ? 0 : 16}px">${linea(t[2])}</h${Math.min(3, t[1].length)}>`;
    else if (/^>\s?/.test(l)) o += `<div class="nota">${linea(l.replace(/^>\s?/, ''))}</div>`;
    else if (/^---+$/.test(l)) o += '<hr style="border:0;border-top:1px solid var(--linea);margin:14px 0">';
    else if (l.trim()) o += `<p>${linea(l)}</p>`;
    i++;
  }
  return o;
}

export default function (raiz, inicial) {
  let actual = DOCS.some((d) => d[0] === inicial) ? inicial : DOCS[0][0];
  const lista = h('ul', { class: 'lista' }), hoja = h('div', { class: 'tarjeta doc' });
  const abre = async (id) => {
    actual = id; history.replaceState(null, '', '#documentos/' + id);
    lista.replaceChildren(...DOCS.map(([d, t]) => h('li', { class: d === actual ? 'activo' : '', onclick: () => abre(d) }, t)));
    hoja.innerHTML = '<p class="suave">Cargando…</p>';
    try { const r = await fetch(`/docs/${id}.md`); if (!r.ok) throw new Error(); hoja.innerHTML = md(await r.text()); }
    catch { hoja.innerHTML = `<div class="nota">No se pudo abrir <b>docs/${id}.md</b>. Los documentos se leen cuando la app se abre con ABRIR-GLAMPING.bat; también puedes abrir el archivo directamente desde la carpeta <b>docs</b>.</div>`; }
  };
  raiz.append(h('div', { class: 'lado', style: 'grid-template-columns:260px minmax(0,1fr)' },
    h('div', { class: 'rejilla noimp' }, h('div', { class: 'tarjeta' }, h('h3', {}, 'Documentos'), lista),
      h('div', { class: 'tarjeta' }, h('h3', {}, 'Planos en la carpeta planos/'), h('ul', { class: 'lista' }, ORDEN_PLANOS.map((t) => { const l = lamina(t); return h('li', {}, h('a', { href: `/planos/${l.cod}-${t}.svg`, target: '_blank', style: 'text-decoration:none' }, `${l.cod} · ${l.titulo}`)); })),
        h('button', { class: 'b mini', style: 'margin-top:8px', onclick: () => window.print() }, 'Imprimir este documento'))),
    hoja));
  abre(actual);
}
