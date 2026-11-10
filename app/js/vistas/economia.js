import { E, guardar, nEsc, NOMBRE_ESC, cat } from '../estado.js';
import { h, eur, num, pct, kpi, tabla, campo, pestanas } from '../ui.js';
import { explotacion, equilibrio } from '../calculo.js';
import { CATALOGO } from '../datos.js';

let activa = 'resultado';
const MES = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const tri = (clave, t) => [1, 2, 3].map((i) => ({ k: i - 1, t: `${t} ${NOMBRE_ESC[i].toLowerCase()}` }));

export default function (raiz) {
  const n = nEsc(), cuerpo = h('div');
  const pinta = () => {
    const x = explotacion(E, n), eq = equilibrio(E, n), eco = E.eco;
    const cambia = () => { guardar('eco'); }, repinta = () => { guardar('eco'); pinta(); };
    // las tablas con vectores por escenario se editan a través de filas planas
    const plana = (lista, campoVec, etiquetas) => ({ filas: lista, cols: etiquetas.map((t, i) => ({ t, tipo: 'ver', n: true, ver: (f) => h('input', { type: 'number', value: f[campoVec][i], oninput: (e) => { f[campoVec][i] = Number(e.target.value) || 0; cambia(); } }) })) });
    const vistas = {
      resultado: () => {
        const todos = [1, 2, 3].map((i) => ({ i, r: explotacion(E, i), r1: explotacion(E, i, 1), eq: equilibrio(E, i) }));
        const max = Math.max(...x.meses, 1);
        return [
          h('div', { class: 'rejilla c4' },
            kpi('Inversión total', eur(x.capex.total), eco.terreno.modo === 'compra' ? 'terreno incluido' : 'terreno en alquiler'),
            kpi('Ingresos anuales (sin IVA)', eur(x.neto), `año 3 · ocupación ${pct(x.ocupacion)}`),
            kpi('Resultado de explotación', eur(x.ebitda), `margen ${pct(x.margen)}`, x.ebitda > 0 ? 'ok' : 'mal'),
            kpi('Recuperación de la inversión', isFinite(x.retorno) ? num(x.retorno, 1) + ' años' : 'No se recupera', eq ? `equilibrio con ${pct(eq)} de ocupación` : 'no alcanza el equilibrio', x.retorno < 9 ? 'ok' : x.retorno < 14 ? 'aviso' : 'mal')),
          h('div', { class: 'tarjeta' }, h('h2', {}, 'Los tres escenarios, lado a lado'),
            h('div', { class: 'tablaWrap' }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, ''), todos.map((t) => h('th', { class: 'n' }, NOMBRE_ESC[t.i])))), h('tbody', {},
              [['Alojamientos', (t) => t.r.unidades], ['Plazas', (t) => t.r.plazas], ['Inversión total', (t) => eur(t.r.capex.total)], ['Aportación propia', (t) => eur(t.r.aportacion)], ['Préstamo', (t) => eur(t.r.principal)],
                ['Ingresos año 1', (t) => eur(t.r1.neto)], ['Ingresos año 3', (t) => eur(t.r.neto)], ['Gastos año 3', (t) => eur(t.r.totalGastos)], ['Resultado de explotación año 1', (t) => eur(t.r1.ebitda)], ['Resultado de explotación año 3', (t) => eur(t.r.ebitda)],
                ['Cuota anual del préstamo', (t) => eur(t.r.cuota)], ['Caja libre año 3', (t) => eur(t.r.flujo)], ['Ocupación de equilibrio', (t) => t.eq ? pct(t.eq) : 'No llega'], ['Años para recuperar', (t) => isFinite(t.r.retorno) ? num(t.r.retorno, 1) : '—']]
                .map(([et, fn]) => h('tr', {}, h('td', {}, et), todos.map((t) => h('td', { class: 'n', style: t.i === n ? 'font-weight:700' : '' }, fn(t))))))))),
          h('div', { class: 'rejilla c2' },
            h('div', { class: 'tarjeta' }, h('h3', {}, `Cuenta de explotación · año 3 · ${NOMBRE_ESC[n]}`),
              h('table', {}, h('tbody', {}, Object.entries(x.ing).filter(([, v]) => v > 0).map(([k, v]) => h('tr', {}, h('td', { class: 'cap' }, k), h('td', { class: 'n' }, eur(v)))), h('tr', { class: 'total' }, h('td', {}, 'Ingresos'), h('td', { class: 'n' }, eur(x.neto))),
                Object.entries(x.gastos).filter(([, v]) => v > 0).map(([k, v]) => h('tr', {}, h('td', { class: 'cap' }, k), h('td', { class: 'n' }, '− ' + eur(v)))), h('tr', { class: 'total' }, h('td', {}, 'Resultado de explotación'), h('td', { class: 'n' }, eur(x.ebitda)))))),
            h('div', { class: 'tarjeta' }, h('h3', {}, 'Ingresos mes a mes (miles de €)'), h('div', { class: 'barras', style: 'margin:22px 0 26px' }, x.meses.map((v, i) => h('div', { style: `height:${v / max * 100}%;background:${v / max > 0.75 ? 'var(--terra)' : v / max > 0.4 ? 'var(--oliva)' : '#a9b58f'}` }, h('b', {}, num(v / 1000)), h('span', {}, MES[i])))),
              h('p', { class: 'suave' }, 'Julio y agosto concentran los ingresos. El objetivo comercial es subir la ocupación de primavera, otoño y fines de semana de invierno, que es donde está el margen que falta.'))),
          x.ebitda <= 0 ? h('div', { class: 'nota rojo' }, 'Con estas cifras el escenario no cubre gastos. Es lo normal con pocas unidades si se paga todo el personal: o los socios trabajan sin sueldo al principio (casilla en «Gastos y personal»), o se pasa cuanto antes a la fase siguiente.') : null,
        ];
      },
      inversion: () => [
        h('div', { class: 'rejilla c4' }, kpi('Unidades e instalaciones', eur(x.capex.sumaEl)), kpi('Partidas generales', eur(x.capex.sumaGen)), kpi('Imprevistos y tasas', eur(x.capex.contingencia + x.capex.tasas)), kpi('Terreno', eur(x.capex.terreno))),
        h('div', { class: 'tarjeta' }, h('h3', {}, `Elementos del plano · escenario ${NOMBRE_ESC[n]}`), h('p', { class: 'suave' }, 'Las unidades salen del plano general. Cambia aquí el coste unitario; para añadir o quitar unidades, usa el plano.'),
          h('div', { class: 'tablaWrap' }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Elemento'), h('th', { class: 'n' }, 'Uds.'), h('th', { class: 'n' }, 'Coste unitario (€)'), h('th', { class: 'n' }, 'Importe'))), h('tbody', {},
            Object.entries(CATALOGO).filter(([t]) => E.elementos.some((e) => e.fase <= n && e.tipo === t)).map(([t]) => { const k = cat(t), u = E.elementos.filter((e) => e.fase <= n && e.tipo === t).length; return h('tr', {}, h('td', {}, k.nombre), h('td', { class: 'n' }, u), h('td', { class: 'n', style: 'width:130px' }, h('input', { type: 'number', value: k.coste, onchange: (e) => { (E.catalogo[t] ||= {}).coste = Number(e.target.value) || 0; repinta(); } })), h('td', { class: 'n' }, eur(u * k.coste))); }),
            h('tr', { class: 'total' }, h('td', { colspan: 3 }, 'Total elementos'), h('td', { class: 'n' }, eur(x.capex.sumaEl))))))),
        h('div', { class: 'tarjeta' }, h('h3', {}, 'Partidas generales: lo que se añade en cada fase (€)'),
          tabla({ filas: eco.capexGeneral, cols: [{ k: 'concepto', t: 'Concepto' }, ...plana(eco.capexGeneral, 'f', ['Fase 1', 'Fase 2', 'Fase 3']).cols.map((c) => ({ ...c, w: 100 }))], alCambiar: cambia, nueva: () => ({ concepto: 'Nueva partida', f: [0, 0, 0] }) }),
          h('div', { class: 'rejilla c2', style: 'margin-top:12px' }, h('div', {}, campo('Imprevistos (% sobre la obra)', eco, 'contingenciaPct', repinta)), h('div', {}, campo('Tasas, impuesto de obras y canon (%)', eco, 'tasasObraPct', repinta)))),
      ],
      ingresos: () => [
        h('div', { class: 'tarjeta' }, h('h3', {}, 'Temporadas'), tabla({ filas: eco.temporadas, borrar: false, alCambiar: cambia, cols: [{ k: 'nombre', t: 'Temporada' }, { k: 'dias', t: 'Días', tipo: 'num', w: 80 }, { k: 'ocup', t: 'Ocupación objetivo (%)', tipo: 'num', w: 150 }, { k: 'mult', t: 'Multiplicador de precio', tipo: 'num', w: 150 }] }),
          h('p', { class: 'suave', style: 'margin-top:8px' }, `Con estos datos: ${num(x.noches)} noches vendidas al año, precio medio ${eur(x.adr)} y ocupación media ${pct(x.ocupacion)}.`)),
        h('div', { class: 'tarjeta' }, h('h3', {}, 'Precio base por noche (IVA incluido)'),
          h('div', { class: 'tablaWrap' }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Alojamiento'), h('th', { class: 'n' }, 'Plazas'), h('th', { class: 'n' }, 'Precio base'), eco.temporadas.map((t) => h('th', { class: 'n' }, t.nombre.split(' ')[0])))), h('tbody', {},
            Object.entries(CATALOGO).filter(([, k]) => k.grupo === 'alojamiento').map(([t]) => { const k = cat(t); return h('tr', {}, h('td', {}, k.nombre), h('td', { class: 'n' }, k.pax), h('td', { class: 'n', style: 'width:110px' }, h('input', { type: 'number', value: k.precio, onchange: (e) => { (E.catalogo[t] ||= {}).precio = Number(e.target.value) || 0; repinta(); } })), eco.temporadas.map((s) => h('td', { class: 'n' }, eur(k.precio * s.mult)))); }))))),
        h('div', { class: 'rejilla c2' },
          h('div', { class: 'tarjeta' }, h('h3', {}, 'Arranque y otros ingresos'), campo('Año 1: % de la ocupación objetivo', eco.rampa, 0, repinta), campo('Año 2: % de la ocupación objetivo', eco.rampa, 1, repinta), campo('Plazas ocupadas por unidad vendida (0-1)', eco, 'llenado', repinta), campo('IVA medio (%)', eco, 'iva', repinta),
            campo('Eventos al año', eco.eventos, 'n', repinta), campo('Ingreso medio por evento (€)', eco.eventos, 'ingreso', repinta), campo('Margen de los eventos (%)', eco.eventos, 'margen', repinta), campo('Spa: gasto por huésped y noche (€)', eco.spa, 'ticket', repinta)),
          h('div', { class: 'tarjeta' }, h('h3', {}, 'Restauración y actividades por escenario'),
            tabla({ borrar: false, alCambiar: cambia, filas: [{ c: 'Clientes externos por semana', v: eco.fb.cubiertosSemana }, { c: 'Actividades: € por huésped y noche', v: eco.act.ticket }], cols: [{ k: 'c', t: 'Concepto', tipo: 'ver', ver: (f) => f.c }, ...['Mínimo', 'Medio', 'Completo'].map((t, i) => ({ t, tipo: 'ver', n: true, w: 90, ver: (f) => h('input', { type: 'number', value: f.v[i], oninput: (e) => { f.v[i] = Number(e.target.value) || 0; cambia(); } }) }))] }),
            h('p', { class: 'suave', style: 'margin-top:8px' }, 'Los tickets de restauración se editan en «Cómo funciona → Restauración».'))),
      ],
      gastos: () => [
        h('div', { class: 'tarjeta' }, h('h3', {}, 'Personal: jornadas completas por escenario'),
          tabla({ filas: eco.personal, alCambiar: cambia, nueva: () => ({ rol: 'Nuevo puesto', socio: false, coste: 23000, fte: [0, 0, 0] }), cols: [{ k: 'rol', t: 'Puesto' }, { k: 'socio', t: 'Socio', tipo: 'chk', w: 50 }, { k: 'coste', t: 'Coste empresa anual (€)', tipo: 'num', w: 150 }, ...plana(eco.personal, 'fte', ['Mínimo', 'Medio', 'Completo']).cols.map((c) => ({ ...c, w: 85 }))] }),
          h('label', { style: 'display:flex;gap:8px;align-items:center;margin-top:10px' }, h('input', { type: 'checkbox', checked: eco.sociosCobran, onchange: (e) => { eco.sociosCobran = e.target.checked; repinta(); } }), 'Los socios cobran sueldo (desmárcalo para ver el arranque con socios sin nómina)'),
          h('p', { class: 'suave' }, `Coste de personal en el escenario actual: ${eur(x.gastos.personal)}.`)),
        h('div', { class: 'tarjeta' }, h('h3', {}, 'Gastos fijos anuales (€)'), tabla({ filas: eco.fijos, alCambiar: cambia, nueva: () => ({ concepto: 'Nuevo gasto', imp: [0, 0, 0] }), cols: [{ k: 'concepto', t: 'Concepto' }, ...plana(eco.fijos, 'imp', ['Mínimo', 'Medio', 'Completo']).cols.map((c) => ({ ...c, w: 100 }))] })),
        h('div', { class: 'tarjeta' }, h('h3', {}, 'Gastos variables'), h('div', { class: 'rejilla c2' },
          h('div', {}, campo('Limpieza y lavandería por noche vendida (€)', eco.variable, 'limpieza', repinta), campo('Reservas que entran por portales (%)', eco.variable, 'otaPct', repinta), campo('Comisión de los portales (%)', eco.variable, 'otaComision', repinta)),
          h('div', {}, campo('Mantenimiento (% de la inversión en elementos)', eco.variable, 'mantenimientoPct', repinta), campo('Marketing (% de los ingresos)', eco.variable, 'marketingPct', repinta)))),
      ],
      terreno: () => [
        h('div', { class: 'rejilla c2' },
          h('div', { class: 'tarjeta' }, h('h3', {}, 'Terreno'),
            h('div', { class: 'campo' }, h('label', {}, 'Fórmula'), h('select', { onchange: (e) => { eco.terreno.modo = e.target.value; repinta(); } }, [['compra', 'Compra'], ['alquiler', 'Alquiler']].map(([v, t]) => h('option', { value: v, selected: eco.terreno.modo === v }, t)))),
            campo('Superficie (m²)', eco.terreno, 'm2', repinta), campo('Precio de compra (€/m²)', eco.terreno, 'precioM2', repinta), campo('Gastos de compra: notaría, impuestos (%)', eco.terreno, 'gastosCompra', repinta), campo('Alquiler anual (€)', eco.terreno, 'alquilerAnual', repinta),
            h('p', { class: 'suave' }, `Comprar cuesta ${eur(eco.terreno.m2 * eco.terreno.precioM2 * (1 + eco.terreno.gastosCompra / 100))}. Alquilando, ese dinero no se inmoviliza, pero el contrato debe durar al menos 20-25 años e inscribirse, porque la inversión se queda en la finca.`)),
          h('div', { class: 'tarjeta' }, h('h3', {}, 'Financiación'), campo('Subvenciones a fondo perdido (€)', eco.fin, 'subvencion', repinta), campo('Parte financiada con préstamo (%)', eco.fin, 'pct', repinta), campo('Interés anual (%)', eco.fin, 'interes', repinta), campo('Plazo (años)', eco.fin, 'anios', repinta),
            h('table', {}, h('tbody', {}, [['Inversión total', x.capex.total], ['Subvenciones', -eco.fin.subvencion], ['Préstamo', x.principal], ['Aportación de los socios', x.aportacion], ['Cuota anual', x.cuota], ['Caja libre tras la cuota (año 3)', x.flujo]].map(([t, v]) => h('tr', {}, h('td', {}, t), h('td', { class: 'n' }, eur(v)))))))),
      ],
    };
    cuerpo.replaceChildren(
      pestanas([['resultado', 'Resultado'], ['inversion', 'Inversión'], ['ingresos', 'Ingresos y precios'], ['gastos', 'Gastos y personal'], ['terreno', 'Terreno y financiación']], activa, (id) => { activa = id; pinta(); }),
      h('div', { class: 'rejilla' }, vistas[activa]().filter(Boolean)),
      activa !== 'resultado' ? h('div', { class: 'barra', style: 'margin-top:14px' }, h('button', { class: 'b p', onclick: () => { activa = 'resultado'; pinta(); } }, 'Ver el resultado con estos cambios')) : '');
  };
  raiz.append(h('div', { class: 'nota' }, 'Modelo orientativo para decidir, no un plan de negocio auditado. Todas las cifras son editables: sustitúyelas por presupuestos reales en cuanto los tengas.'), cuerpo);
  pinta();
}
