// Estado único del proyecto: se carga del servidor local (datos/estado.json), con copia en el navegador.
import { DEFECTO, VERSION, CATALOGO } from './datos.js';

const CLAVE = 'glamping-maestrat';
export let E = structuredClone(DEFECTO);
let conServidor = false, temporizador = null;
const oyentes = new Set();

export const alCambiar = (f) => { oyentes.add(f); return () => oyentes.delete(f); };
export const avisar = (que) => oyentes.forEach((f) => f(que));

function fusionar(guardado) {
  if (!guardado || guardado.v !== VERSION) return structuredClone(DEFECTO);
  const base = structuredClone(DEFECTO);
  for (const k of Object.keys(base)) if (guardado[k] !== undefined) base[k] = guardado[k];
  return base;
}

// Solo el lanzador local (ABRIR-GLAMPING) tiene servidor de guardado. En la web publicada
// los datos de cada visita se quedan en SU navegador y nunca se envían a ningún sitio.
const EN_LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);

export async function cargar() {
  let dato = null;
  if (EN_LOCAL) {
    try {
      const r = await fetch('/api/estado', { cache: 'no-store' });
      conServidor = r.ok;
      if (r.status === 200) dato = await r.json();
    } catch { conServidor = false; }
  }
  if (!dato) { try { dato = JSON.parse(localStorage.getItem(CLAVE)); } catch { /* sin copia local */ } }
  E = fusionar(dato);
}

export function guardar(que) {
  avisar(que || 'dato');
  marca('Guardando…');
  clearTimeout(temporizador);
  temporizador = setTimeout(async () => {
    const txt = JSON.stringify(E);
    try { localStorage.setItem(CLAVE, txt); } catch { /* almacenamiento no disponible */ }
    if (conServidor) {
      try { await fetch('/api/estado', { method: 'PUT', body: txt }); marca('Guardado en datos/estado.json'); }
      catch { marca('Guardado solo en este navegador'); }
    } else marca('Guardado en este navegador');
  }, 400);
}

export async function restablecer() {
  E = structuredClone(DEFECTO);
  try { localStorage.removeItem(CLAVE); } catch { /* nada */ }
  if (conServidor) { try { await fetch('/api/estado', { method: 'DELETE' }); } catch { /* nada */ } }
  avisar('todo');
}
export function importar(obj) { E = fusionar(obj); guardar('todo'); }

function marca(t) { const el = document.getElementById('guardado'); if (el) el.textContent = t; }

export const nEsc = () => ({ minimo: 1, medio: 2, completo: 3 }[E.escenario] || 2);
export const NOMBRE_ESC = { 1: 'Mínimo', 2: 'Medio', 3: 'Completo' };
export const cat = (tipo) => ({ ...CATALOGO[tipo], ...(E.catalogo[tipo] || {}) });
export const activos = (n = nEsc()) => E.elementos.filter((e) => e.fase <= n);
export const nuevoId = () => 'e' + Date.now().toString(36) + Math.floor(Math.random() * 99);
