import * as THREE from '../../vendor/three.module.min.js';
import { OrbitControls } from '../../vendor/OrbitControls.js';
import { E, nEsc, cat, NOMBRE_ESC } from '../estado.js';
import { h, eur } from '../ui.js';
import { CATALOGO } from '../datos.js';
import { alVial, arboles } from '../calculo.js';

const M = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...extra });
const mat = { madera: M(0xc9a66b), lona: M(0xf3ecd8, { side: THREE.DoubleSide }), lonaOsc: M(0xd8c79c, { side: THREE.DoubleSide }), muro: M(0xe5dccb), tejado: M(0x6b5a48), agua: M(0x4fb3d9, { roughness: 0.15, transparent: true, opacity: 0.85 }),
  vidrio: M(0x9fd3e6, { roughness: 0.1, transparent: true, opacity: 0.55 }), panel: M(0x1d3b63, { roughness: 0.3, metalness: 0.4 }), gris: M(0x9a9484), grava: M(0xcfc8b8), verde: M(0x86a857), arena: M(0xe6d39a), metal: M(0x55585c, { metalness: 0.5 }), blanco: M(0xfaf7ef, { side: THREE.DoubleSide }) };

function caja(w, hh, d, m, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), m); o.position.set(x, y + hh / 2, z); o.castShadow = o.receiveShadow = true; return o; }
function cil(r, hh, m, x = 0, y = 0, z = 0, seg = 20, r2 = r) { const o = new THREE.Mesh(new THREE.CylinderGeometry(r2, r, hh, seg), m); o.position.set(x, y + hh / 2, z); o.castShadow = o.receiveShadow = true; return o; }
function prisma(w, hh, largo, m) { // tejado a dos aguas con la cumbrera a lo largo de z
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(0, hh); s.lineTo(w / 2, 0); s.closePath();
  const o = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: largo, bevelEnabled: false }), m); o.position.z = -largo / 2; o.castShadow = true; return o;
}
function pergola(w, d, alto, cubierta) {
  const g = new THREE.Group();
  for (const x of [-w / 2 + 0.15, w / 2 - 0.15]) for (const z of [-d / 2 + 0.15, d / 2 - 0.15]) g.add(caja(0.16, alto, 0.16, mat.madera, x, 0, z));
  if (cubierta) g.add(caja(w, 0.08, d, cubierta, 0, alto, 0));
  else for (let x = -w / 2; x <= w / 2; x += 0.6) g.add(caja(0.08, 0.14, d, mat.madera, x, alto, 0));
  return g;
}
function mesaSillas(x, z) { const g = new THREE.Group(); g.add(cil(0.45, 0.05, mat.blanco, 0, 0.72, 0, 12), cil(0.05, 0.72, mat.metal, 0, 0, 0, 6)); for (let i = 0; i < 4; i++) g.add(caja(0.38, 0.45, 0.38, mat.madera, Math.cos(i * Math.PI / 2) * 0.75, 0, Math.sin(i * Math.PI / 2) * 0.75)); g.position.set(x, 0, z); return g; }

function construir(tipo) {
  const k = CATALOGO[tipo], g = new THREE.Group(), w = k.w, d = k.d;
  const tarima = (alto = 0.45) => g.add(caja(w, alto, d, mat.madera));
  switch (tipo) {
    case 'domo6': case 'domo7': {
      const r = tipo === 'domo6' ? 3 : 3.5, cz = -d / 2 + (tipo === 'domo6' ? 3.5 : 4); tarima();
      const piel = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), mat.lona.clone()); piel.position.set(0, 0.45, cz); piel.castShadow = true; piel.userData.brilla = true;
      const malla = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(r * 1.008, 10, 4, 0, Math.PI * 2, 0, Math.PI / 2)), new THREE.LineBasicMaterial({ color: 0x8c8672 })); malla.position.copy(piel.position);
      const vent = new THREE.Mesh(new THREE.SphereGeometry(r * 1.012, 14, 8, Math.PI / 2 - 0.62, 1.24, 0.62, Math.PI / 2 - 0.62), mat.vidrio); vent.position.copy(piel.position);
      g.add(piel, malla, vent);
      if (tipo === 'domo7') g.add(cil(1, 0.75, mat.madera, -w / 2 + 2, 0.45, d / 2 - 1.8), cil(0.85, 0.05, mat.agua, -w / 2 + 2, 1.18, d / 2 - 1.8));
      break;
    }
    case 'bell': { tarima(0.3); const p = cil(2.5, 0.6, mat.lona.clone(), 0, 0.3, 0, 24); p.userData.brilla = true; const c = cil(2.5, 2.4, mat.lona.clone(), 0, 0.9, 0, 24, 0.05); c.userData.brilla = true; g.add(p, c); break; }
    case 'parcela': g.add(caja(w, 0.05, d, M(0xc3cf96)), caja(w, 0.9, 0.4, M(0x55703f), 0, 0, -d / 2), caja(0.4, 0.9, d, M(0x55703f), -w / 2, 0, 0), caja(2.1, 1.9, 5.2, M(0xf1eee6, { roughness: 0.4 }), -1.6, 0.35, -0.6), caja(2.0, 0.9, 1.4, M(0x22262b, { roughness: 0.2 }), -1.6, 1.3, 1.4), cil(0.08, 1.1, mat.metal, w / 2 - 0.7, 0, -d / 2 + 0.9, 6)); break;
    case 'safari': { tarima(0.4); const c = caja(5, 1.9, 7, mat.lonaOsc.clone(), 0, 0.4, -d / 2 + 3.8); c.userData.brilla = true; const t = prisma(5.7, 1.35, 10, mat.lona); t.position.y = 2.3; t.position.z = -d / 2 - 0.05; g.add(c, t);
      for (const x of [-2.6, 2.6]) g.add(caja(0.12, 1.9, 0.12, mat.madera, x, 0.4, d / 2 - 0.6)); break; }
    case 'cabana': { g.add(caja(w, 0.35, d, mat.madera)); g.add(caja(6, 2.4, 3.6, M(0xb98f5c), 0, 0.35, -0.9)); const t = caja(6.6, 0.14, 6.1, mat.tejado, 0, 2.95, 0); t.rotation.x = 0.1; g.add(t, caja(1.6, 1.1, 0.06, mat.vidrio, -1.8, 1.3, 0.92));
      for (const x of [-2.85, 2.85]) g.add(caja(0.12, 2.5, 0.12, mat.madera, x, 0.35, 2.5)); break; }
    case 'kiosco': { g.add(caja(6, 2.6, 2.4, M(0xa9764a), 0, 0, -2.5), caja(3.4, 1.0, 0.1, M(0x2c2a26), -0.7, 1.1, -1.28), caja(3.6, 0.08, 0.5, mat.madera, -0.7, 1.05, -1.0)); const p = pergola(6, 5, 2.6); p.position.z = 1.2; g.add(p, caja(6, 0.12, 5, mat.madera, 0, 0, 1.2));
      for (const [x, z] of [[-1.6, 0.2], [1.4, 0.2], [-1.6, 2.3], [1.4, 2.3]]) g.add(mesaSillas(x, z)); break; }
    case 'restaurante': { g.add(caja(14, 3.2, 8, mat.muro, 0, 0, -3), caja(14.4, 0.4, 8.4, mat.tejado, 0, 3.2, -3), caja(6.4, 2.6, 0.08, mat.vidrio, 3.2, 0, 1.03), caja(1, 2.1, 0.08, mat.madera, -5.5, 0, 1.03));
      for (let i = 0; i < 6; i++) { const p = caja(1.7, 0.06, 3, mat.panel, -5.2 + i * 2.1, 3.85, -3.5); p.rotation.x = -0.28; g.add(p); }
      const p = pergola(14, 6, 2.8); p.position.z = 4; g.add(p, caja(14, 0.12, 6, mat.madera, 0, 0, 4));
      for (const z of [2.8, 5.3]) for (const x of [-5.4, -2.7, 0, 2.7, 5.4]) g.add(mesaSillas(x, z)); break; }
    case 'sanitarios': g.add(caja(9, 2.5, 4.2, mat.muro), caja(9.8, 0.2, 5.4, mat.tejado, 0, 2.5, -0.3)); for (const x of [-3, 0.2, 3.1]) g.add(caja(0.8, 2.05, 0.06, mat.madera, x, 0, 2.12)); break;
    case 'piscina': g.add(caja(16, 0.15, 9, M(0xefe6d2)), caja(12, 0.06, 5, mat.agua, 0, 0.13, 0));
      for (const x of [-8, 8]) g.add(caja(0.06, 1.2, 9, mat.vidrio, x, 0, 0)); for (const z of [-4.5, 4.5]) g.add(caja(16, 1.2, 0.06, mat.vidrio, 0, 0, z));
      for (let x = -5; x <= 5; x += 2) g.add(caja(0.65, 0.3, 1.9, mat.blanco, x, 0.15, -3.5)); break;
    case 'spa': tarima(0.35); for (const z of [-1.1, 1.4]) g.add(cil(1.1, 0.8, mat.madera, -2.2, 0.35, z), cil(0.95, 0.05, mat.agua, -2.2, 1.13, z)); { const s = cil(1.15, 3.4, M(0xb98f5c), 0, 0, 0, 18); s.rotation.x = Math.PI / 2; s.position.set(1.6, 1.5, 0); g.add(s); } break;
    case 'eventos': g.add(caja(w, 0.1, d, mat.arena), pergola(w, d, 3.6, mat.blanco)); for (const x of [-5, -1.7, 1.7, 5]) for (const z of [-2.5, 2.5]) g.add(mesaSillas(x, z)); break;
    case 'mirador': tarima(0.5); { const t = cil(0.1, 1.1, mat.metal, 0, 0.5, 0, 8); const o = cil(0.14, 0.9, mat.metal, 0, 1.5, 0, 10); o.rotation.z = 0.9; g.add(t, o); } break;
    case 'yoga': tarima(0.3); break;
    case 'juegos': g.add(caja(w, 0.12, d, mat.arena), caja(0.15, 2.2, 0.15, mat.madera, -2, 0, -1), caja(0.15, 2.2, 0.15, mat.madera, 1, 0, -1), caja(3.3, 0.15, 0.15, mat.madera, -0.5, 2.2, -1), cil(0.9, 0.5, M(0xbd5d3a), 2, 0, 2, 12)); break;
    case 'huerto': g.add(caja(w, 0.08, d, M(0x9a7b55))); for (let i = 0; i < 5; i++) g.add(caja(w - 1.2, 0.35, 0.9, mat.verde, 0, 0.05, -d / 2 + 1 + i * 1.45)); break;
    case 'parking': g.add(caja(w, 0.06, d, mat.grava)); [0x8a2f2a, 0xe9e6df, 0x33485e, 0x5a5a5a].forEach((c, i) => { const x = -w / 2 + 1.25 + [0, 2, 5, 8][i] * 2.5; g.add(caja(1.8, 0.9, 4.2, M(c, { roughness: 0.4 }), x, 0.25, -d / 2 + 2.6), caja(1.6, 0.55, 2.2, M(0x22262b, { roughness: 0.2 }), x, 1.15, -d / 2 + 2.7)); }); break;
    case 'solar': { for (const x of [-w / 2 + 0.3, w / 2 - 0.3]) g.add(caja(0.14, 2.3, 0.14, mat.metal, x, 0, -d / 2 + 0.3), caja(0.14, 3.0, 0.14, mat.metal, x, 0, d / 2 - 0.3)); const p = caja(w, 0.08, d + 0.1, mat.panel, 0, 2.62, 0); p.rotation.x = -0.15; g.add(p); break; }
    case 'tecnico': g.add(caja(4, 2.4, 3, mat.gris), caja(4.3, 0.15, 3.3, mat.tejado, 0, 2.4, 0)); break;
    case 'deposito': g.add(cil(1.8, 2.4, M(0x8fb3c4, { metalness: 0.3, roughness: 0.5 }))); break;
    case 'pozo': g.add(cil(1, 0.8, mat.gris), cil(0.8, 0.05, M(0x1c3340), 0, 0.78, 0)); break;
    case 'depuradora': g.add(caja(6, 0.2, 3, mat.gris, -2, 0, -2.5), cil(0.35, 0.3, mat.metal, -3, 0.2, -2.5), cil(0.35, 0.3, mat.metal, -1, 0.2, -2.5), caja(10, 0.5, 4.4, mat.verde, 0, 0, 1.8)); break;
    case 'residuos': g.add(caja(5, 1.5, 0.1, mat.madera, 0, 0, -1.4)); [0xd6b23a, 0x3f7fb5, 0x5f8a45].forEach((c, i) => g.add(caja(1.1, 1.2, 1.2, M(c), -1.5 + i * 1.5, 0, 0))); break;
    default: g.add(caja(w, k.h || 1, d, M(k.color)));
  }
  return g;
}

export default function (raiz) {
  const n = nEsc(), p = E.parcela, cx = p.ancho / 2, cz = p.fondo / 2;
  const cont = h('div', { class: 'lienzo', id: 'lienzo3d' });
  const info = h('div', { class: 'flota der', style: 'display:none' });
  const estado = { noche: false, elec: false, agua: false, saneo: false };
  raiz.append(h('div', { class: 'barra' }, h('span', { class: 'etq f' + n }, `Escenario ${NOMBRE_ESC[n]}`), h('span', { class: 'suave' }, 'Arrastra para girar, rueda para acercar, botón derecho para desplazar. Pulsa un elemento para ver su ficha.')), cont);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true }); } catch { cont.replaceWith(h('div', { class: 'nota rojo' }, 'Este navegador no tiene WebGL activo, así que no puede mostrar la vista 3D. El resto de la app funciona igual.')); return; }
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  cont.append(renderer.domElement, info);
  const escena = new THREE.Scene(), cam = new THREE.PerspectiveCamera(45, 1, 1, 2500), ctl = new OrbitControls(cam, renderer.domElement);
  ctl.maxPolarAngle = Math.PI / 2 - 0.03; ctl.minDistance = 12; ctl.maxDistance = 420; ctl.enableDamping = true;
  const hemi = new THREE.HemisphereLight(0xdfeeff, 0x9a8f6a, 0.95), sol = new THREE.DirectionalLight(0xfff1d6, 2.1);
  sol.position.set(-90, 130, 80); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -120, right: 120, top: 110, bottom: -110, near: 10, far: 400 }); sol.shadow.bias = -0.0006;
  escena.add(hemi, sol);

  // terreno, mar y relieve lejano
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(1800, 1800), M(0xbdb98a)); suelo.rotation.x = -Math.PI / 2; suelo.position.y = -0.06; suelo.receiveShadow = true; escena.add(suelo);
  const parcela = new THREE.Mesh(new THREE.PlaneGeometry(p.ancho, p.fondo), M(0xd3d6a8)); parcela.rotation.x = -Math.PI / 2; parcela.receiveShadow = true; escena.add(parcela);
  const mar = new THREE.Mesh(new THREE.PlaneGeometry(900, 1800), M(0x3f8fb0, { roughness: 0.25 })); mar.rotation.x = -Math.PI / 2; mar.position.set(780, 0, 0); escena.add(mar);
  for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.ConeGeometry(110 + (i * 37) % 70, 45 + (i * 23) % 40, 7), M(0x8f9a73)); m.position.set(-520 - (i % 3) * 90, 0, -700 + i * 170); escena.add(m); }
  escena.add(caja(p.ancho + 220, 0.05, 5, M(0xcabf9f), 0, 0, cz + 4));
  for (const v of E.viales) for (let i = 1; i < v.pts.length; i++) {
    const [ax, az] = v.pts[i - 1], [bx, bz] = v.pts[i], L = Math.hypot(bx - ax, bz - az);
    const t = caja(L + v.ancho, 0.05, v.ancho, M(0xeee5cc), (ax + bx) / 2 - cx, 0, (az + bz) / 2 - cz); t.rotation.y = -Math.atan2(bz - az, bx - ax); t.castShadow = false; escena.add(t);
  }
  // seto perimetral con hueco en la entrada
  const ex = E.viales[0].pts[0][0] - cx, seto = M(0x55703f);
  escena.add(caja(p.ancho, 1.3, 0.8, seto, 0, 0, -cz), caja(0.8, 1.3, p.fondo, seto, -cx, 0, 0), caja(0.8, 1.3, p.fondo, seto, cx, 0, 0), caja(cx + ex - 4, 1.3, 0.8, seto, (-cx + ex - 4) / 2, 0, cz), caja(cx - ex - 4, 1.3, 0.8, seto, (cx + ex + 4) / 2, 0, cz));
  // elementos
  const elegibles = [], brillan = [];
  for (const e of E.elementos.filter((x) => x.fase <= n)) {
    const g = construir(e.tipo); g.position.set(e.x - cx, 0, e.y - cz); g.rotation.y = -(e.rot || 0) * Math.PI / 180; g.userData.el = e;
    g.traverse((o) => { if (o.isMesh) { elegibles.push(o); if (o.userData.brilla) brillan.push(o); } }); escena.add(g);
  }
  // arbolado instanciado
  const arb = arboles(E, n), tr = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.28, 1, 6), M(0x5a4a38), arb.length), co = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), M(0x8ea66f, { flatShading: true }), arb.length);
  const dm = new THREE.Object3D(), col = new THREE.Color();
  arb.forEach((a, i) => {
    const alto = a.r * 1.1; dm.position.set(a.x - cx, alto / 2, a.y - cz); dm.scale.set(a.r * 0.6, alto, a.r * 0.6); dm.rotation.set(0, 0, 0); dm.updateMatrix(); tr.setMatrixAt(i, dm.matrix);
    dm.position.set(a.x - cx, alto + a.r * 0.45, a.y - cz); dm.scale.set(a.r, a.r * 0.75, a.r); dm.rotation.y = i; dm.updateMatrix(); co.setMatrixAt(i, dm.matrix);
    co.setColorAt(i, col.set(a.tipo === 'olivo' ? 0x9bb07a : 0x5f7f4a));
  });
  tr.castShadow = co.castShadow = true; escena.add(tr, co);
  // balizas y estrellas (noche)
  const balizas = new THREE.Group(), luces = new THREE.Group();
  for (const v of E.viales) for (let i = 1; i < v.pts.length; i++) { const [ax, az] = v.pts[i - 1], [bx, bz] = v.pts[i], L = Math.hypot(bx - ax, bz - az); for (let t = 0; t <= L; t += 9) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd28a })); b.position.set(ax + (bx - ax) * t / L - cx + v.ancho / 2 + 0.3, 0.5, az + (bz - az) * t / L - cz); balizas.add(b); } }
  E.elementos.filter((x) => x.fase <= n && ['restaurante', 'kiosco', 'piscina', 'eventos', 'sanitarios'].includes(x.tipo)).forEach((e) => { const l = new THREE.PointLight(0xffc27a, 260, 60, 1.8); l.position.set(e.x - cx, 4.5, e.y - cz); luces.add(l); });
  const pos = new Float32Array(900 * 3); for (let i = 0; i < 900; i++) { const a = i * 2.399, r = 900, y = 120 + ((i * 73) % 700); pos.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3); }
  const geoE = new THREE.BufferGeometry(); geoE.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const estrellas = new THREE.Points(geoE, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false }));
  balizas.visible = luces.visible = estrellas.visible = false; escena.add(balizas, luces, estrellas);
  // redes
  const redes = {};
  const haceRed = (id, color, y, consumidores, fuente) => {
    const g = new THREE.Group(), m = new THREE.LineBasicMaterial({ color }), linea = (pts) => g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(([x, z]) => new THREE.Vector3(x - cx, y, z - cz))), m));
    E.viales.forEach((v) => linea(v.pts));
    E.elementos.filter((e) => e.fase <= n && (consumidores(e) || fuente(e))).forEach((e) => { const q = alVial(E, e.x, e.y); linea([[e.x, e.y], [q.x, q.y]]); const b = new THREE.Mesh(new THREE.SphereGeometry(fuente(e) ? 1.1 : 0.5, 10, 8), new THREE.MeshBasicMaterial({ color })); b.position.set(e.x - cx, y + (fuente(e) ? 4 : 0), e.y - cz); g.add(b); });
    g.visible = false; escena.add(g); redes[id] = g;
  };
  const AG = ['domo6', 'domo7', 'safari', 'cabana', 'sanitarios', 'kiosco', 'restaurante', 'piscina', 'spa'];
  haceRed('elec', 0xe0a020, 0.9, (e) => CATALOGO[e.tipo].kwh > 0 || CATALOGO[e.tipo].kwp, (e) => e.tipo === 'tecnico');
  haceRed('agua', 0x1f8fc0, 0.6, (e) => AG.includes(e.tipo) || e.tipo === 'huerto', (e) => e.tipo === 'deposito');
  haceRed('saneo', 0x7a4a2a, 0.3, (e) => AG.includes(e.tipo) && e.tipo !== 'piscina', (e) => e.tipo === 'depuradora');

  function ambiente() {
    const nn = estado.noche;
    escena.background = new THREE.Color(nn ? 0x0b1422 : 0xcfe3ee); escena.fog = new THREE.Fog(nn ? 0x0b1422 : 0xcfe3ee, 380, 1500);
    hemi.intensity = nn ? 0.16 : 0.95; sol.intensity = nn ? 0.12 : 2.1; sol.color.set(nn ? 0x9fb4ff : 0xfff1d6);
    balizas.visible = luces.visible = estrellas.visible = nn;
    brillan.forEach((o) => { o.material.emissive.set(nn ? 0xffb45a : 0x000000); o.material.emissiveIntensity = nn ? 0.85 : 0; });
    cont.style.background = nn ? '#0b1422' : '#cfe3ee';
  }
  const vistas = { 'Aérea': [[20, 150, 150], [0, 0, 5]], 'Entrada': [[ex, 9, cz + 34], [ex, 2, 0]], 'Cúpulas': [[cx + 20, 16, -cz + 6], [40, 2, -25]], 'Restaurante y piscina': [[35, 22, 62], [35, 0, 20]], 'Planta': [[0, 215, 0.1], [0, 0, 0]] };
  const mira = (v) => { cam.position.set(...v[0]); ctl.target.set(...v[1]); ctl.update(); };
  const boton = (t, clave) => { const b = h('button', { class: 'b mini', onclick: () => { estado[clave] = !estado[clave]; b.classList.toggle('p', estado[clave]); if (clave === 'noche') ambiente(); else redes[clave].visible = estado[clave]; } }, t); return b; };
  cont.append(h('div', { class: 'flota' }, h('b', {}, 'Cámara'), h('div', { class: 'barra', style: 'margin:6px 0 10px' }, Object.entries(vistas).map(([t, v]) => h('button', { class: 'b mini', onclick: () => mira(v) }, t))),
    h('b', {}, 'Mostrar'), h('div', { class: 'barra', style: 'margin:6px 0 0' }, boton('Noche', 'noche'), boton('Luz', 'elec'), boton('Agua', 'agua'), boton('Saneamiento', 'saneo'))));

  const rayo = new THREE.Raycaster(), raton = new THREE.Vector2(); let abajo = null;
  renderer.domElement.addEventListener('pointerdown', (ev) => { abajo = [ev.clientX, ev.clientY]; });
  renderer.domElement.addEventListener('pointerup', (ev) => {
    if (!abajo || Math.hypot(ev.clientX - abajo[0], ev.clientY - abajo[1]) > 5) return;
    const r = renderer.domElement.getBoundingClientRect(); raton.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); rayo.setFromCamera(raton, cam);
    const hit = rayo.intersectObjects(elegibles, false)[0]; let o = hit?.object; while (o && !o.userData.el) o = o.parent;
    if (!o) { info.style.display = 'none'; return; }
    const e = o.userData.el, k = cat(e.tipo);
    info.replaceChildren(h('h3', {}, e.nombre || k.nombre), h('p', { class: 'suave' }, `${k.w} × ${k.d} m · fase ${e.fase}`), k.pax ? h('p', {}, `${k.pax} plazas · ${eur(k.precio)} por noche`) : null, h('p', {}, 'Inversión: ' + eur(k.coste)), k.plano ? h('a', { href: '#planos/' + e.tipo }, 'Ver plano detallado') : null);
    info.style.display = 'block';
  });
  const ajusta = () => { const w = cont.clientWidth, hh = cont.clientHeight; if (!w || !hh) return; renderer.setSize(w, hh); cam.aspect = w / hh; cam.updateProjectionMatrix(); };
  const obs = new ResizeObserver(ajusta); obs.observe(cont);
  ambiente(); ajusta(); mira(vistas['Aérea']);
  let vivo = true; (function bucle() { if (!vivo) return; ctl.update(); renderer.render(escena, cam); requestAnimationFrame(bucle); })();
  return () => { vivo = false; obs.disconnect(); ctl.dispose(); renderer.dispose(); escena.traverse((o) => { o.geometry?.dispose?.(); }); };
}
