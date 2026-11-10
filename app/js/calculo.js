// Cálculos puros (sin DOM): inversión, cuenta de explotación, energía, agua y cumplimiento del plano.
import { CATALOGO } from './datos.js';

const c = (E, tipo) => ({ ...CATALOGO[tipo], ...(E.catalogo?.[tipo] || {}) });
const act = (E, n) => E.elementos.filter((e) => e.fase <= n);
const hay = (E, n, tipo) => act(E, n).some((e) => e.tipo === tipo);

export function capex(E, n) {
  const porTipo = {};
  for (const e of act(E, n)) { const k = c(E, e.tipo); (porTipo[e.tipo] ||= { concepto: k.nombre, grupo: k.grupo, uds: 0, unit: k.coste, importe: 0 }); porTipo[e.tipo].uds++; porTipo[e.tipo].importe += k.coste; }
  const elementos = Object.values(porTipo);
  const generales = E.eco.capexGeneral.map((g) => ({ concepto: g.concepto, importe: g.f.slice(0, n).reduce((a, b) => a + b, 0) }));
  const sumaEl = elementos.reduce((a, b) => a + b.importe, 0);
  const sumaGen = generales.reduce((a, b) => a + b.importe, 0);
  const obra = sumaEl + sumaGen;
  const contingencia = obra * E.eco.contingenciaPct / 100;
  const tasas = sumaEl * E.eco.tasasObraPct / 100;
  const t = E.eco.terreno;
  const terreno = t.modo === 'compra' ? t.m2 * t.precioM2 * (1 + t.gastosCompra / 100) : 0;
  const total = obra + contingencia + tasas + terreno;
  const grupos = {};
  for (const e of elementos) grupos[e.grupo] = (grupos[e.grupo] || 0) + e.importe;
  return { elementos, generales, sumaEl, sumaGen, obra, contingencia, tasas, terreno, total, grupos };
}

const MES_TEMP = ['baja', 'baja', 'baja', 'media', 'media', 'media', 'alta', 'alta', 'media', 'media', 'baja', 'baja'];
const DIAS_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Cuenta de explotación de un año. anio = 1..3 (rampa de arranque); factor multiplica la ocupación (para el punto de equilibrio). */
export function explotacion(E, n, anio = 3, factor = 1) {
  const eco = E.eco, rampa = (eco.rampa[anio - 1] ?? 100) / 100;
  const unidades = act(E, n).filter((e) => c(E, e.tipo).grupo === 'alojamiento');
  let ingAloj = 0, noches = 0, paxNoches = 0, nochesPosibles = 0, plazas = 0, limpieza = 0;
  const porTemp = {};
  for (const t of eco.temporadas) porTemp[t.id] = { ing: 0, noches: 0 };
  for (const u of unidades) {
    const k = c(E, u.tipo); plazas += k.pax;
    for (const t of eco.temporadas) {
      const oc = Math.min(1, t.ocup / 100 * rampa * factor), nn = t.dias * oc;
      limpieza += nn * (k.limpieza ?? eco.variable.limpieza);
      ingAloj += nn * k.precio * t.mult; noches += nn; paxNoches += nn * k.pax * eco.llenado * (k.gasto ?? 1); nochesPosibles += t.dias;
      porTemp[t.id].ing += nn * k.precio * t.mult; porTemp[t.id].noches += nn;
    }
  }
  const rest = hay(E, n, 'restaurante'), kio = hay(E, n, 'kiosco');
  const fbHuesped = paxNoches * (rest ? eco.fb.ticketRest : kio ? eco.fb.ticketKiosco : 0);
  const fbExt = rest ? eco.fb.cubiertosSemana[n - 1] * eco.fb.semanas * eco.fb.ticketExt * Math.min(1, rampa * factor + 0.2) : 0;
  const ingEv = hay(E, n, 'eventos') ? eco.eventos.n * eco.eventos.ingreso * Math.min(1, rampa * factor) : 0;
  const ingAct = paxNoches * eco.act.ticket[n - 1];
  const ingSpa = hay(E, n, 'spa') ? paxNoches * eco.spa.ticket : 0;
  const bruto = ingAloj + fbHuesped + fbExt + ingEv + ingAct + ingSpa;
  const q = 1 + eco.iva / 100;
  const ing = { alojamiento: ingAloj / q, restauracion: (fbHuesped + fbExt) / q, eventos: ingEv / q, actividades: ingAct / q, spa: ingSpa / q };
  const neto = bruto / q;

  const cx = capex(E, n);
  const personal = eco.personal.reduce((a, p) => a + (p.socio && !eco.sociosCobran ? 0 : p.fte[n - 1] * p.coste), 0);
  const gastos = {
    personal,
    'limpieza y lavandería': limpieza,
    'comisiones de portales': ing.alojamiento * eco.variable.otaPct / 100 * eco.variable.otaComision / 100,
    'materia prima restauración': ing.restauracion * eco.fb.cogs / 100,
    'coste directo eventos': ing.eventos * (1 - eco.eventos.margen / 100),
    'coste directo actividades y spa': ing.actividades * (1 - eco.act.margen / 100) + ing.spa * (1 - eco.spa.margen / 100),
    'gastos fijos': eco.fijos.reduce((a, f) => a + f.imp[n - 1], 0),
    mantenimiento: cx.sumaEl * eco.variable.mantenimientoPct / 100,
    marketing: neto * eco.variable.marketingPct / 100,
    'alquiler del terreno': eco.terreno.modo === 'alquiler' ? eco.terreno.alquilerAnual : 0,
  };
  const totalGastos = Object.values(gastos).reduce((a, b) => a + b, 0);
  const ebitda = neto - totalGastos;
  const aFinanciar = Math.max(0, cx.total - eco.fin.subvencion);
  const principal = aFinanciar * eco.fin.pct / 100, i = eco.fin.interes / 100, N = eco.fin.anios;
  const cuota = principal > 0 ? (i > 0 ? principal * i / (1 - Math.pow(1 + i, -N)) : principal / N) : 0;
  // reparto mensual de ingresos
  const meses = MES_TEMP.map((id, m) => {
    const t = eco.temporadas.find((x) => x.id === id) || eco.temporadas[0];
    const diasTemp = MES_TEMP.reduce((a, x, j) => a + (x === id ? DIAS_MES[j] : 0), 0);
    return (porTemp[id]?.ing || 0) / q * DIAS_MES[m] / diasTemp * (neto / (ing.alojamiento || 1));
  });
  return { unidades: unidades.length, plazas, noches, paxNoches, ocupacion: nochesPosibles ? noches / nochesPosibles : 0, adr: noches ? ingAloj / noches : 0,
    bruto, neto, ing, gastos, totalGastos, ebitda, margen: neto ? ebitda / neto : 0, capex: cx, aportacion: aFinanciar - principal, principal, cuota,
    flujo: ebitda - cuota, retorno: ebitda > 0 ? cx.total / ebitda : Infinity, meses };
}

/** Ocupación media anual con la que el resultado de explotación es cero. */
export function equilibrio(E, n) {
  let a = 0, b = 3;
  if (explotacion(E, n, 3, b).ebitda < 0) return null;
  for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (explotacion(E, n, 3, m).ebitda > 0) b = m; else a = m; }
  return explotacion(E, n, 3, b).ocupacion;
}

/** Balance energético de un día de verano con la ocupación de temporada alta. */
export function energia(E, n) {
  const s = E.sis, alta = E.eco.temporadas[0].ocup / 100, lista = [];
  const por = {};
  for (const e of act(E, n)) { const k = c(E, e.tipo); if (!k.kwh) continue; const kwh = k.kwh * (k.grupo === 'alojamiento' ? alta : 1); (por[e.tipo] ||= { nombre: k.nombre, uds: 0, kwh: 0 }); por[e.tipo].uds++; por[e.tipo].kwh += kwh; }
  lista.push(...Object.values(por), { nombre: 'Alumbrado exterior, wifi y oficina', uds: 1, kwh: 4 + n * 2 });
  const consumo = lista.reduce((a, b) => a + b.kwh, 0);
  const kwpNecesario = consumo * s.coberturaFV / 100 / (s.hsp * s.pr);
  const kwpPlano = act(E, n).reduce((a, e) => a + (c(E, e.tipo).kwp || 0), 0);
  const batNecesaria = consumo * s.autonomiaNoche / 100;
  const extra = (k) => E.eco.capexGeneral.reduce((a, g) => a + (g[k] ? g[k].slice(0, n).reduce((x, y) => x + y, 0) : 0), 0);
  const batPlano = act(E, n).reduce((a, e) => a + (c(E, e.tipo).kwhBat || 0), 0) + extra('bat');
  return { lista, consumo, kwpNecesario, kwpPlano, produccion: kwpPlano * s.hsp * s.pr, batNecesaria, batPlano, m2Paneles: kwpNecesario * 5 };
}

/** Balance de agua y saneamiento de un día punta. */
export function agua(E, n) {
  const s = E.sis, alta = E.eco.temporadas[0].ocup / 100;
  const plazas = act(E, n).reduce((a, e) => a + (c(E, e.tipo).pax || 0), 0);
  const huespedes = plazas * alta * E.eco.llenado;
  const rest = hay(E, n, 'restaurante');
  const cubiertos = rest ? huespedes * 1.6 + E.eco.fb.cubiertosSemana[n - 1] / 6 : hay(E, n, 'kiosco') ? huespedes * 0.6 : 0;
  const personal = E.eco.personal.reduce((a, p) => a + p.fte[n - 1], 0);
  const piscina = hay(E, n, 'piscina') ? s.volPiscina * 1000 * s.renovPiscina / 100 : 0;
  const lista = [
    { nombre: 'Huéspedes (ducha, WC, lavabo)', l: huespedes * s.lPax },
    { nombre: 'Restauración', l: cubiertos * s.lCubierto },
    { nombre: 'Personal y limpieza', l: personal * 60 + huespedes * 15 },
    { nombre: 'Reposición de piscina y spa', l: piscina + (hay(E, n, 'spa') ? 300 : 0) },
    { nombre: 'Riego por goteo', l: s.lRiego * (0.6 + 0.2 * n) },
  ];
  const total = lista.reduce((a, b) => a + b.l, 0);
  const residual = lista[0].l + lista[1].l + lista[2].l;
  const he = Math.ceil(residual / 150);
  const m3Plano = act(E, n).reduce((a, e) => a + (c(E, e.tipo).m3 || 0), 0);
  const hePlano = act(E, n).reduce((a, e) => a + (c(E, e.tipo).he || 0), 0) + E.eco.capexGeneral.reduce((a, g) => a + (g.he ? g.he.slice(0, n).reduce((x, y) => x + y, 0) : 0), 0);
  return { lista, total, residual, he, hePlano, huespedes, cubiertos, m3Necesario: total * s.diasAutonomiaAgua / 1000, m3Plano, anual: total * 365 * 0.5 / 1000 };
}

// ---------- Geometría del plano ----------
export function caja(E, e) { // caja envolvente alineada con los ejes, teniendo en cuenta el giro
  const k = c(E, e.tipo), r = ((e.rot % 180) + 180) % 180, gira = r > 45 && r < 135;
  const w = gira ? k.d : k.w, d = gira ? k.w : k.d;
  return { x0: e.x - w / 2, y0: e.y - d / 2, x1: e.x + w / 2, y1: e.y + d / 2, w, d };
}
const hueco = (a, b) => Math.max(Math.max(a.x0 - b.x1, b.x0 - a.x1), Math.max(a.y0 - b.y1, b.y0 - a.y1));

export function cumplimiento(E, n) {
  const p = E.parcela, els = act(E, n), sup = p.ancho * p.fondo;
  let huella = 0, plazasCoche = 0, plazas = 0, uds = 0, libres = 0, supLibre = 0, supFija = 0;
  const fuera = [], juntas = [];
  const cajas = els.map((e) => ({ e, b: caja(E, e), k: c(E, e.tipo) }));
  for (const { e, b, k } of cajas) {
    if (!(k.kwp && els.some((o) => o.tipo === 'parking' && hueco(b, caja(E, o)) < 0))) huella += b.w * b.d;
    plazasCoche += k.plazas || 0; if (k.grupo === 'alojamiento') { plazas += k.pax; if (k.libre) { libres++; supLibre += b.w * b.d; } else { uds++; supFija += b.w * b.d / 0.7; } }
    if (b.x0 < p.retranqueo || b.y0 < p.retranqueo || b.x1 > p.ancho - p.retranqueo || b.y1 > p.fondo - p.retranqueo) fuera.push(e);
  }
  const al = cajas.filter((x) => x.k.grupo === 'alojamiento' && !x.k.libre);
  for (let i = 0; i < al.length; i++) for (let j = i + 1; j < al.length; j++) if (hueco(al[i].b, al[j].b) < p.sepUnidades) juntas.push([al[i].e, al[j].e]);
  const viales = E.viales.reduce((a, v) => a + v.ancho * v.pts.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - v.pts[i][0], q[1] - v.pts[i][1]), 0), 0);
  const ocup = (huella + viales) / sup;
  const sinBano = els.filter((e) => e.tipo === 'bell').length;
  const estancia = supFija + supLibre, cuotaFija = estancia ? supFija / estancia : 0, d = (v, n = 1) => v.toFixed(n).replace('.', ',');
  const estrechos = E.viales.filter((v) => v.ancho < 3.5 && !/paseo|senda/i.test(v.nombre));
  const pruebas = [
    { t: `Parcela de ${d(sup / 10000, 2)} ha (mínimo legal 0,50 ha en suelo rústico)`, ok: sup >= 5000 },
    { t: `Zona de estancia ${d(estancia / sup * 100)} % de la finca (máximo 75 %)`, ok: estancia / sup <= 0.75 },
    { t: `Unidades fijas: ${(cuotaFija * 100).toFixed(0)} % de la zona de estancia (máximo 60 %; si no, especialidad «bungaló park»)`, ok: cuotaFija <= 0.6 },
    { t: `Superficie ocupada ${d(ocup * 100)} % (objetivo propio: menos del ${p.ocupacionMax} %)`, ok: ocup * 100 <= p.ocupacionMax },
    { t: fuera.length ? `${fuera.length} elemento(s) invaden el retranqueo de ${p.retranqueo} m a lindes` : `Retranqueo de ${p.retranqueo} m a lindes respetado`, ok: !fuera.length },
    { t: juntas.length ? `${juntas.length} pareja(s) de unidades fijas a menos de ${p.sepUnidades} m` : `Separación mínima de ${p.sepUnidades} m entre unidades fijas`, ok: !juntas.length },
    { t: estrechos.length ? `${estrechos.length} vial(es) con menos de 3,5 m de ancho` : 'Viales rodados de 3,5 m o más', ok: !estrechos.length },
    { t: `${plazasCoche} plazas de aparcamiento para ${uds} unidades fijas (las parcelas aparcan dentro)`, ok: plazasCoche >= uds },
    { t: 'Bloque sanitario para tiendas sin baño y parcelas', ok: !(sinBano || libres) || els.some((e) => e.tipo === 'sanitarios') },
    { t: 'Depuradora y depósito de agua en el plano', ok: els.some((e) => e.tipo === 'depuradora') && els.some((e) => e.tipo === 'deposito') },
  ];
  return { sup, huella, viales, ocup, uds, libres, plazas, plazasCoche, fuera, juntas, pruebas, cuotaFija };
}

/** Punto más cercano de la red de viales (las redes enterradas van en zanja común bajo los viales). */
export function alVial(E, x, y) {
  let mejor = null;
  for (const v of E.viales) for (let i = 1; i < v.pts.length; i++) {
    const [ax, ay] = v.pts[i - 1], [bx, by] = v.pts[i], dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
    const px = ax + t * dx, py = ay + t * dy, d = Math.hypot(px - x, py - y);
    if (!mejor || d < mejor.d) mejor = { x: px, y: py, d };
  }
  return mejor;
}

/** Arbolado determinista que esquiva elementos y viales. */
export function arboles(E, n, cuantos = 150) {
  let s = 7; const azar = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const cajas = act(E, n).map((e) => caja(E, e)), out = [], p = E.parcela;
  for (let i = 0; i < cuantos * 5 && out.length < cuantos; i++) {
    const x = 3 + azar() * (p.ancho - 6), y = 3 + azar() * (p.fondo - 6), r = 1.6 + azar() * 1.6, tipo = azar() < 0.7 ? 'olivo' : 'algarrobo';
    if (cajas.some((b) => x > b.x0 - r - 1 && x < b.x1 + r + 1 && y > b.y0 - r - 1 && y < b.y1 + r + 1)) continue;
    if (alVial(E, x, y).d < r + 3) continue;
    if (out.some((o) => Math.hypot(o.x - x, o.y - y) < o.r + r + 1.5)) continue;
    out.push({ x, y, r, tipo });
  }
  return out;
}
