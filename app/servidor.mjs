// Servidor local mínimo, sin dependencias: sirve la app y guarda el estado en datos/estado.json
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');
const ESTADO = path.join(RAIZ, 'datos', 'estado.json');
const PUERTO = Number(process.env.PUERTO || 5180);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8' };

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/estado') {
    if (req.method === 'GET') {
      if (!fs.existsSync(ESTADO)) { res.writeHead(204); return res.end(); }
      res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' });
      return res.end(fs.readFileSync(ESTADO));
    }
    if (req.method === 'PUT') {
      let cuerpo = '';
      req.on('data', (d) => { cuerpo += d; if (cuerpo.length > 5e6) req.destroy(); });
      req.on('end', () => {
        try {
          JSON.parse(cuerpo);
          fs.mkdirSync(path.dirname(ESTADO), { recursive: true });
          fs.writeFileSync(ESTADO, cuerpo);
          res.writeHead(200, { 'Content-Type': MIME['.json'] }); res.end('{"ok":true}');
        } catch { res.writeHead(400); res.end('JSON no válido'); }
      });
      return;
    }
    if (req.method === 'DELETE') { if (fs.existsSync(ESTADO)) fs.unlinkSync(ESTADO); res.writeHead(200); return res.end('{"ok":true}'); }
    res.writeHead(405); return res.end();
  }
  // estáticos: /docs y /planos salen de la raíz del proyecto; el resto, de app/
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  const base = /^\/(docs|planos)\//.test(rel) ? RAIZ : AQUI;
  const fichero = path.normalize(path.join(base, rel));
  if (!fichero.startsWith(base) || !fs.existsSync(fichero) || fs.statSync(fichero).isDirectory()) { res.writeHead(404); return res.end('No encontrado'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(fichero).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(fichero).pipe(res);
});
servidor.listen(PUERTO, '127.0.0.1', () => console.log(`Glamping · planificador abierto en http://localhost:${PUERTO}  (Ctrl+C para cerrar)`));
