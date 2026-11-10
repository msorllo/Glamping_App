// Genera todos los planos como SVG independientes en /planos. Uso: node herramientas/exportar-planos.mjs
// Si existe datos/estado.json (lo que se ha editado en la app), el plano general sale de ahí.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lamina, ORDEN_PLANOS } from '../app/js/planos.js';
import { laminaGeneral } from '../app/js/planogeneral.js';
import { DEFECTO, VERSION } from '../app/js/datos.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(raiz, 'planos');
fs.mkdirSync(dir, { recursive: true });
let E = DEFECTO;
try { const g = JSON.parse(fs.readFileSync(path.join(raiz, 'datos', 'estado.json'), 'utf8')); if (g.v === VERSION) E = { ...DEFECTO, ...g }; } catch { /* sin estado guardado: datos de partida */ }
const hoy = new Date().toLocaleDateString('es-ES');
const guarda = (nombre, svg) => { fs.writeFileSync(path.join(dir, nombre), svg); console.log('OK', nombre, (svg.length / 1024).toFixed(0) + ' kB'); };

['mínimo', 'medio', 'completo'].forEach((nom, i) => {
  const n = i + 1;
  guarda(`G-0${n}-plano-general-${['minimo', 'medio', 'completo'][i]}.svg`, laminaGeneral(E, n, { etiquetas: true, arboles: true, cotas: true }, `G-0${n} · Plano general · escenario ${nom} · ${E.nombre}`));
});
guarda('G-04-plano-general-fases.svg', laminaGeneral(E, 3, { etiquetas: true, fases: true, cotas: true }, `G-04 · Fases de construcción (verde 1, ocre 2, teja 3) · ${E.nombre}`));
guarda('I-01-red-electrica.svg', laminaGeneral(E, 3, { etiquetas: true, elec: true }, `I-01 · Red eléctrica · ${E.nombre}`));
guarda('I-02-agua-y-saneamiento.svg', laminaGeneral(E, 3, { etiquetas: true, agua: true, saneo: true }, `I-02 · Agua potable (azul) y saneamiento (marrón) · ${E.nombre}`));
guarda('I-03-incendios-y-evacuacion.svg', laminaGeneral(E, 3, { etiquetas: true, fuego: true }, `I-03 · Protección contra incendios y evacuación · ${E.nombre}`));
for (const t of ORDEN_PLANOS) { const l = lamina(t, E.nombre, hoy); guarda(`${l.cod}-${t}.svg`, l.svg); }
