// Prepara la versión web estática en /dist (lo que se publica en Vercel).
// Uso: node herramientas/construir-web.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

// 1) La app, sin el servidor local (la web no guarda nada en servidor)
fs.cpSync(path.join(raiz, 'app'), dist, { recursive: true, filter: (o) => path.basename(o) !== 'servidor.mjs' });
// 2) Documentos y planos que la app lee o enlaza
for (const [carpeta, ext] of [['docs', '.md'], ['planos', '.svg']]) {
  fs.mkdirSync(path.join(dist, carpeta), { recursive: true });
  for (const f of fs.readdirSync(path.join(raiz, carpeta)).filter((n) => n.endsWith(ext))) fs.copyFileSync(path.join(raiz, carpeta, f), path.join(dist, carpeta, f));
}

// 3) Comprobaciones: nada de scripts inline ni recursos de terceros (la política de seguridad lo prohíbe)
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const problemas = [];
if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) problemas.push('index.html tiene un <script> inline');
if (/(src|href)="https?:\/\/(?!mistereia\.com)/i.test(html)) problemas.push('index.html carga recursos externos');
const faltan = ['index.html', 'js/app.js', 'vendor/three.module.min.js', 'docs/00-RESUMEN-EJECUTIVO.md', 'planos/G-02-plano-general-medio.svg', 'favicon.svg']
  .filter((f) => !fs.existsSync(path.join(dist, f)));
if (faltan.length) problemas.push('faltan: ' + faltan.join(', '));
if (problemas.length) { console.error('ERROR:\n - ' + problemas.join('\n - ')); process.exit(1); }

let n = 0, bytes = 0;
(function recorre(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) recorre(p); else { n++; bytes += fs.statSync(p).size; } } })(dist);
console.log(`dist listo: ${n} archivos, ${(bytes / 1048576).toFixed(2)} MB`);
