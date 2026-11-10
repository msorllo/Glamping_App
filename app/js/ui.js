// Utilidades de interfaz: creación de nodos, formato y tabla editable genérica
export function h(tag, attrs, ...hijos) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'class') el.className = v;
    else if (k === 'value') el.value = v;
    else if (k === 'checked') el.checked = !!v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of hijos.flat(Infinity)) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}
export const eur = (n, d = 0) => (isFinite(n) ? n : 0).toLocaleString('es-ES', { maximumFractionDigits: d, minimumFractionDigits: d }) + ' €';
export const num = (n, d = 0) => (isFinite(n) ? n : 0).toLocaleString('es-ES', { maximumFractionDigits: d, minimumFractionDigits: d });
export const pct = (n, d = 0) => num(n * 100, d) + ' %';
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function kpi(etiqueta, valor, sub, clase = '') {
  return h('div', { class: 'kpi ' + clase }, h('span', {}, etiqueta), h('b', {}, valor), sub ? h('em', {}, ' ' + sub) : null);
}

/** Tabla editable. cols: [{k, t, tipo:'txt'|'num'|'sel'|'chk'|'ver', ops, w, paso, ver:(fila)=>nodo|texto}] */
export function tabla({ cols, filas, alCambiar, nueva, borrar = true, pie }) {
  const cuerpo = h('tbody');
  const pintaFila = (f) => {
    const tr = h('tr');
    for (const c of cols) {
      let celda;
      if (c.tipo === 'ver') celda = c.ver(f);
      else if (c.tipo === 'sel') celda = h('select', { onchange: (e) => { f[c.k] = c.num ? Number(e.target.value) : e.target.value; alCambiar?.(f, c.k); } },
        c.ops.map((o) => { const [v, t] = Array.isArray(o) ? o : [o, o]; return h('option', { value: v, selected: String(f[c.k]) === String(v) }, t); }));
      else if (c.tipo === 'chk') celda = h('input', { type: 'checkbox', checked: f[c.k], onchange: (e) => { f[c.k] = e.target.checked; alCambiar?.(f, c.k); } });
      else if (c.tipo === 'num') celda = h('input', { type: 'number', step: c.paso || 'any', value: f[c.k] ?? 0, oninput: (e) => { f[c.k] = Number(e.target.value) || 0; alCambiar?.(f, c.k); } });
      else celda = h('input', { type: 'text', value: f[c.k] ?? '', oninput: (e) => { f[c.k] = e.target.value; alCambiar?.(f, c.k); } });
      tr.append(h('td', { class: c.tipo === 'num' || c.n ? 'n' : '', style: c.w ? `width:${c.w}px;min-width:${c.w}px` : '' }, celda));
    }
    if (borrar) tr.append(h('td', { style: 'width:24px' }, h('button', { class: 'x', title: 'Eliminar fila', onclick: () => { filas.splice(filas.indexOf(f), 1); tr.remove(); alCambiar?.(null, null); } }, '×')));
    return tr;
  };
  filas.forEach((f) => cuerpo.append(pintaFila(f)));
  const t = h('table', {}, h('thead', {}, h('tr', {}, cols.map((c) => h('th', { class: c.tipo === 'num' || c.n ? 'n' : '' }, c.t)), borrar ? h('th') : null)), cuerpo, pie ? h('tfoot', {}, pie) : null);
  const env = h('div', { class: 'tablaWrap' }, t);
  if (nueva) env.append(h('button', { class: 'b mini', style: 'margin-top:8px', onclick: () => { const f = nueva(); filas.push(f); cuerpo.append(pintaFila(f)); alCambiar?.(f, null); } }, '+ Añadir fila'));
  return env;
}

export function campo(etiqueta, obj, clave, alCambiar, extra = {}) {
  return h('div', { class: 'campo' }, h('label', {}, etiqueta),
    h('input', { type: 'number', step: extra.paso || 'any', value: obj[clave], onchange: (e) => { obj[clave] = Number(e.target.value) || 0; alCambiar?.(); } }));
}

export function pestanas(lista, activa, alElegir) {
  return h('div', { class: 'pestanas' }, lista.map(([id, t]) => h('button', { class: id === activa ? 'activo' : '', onclick: () => alElegir(id) }, t)));
}

export function descargar(nombre, contenido, tipo = 'text/plain') {
  const a = h('a', { href: URL.createObjectURL(new Blob([contenido], { type: tipo })), download: nombre });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
