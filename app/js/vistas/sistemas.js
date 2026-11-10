import { E, guardar, nEsc, NOMBRE_ESC } from '../estado.js';
import { h, num, kpi, campo, pestanas, esc } from '../ui.js';
import { energia, agua } from '../calculo.js';

let activa = 'luz';
const AN = 168, AL = 58;
/** Esquema de cajas y flechas animadas. nodos: [id, x, y, título, detalle, color]; enlaces: [de, a, color, etiqueta] */
function esquema(nodos, enlaces, alto = 420) {
  const N = Object.fromEntries(nodos.map((n) => [n[0], n]));
  const borde = (a, b) => { const ax = a[1] + AN / 2, ay = a[2] + AL / 2, bx = b[1] + AN / 2, by = b[2] + AL / 2, dx = bx - ax, dy = by - ay, k = Math.min(Math.abs((AN / 2 + 4) / (dx || 1e-6)), Math.abs((AL / 2 + 4) / (dy || 1e-6))); return [ax + dx * k, ay + dy * k]; };
  let s = `<svg viewBox="0 0 980 ${alto}" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial,sans-serif"><defs>${['#d69a2d', '#2f7f9a', '#7a5a3a', '#586b3a', '#bd5d3a', '#6d6f60'].map((c) => `<marker id="m${c.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join('')}</defs>`;
  for (const [a, b, c = '#6d6f60', t] of enlaces) {
    const p = borde(N[a], N[b]), q = borde(N[b], N[a]);
    s += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${c}" stroke-width="2.5" class="flujo" marker-end="url(#m${c.slice(1)})"/>`;
    if (t) s += `<text x="${(p[0] + q[0]) / 2}" y="${(p[1] + q[1]) / 2 - 6}" font-size="11" text-anchor="middle" fill="${c}" paint-order="stroke" stroke="#fffdf8" stroke-width="4">${esc(t)}</text>`;
  }
  for (const [, x, y, t, d, c = '#586b3a'] of nodos) s += `<rect x="${x}" y="${y}" width="${AN}" height="${AL}" rx="9" fill="#fffdf8" stroke="${c}" stroke-width="2"/><rect x="${x}" y="${y}" width="6" height="${AL}" rx="3" fill="${c}"/><text x="${x + 16}" y="${y + 23}" font-size="13" font-weight="600" fill="#26281f">${esc(t)}</text><text x="${x + 16}" y="${y + 42}" font-size="11.5" fill="#6d6f60">${esc(d || '')}</text>`;
  return h('div', { class: 'lienzo', style: 'padding:8px', html: s + '</svg>' });
}
const filas = (lista, unidad, clave, dec = 0) => h('table', {}, h('tbody', {}, lista.map((f) => h('tr', {}, h('td', {}, f.nombre + (f.uds > 1 ? ` (×${f.uds})` : '')), h('td', { class: 'n' }, num(f[clave], dec) + ' ' + unidad)))));
const estado = (ok, bien, mal) => h('div', { class: 'nota ' + (ok ? 'verde' : 'rojo') }, ok ? bien : mal);

export default function (raiz) {
  const n = nEsc(), cuerpo = h('div');
  const pinta = () => {
    const en = energia(E, n), ag = agua(E, n), s = E.sis, cambia = () => { guardar('sis'); pinta(); };
    const A = '#d69a2d', B = '#2f7f9a', C = '#7a5a3a', V = '#586b3a', T = '#bd5d3a';
    const vistas = {
      luz: () => [
        h('div', { class: 'rejilla c4' }, kpi('Consumo en un día punta', num(en.consumo) + ' kWh'), kpi('Fotovoltaica necesaria', num(en.kwpNecesario, 1) + ' kWp', `≈ ${num(en.m2Paneles)} m² de paneles`), kpi('Fotovoltaica en el plano', num(en.kwpPlano) + ' kWp', '', en.kwpPlano >= en.kwpNecesario ? 'ok' : 'mal'), kpi('Baterías', num(en.batPlano) + ' kWh', `hacen falta ${num(en.batNecesaria)}`, en.batPlano >= en.batNecesaria * 0.95 ? 'ok' : 'aviso')),
        esquema([['fv', 20, 30, 'Pérgolas solares', `${num(en.kwpPlano)} kWp · ${num(en.produccion)} kWh/día`, A], ['bat', 20, 180, 'Baterías de litio', `${num(en.batPlano)} kWh para la noche`, A], ['gen', 20, 330, s.redElectrica ? 'Red eléctrica' : 'Generador de respaldo', s.redElectrica ? 'Apoyo y venta de excedentes' : 'Solo días nublados seguidos', '#6d6f60'],
          ['inv', 260, 180, 'Inversor híbrido', 'Caseta técnica', A], ['cg', 500, 180, 'Cuadro general', 'Diferenciales por zona', A],
          ['al', 780, 10, 'Alojamientos', 'Subcuadro en cada unidad', T], ['re', 780, 95, 'Bar y restaurante', 'Cámaras, lavado, horno', V], ['pi', 780, 180, 'Piscina y spa', 'Bombas en horas de sol', B], ['bo', 780, 265, 'Agua y depuradora', 'Bombeo, soplante', C], ['lu', 780, 350, 'Alumbrado y wifi', 'Balizas LED con sensor', '#6d6f60']],
        [['fv', 'inv', A, 'corriente continua'], ['bat', 'inv', A], ['gen', 'inv', '#6d6f60'], ['inv', 'cg', A, '230/400 V'], ['cg', 'al', A], ['cg', 're', A], ['cg', 'pi', A], ['cg', 'bo', A], ['cg', 'lu', A]]),
        estado(en.kwpPlano >= en.kwpNecesario, `La fotovoltaica del plano cubre el ${s.coberturaFV} % del consumo de un día punta de verano.`, `Faltan ${num(en.kwpNecesario - en.kwpPlano, 1)} kWp: añade una pérgola solar en el plano general o baja el objetivo de cobertura.`),
        h('div', { class: 'rejilla c2' },
          h('div', { class: 'tarjeta' }, h('h3', {}, 'Consumo por zonas (día punta)'), filas(en.lista, 'kWh', 'kwh')),
          h('div', { class: 'tarjeta' }, h('h3', {}, 'Parámetros'), campo('Horas de sol pico al día', s, 'hsp', cambia), campo('Rendimiento de la instalación', s, 'pr', cambia), campo('Cobertura solar objetivo (%)', s, 'coberturaFV', cambia), campo('Consumo nocturno a cubrir con baterías (%)', s, 'autonomiaNoche', cambia),
            h('label', { style: 'display:flex;gap:8px;align-items:center;margin-top:6px' }, h('input', { type: 'checkbox', checked: s.redElectrica, onchange: (e) => { s.redElectrica = e.target.checked; cambia(); } }), 'La finca tiene acometida a la red eléctrica'),
            h('p', { class: 'suave', style: 'margin-top:10px' }, 'Cómo se usa: de día los paneles alimentan todo y cargan las baterías; las bombas de piscina y el termo se programan en horas de sol. De noche se tira de batería. La cocción va con gas para no disparar la potencia.'))),
      ],
      agua: () => [
        h('div', { class: 'rejilla c4' }, kpi('Consumo en un día punta', num(ag.total / 1000, 1) + ' m³'), kpi('Consumo anual estimado', num(ag.anual) + ' m³', ag.anual < 7000 ? 'por debajo de 7.000 m³' : 'requiere concesión', ag.anual < 7000 ? 'ok' : 'aviso'), kpi('Depósito necesario', num(ag.m3Necesario, 1) + ' m³', `${s.diasAutonomiaAgua} días de reserva`), kpi('Depósito en el plano', num(ag.m3Plano) + ' m³', '', ag.m3Plano >= ag.m3Necesario ? 'ok' : 'mal')),
        esquema([['po', 20, 60, 'Pozo o red municipal', 'Bomba sumergida solar', B], ['de', 240, 60, 'Depósito', `${num(ag.m3Plano)} m³ en superficie`, B], ['tr', 460, 60, 'Tratamiento', 'Filtro, cloro y ultravioleta', B], ['gp', 460, 170, 'Grupo de presión', 'Variador, 3 bar', B],
          ['al', 780, 10, 'Alojamientos', 'Ducha, lavabo, inodoro', T], ['sa', 780, 95, 'Bloque sanitario', 'Grifería temporizada', '#6d6f60'], ['co', 780, 180, 'Cocina y bar', 'Agua de consumo humano', V], ['pi', 780, 265, 'Piscina y spa', 'Reposición diaria', B],
          ['ll', 20, 330, 'Lluvia de cubiertas', 'Canalones a aljibe', V], ['ri', 300, 330, 'Riego por goteo', 'Huerto y pantalla vegetal', V], ['acs', 240, 190, 'Agua caliente', 'Solar térmica y aerotermia', A]],
        [['po', 'de', B], ['de', 'tr', B], ['tr', 'gp', B], ['gp', 'al', B], ['gp', 'sa', B], ['gp', 'co', B], ['gp', 'pi', B], ['ll', 'ri', V], ['acs', 'gp', A]]),
        estado(ag.m3Plano >= ag.m3Necesario, 'El depósito del plano da la reserva de agua fijada.', `Falta capacidad: hacen falta ${num(ag.m3Necesario, 1)} m³ y hay ${num(ag.m3Plano)} m³. Añade un depósito en el plano general.`),
        h('div', { class: 'rejilla c2' },
          h('div', { class: 'tarjeta' }, h('h3', {}, `Consumo diario con ${num(ag.huespedes)} huéspedes`), filas(ag.lista, 'L', 'l')),
          h('div', { class: 'tarjeta' }, h('h3', {}, 'Parámetros'), campo('Litros por huésped y día', s, 'lPax', cambia), campo('Litros por cubierto', s, 'lCubierto', cambia), campo('Riego en verano (L/día)', s, 'lRiego', cambia), campo('Renovación diaria de piscina (%)', s, 'renovPiscina', cambia), campo('Días de reserva en depósito', s, 'diasAutonomiaAgua', cambia),
            h('p', { class: 'suave', style: 'margin-top:10px' }, 'El agua es el factor que más condiciona la elección de finca: sin pozo legalizado o red cercana, el proyecto se encarece mucho (cubas). El agua de consumo exige analíticas periódicas.'))),
      ],
      saneo: () => [
        h('div', { class: 'rejilla c4' }, kpi('Aguas residuales', num(ag.residual / 1000, 1) + ' m³/día'), kpi('Carga a depurar', num(ag.he) + ' hab. equiv.'), kpi('Depuradora en el plano', num(ag.hePlano) + ' hab. equiv.', '', ag.hePlano >= ag.he ? 'ok' : 'mal'), kpi('Vertido', 'Autorización', 'del organismo de cuenca')),
        esquema([['al', 20, 20, 'Alojamientos', 'Inodoro, ducha, lavabo', T], ['sa', 20, 110, 'Bloque sanitario', '', '#6d6f60'], ['co', 20, 200, 'Cocina', 'Pasa por separador de grasas', V], ['pi', 20, 290, 'Piscina', 'Lavado de filtros', B],
          ['cl', 290, 150, 'Colector enterrado', 'Por gravedad, bajo los viales', C], ['dp', 530, 150, 'Depuradora compacta', `Oxidación total · ${num(ag.hePlano)} h.e.`, C], ['fv', 780, 80, 'Filtro verde', 'Humedal de carrizo y lirios', V], ['rg', 780, 200, 'Riego enterrado', 'Pantalla vegetal y arbolado', V], ['lo', 530, 300, 'Lodos', 'Gestor autorizado, 1 vez al año', '#6d6f60']],
        [['al', 'cl', C], ['sa', 'cl', C], ['co', 'cl', C], ['pi', 'cl', C], ['cl', 'dp', C], ['dp', 'fv', V, 'agua depurada'], ['fv', 'rg', V], ['dp', 'lo', '#6d6f60']]),
        estado(ag.hePlano >= ag.he, 'La depuradora prevista tiene capacidad para la carga del escenario.', `La depuradora se queda corta: hace falta para ${num(ag.he)} habitantes equivalentes.`),
        h('div', { class: 'tarjeta' }, h('h3', {}, 'Cómo funciona'), h('p', {}, 'No habrá alcantarillado en suelo rústico, así que el glamping depura sus propias aguas. La depuradora se coloca en el punto más bajo de la finca para que todo llegue por gravedad, sin bombeos. Un soplante inyecta aire y las bacterias digieren la materia orgánica; el agua clarificada pasa por un filtro verde que termina de limpiarla y se infiltra regando la pantalla vegetal.'),
          h('p', {}, 'Mantenimiento: revisión mensual del soplante, vaciado de lodos una vez al año, limpieza semanal del separador de grasas y analítica del vertido según marque la autorización. Productos de limpieza biodegradables en todas las unidades.')),
      ],
      rest: () => {
        const rest = E.elementos.some((e) => e.fase <= n && e.tipo === 'restaurante');
        return [
          h('div', { class: 'rejilla c4' }, kpi('Formato', rest ? 'Restaurante' : 'Quiosco-bar'), kpi('Cubiertos en un día punta', num(ag.cubiertos)), kpi('Gasto por huésped y noche', (rest ? E.eco.fb.ticketRest : E.eco.fb.ticketKiosco) + ' €'), kpi('Clientes externos', rest ? E.eco.fb.cubiertosSemana[n - 1] + ' /semana' : 'No', rest ? `${E.eco.fb.ticketExt} € de ticket medio` : '')),
          esquema([['pr', 20, 30, 'Productores locales', 'Aceite, alcachofa, langostino', V], ['hu', 20, 170, 'Huerto propio', 'Hortalizas y aromáticas', V], ['al', 250, 100, 'Almacén y cámaras', 'Recepción y control', '#6d6f60'], ['co', 480, 100, rest ? 'Cocina' : 'Plancha y barra', rest ? 'Carta corta de brasa y arroces' : 'Desayunos, tapas, bocadillos', T],
            ['sa', 780, 10, 'Sala y terraza', rest ? '78 plazas' : '16 plazas', T], ['ce', 780, 100, 'Cesta de desayuno', 'Se deja en la puerta a las 8:30', A], ['ev', 780, 190, 'Eventos y catas', 'Menú cerrado por persona', A], ['ps', 780, 280, 'Bar de piscina', 'Bebidas y helados', B],
            ['cm', 250, 300, 'Compost', 'Restos vegetales', C], ['lv', 480, 300, 'Lavado', 'Retorno de sucio sin cruces', '#6d6f60']],
          [['pr', 'al', V], ['hu', 'al', V], ['al', 'co', '#6d6f60'], ['co', 'sa', T], ['co', 'ce', A], ['co', 'ev', A], ['co', 'ps', B], ['sa', 'lv', '#6d6f60'], ['lv', 'cm', C], ['cm', 'hu', C]]),
          h('div', { class: 'rejilla c2' },
            h('div', { class: 'tarjeta' }, h('h3', {}, 'Por qué da dinero'), h('ul', { style: 'padding-left:18px;margin:0' }, ['El huésped no tiene que coger el coche: cena y desayuna aquí.', 'La cesta de desayuno se vende con la reserva y casi no necesita personal.', 'Una carta corta (8-10 platos) reduce mermas y cocina con 1-2 personas.', 'Abrir a clientes externos los fines de semana llena la sala fuera de temporada.', 'Catas de aceite y vino con productores: margen alto y contenido para redes.'].map((t) => h('li', { style: 'margin-bottom:5px' }, t)))),
            h('div', { class: 'tarjeta' }, h('h3', {}, 'Parámetros'), campo('Gasto por huésped en quiosco (€)', E.eco.fb, 'ticketKiosco', cambia), campo('Gasto por huésped en restaurante (€)', E.eco.fb, 'ticketRest', cambia), campo('Ticket de cliente externo (€)', E.eco.fb, 'ticketExt', cambia), campo('Coste de materia prima (%)', E.eco.fb, 'cogs', cambia), campo('Semanas abierto al público', E.eco.fb, 'semanas', cambia))),
        ];
      },
      viaje: () => {
        const pasos = [['Descubre', 'Vídeo en Instagram, búsqueda en Google o una reseña', 'Perfil cuidado y ficha de Google'], ['Reserva', 'En la web propia, con extras: cesta, cata, jacuzzi', 'Motor de reservas y pago online'], ['Antes de llegar', 'Mensaje automático con ubicación, hora y normas', 'WhatsApp programado'], ['Llegada · 16 a 20 h', 'Aparca, recepción en el bar, paseo hasta la unidad', 'Registro de viajeros digital'],
          ['Tarde', 'Piscina, paseo, atardecer en la terraza', 'Bar de piscina'], ['Noche', 'Cena, observación de estrellas, silencio a las 24 h', 'Mirador y guía de cielo'], ['Mañana', 'Cesta de desayuno en la puerta, yoga o ruta', 'Reparto a las 8:30'], ['Salida · hasta las 12 h', 'Pago de extras y petición de reseña', 'Código de descuento directo'], ['Después', 'Correo con fotos y oferta para volver', 'Lista de correo propia']];
        return [h('div', { class: 'rejilla c3' }, pasos.map(([t, d, hta], i) => h('div', { class: 'tarjeta' }, h('span', { class: 'etq' }, 'Paso ' + (i + 1)), h('h3', { style: 'margin-top:6px' }, t), h('p', {}, d), h('p', { class: 'suave', style: 'font-size:12.5px' }, 'Herramienta: ' + hta)))),
          h('div', { class: 'nota' }, 'Regla de oro: cada paso debe poder hacerse sin que nadie esté pendiente del teléfono. Lo repetitivo se automatiza y el personal se dedica a acoger.')];
      },
    };
    cuerpo.replaceChildren(
      h('div', { class: 'barra' }, h('span', { class: 'etq f' + n }, `Escenario ${NOMBRE_ESC[n]}`), h('span', { class: 'suave' }, 'Los cálculos usan la ocupación de temporada alta y los elementos del plano general.')),
      pestanas([['luz', 'Electricidad'], ['agua', 'Agua'], ['saneo', 'Saneamiento'], ['rest', 'Restauración'], ['viaje', 'Recorrido del huésped']], activa, (id) => { activa = id; pinta(); }),
      h('div', { class: 'rejilla' }, vistas[activa]()));
  };
  raiz.append(cuerpo); pinta();
}
