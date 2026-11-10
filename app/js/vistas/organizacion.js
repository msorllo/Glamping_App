import { E, guardar, nEsc, NOMBRE_ESC } from '../estado.js';
import { h, eur, num, pestanas, esc } from '../ui.js';

let activa = 'equipo';
const COLS = ['Por hacer', 'En marcha', 'Hecho'];
const COLOR = ['#586b3a', '#2f7f9a', '#6d6f60', '#bd5d3a', '#d69a2d', '#3f8fb0', '#7a4fb5'];
const PROTOCOLOS = [
  ['Llegada de un huésped', ['Mensaje automático el día anterior con ubicación, hora y normas.', 'Unidad revisada y climatizada 1 hora antes.', 'Recepción en el bar: registro de viajeros en la tableta y cobro de extras.', 'Acompañar a la unidad y explicar luz, agua caliente, wifi y silencio nocturno.', 'Ofrecer reserva de cena, cesta de desayuno y actividad.']],
  ['Cambio de unidad (35-50 min)', ['Ventilar y retirar lencería en bolsa cerrada.', 'Baño completo: sanitarios, ducha, espejo, reposición.', 'Hacer cama con lencería planchada; revisar colchón y protector.', 'Suelo, tarima exterior y mobiliario de terraza.', 'Comprobar luces, enchufes, mando de clima y cierre de puerta.', 'Foto de control en el móvil y aviso de «lista» a recepción.']],
  ['Piscina, cada día', ['Medir cloro libre y pH al abrir y a media tarde; anotar en el libro.', 'Limpiar skimmers, pasar limpiafondos, revisar nivel.', 'Comprobar aro, botiquín, duchas y cierre de la puerta.', 'Socorrista presente durante todo el horario de baño.', 'Cerrar el recinto con llave fuera de horario.']],
  ['Apertura y cierre del restaurante', ['Temperaturas de cámaras anotadas al abrir y al cerrar.', 'Recepción de mercancía con control de etiquetas y caducidades.', 'Carta de alérgenos visible y actualizada.', 'Limpieza de planchas, campana y suelos al cierre.', 'Separación de residuos y vaciado del separador de grasas semanal.']],
  ['Viento, tormenta o calor extremo', ['Aviso de viento fuerte: recoger sombrillas, toldos y mobiliario ligero; revisar tensores de tiendas.', 'Rachas muy fuertes: realojar a los huéspedes de tiendas bell en unidades rígidas.', 'Tormenta eléctrica: desalojar la piscina.', 'Ola de calor: mallas de sombreo puestas, clima encendido antes de la llegada, agua fría en recepción.']],
  ['Incendio o evacuación', ['Llamar al 112 y dar la ubicación exacta de la finca.', 'Cortar gas y electricidad general desde la caseta técnica.', 'Avisar unidad por unidad y dirigir a todos al punto de reunión del aparcamiento.', 'Pasar lista con el registro de huéspedes del día.', 'En riesgo extremo de incendio forestal: prohibido cualquier fuego, barbacoa o vela.']],
  ['Mantenimiento semanal', ['Depuradora: soplante, olores, nivel de lodos.', 'Depósito y cloración: nivel de cloro y limpieza de filtros.', 'Paneles solares: limpieza si hay polvo; revisar producción en la app del inversor.', 'Tensado de lonas y revisión de anclajes.', 'Riego por goteo, poda de seguridad y desbroce de la franja perimetral.', 'Extintores y luces de emergencia a la vista y sin obstáculos.']],
];

export default function (raiz) {
  const n = nEsc(), cuerpo = h('div');
  const pinta = () => {
    const vistas = {
      equipo: () => {
        const P = E.eco.personal.filter((p) => p.fte[n - 1] > 0), total = P.reduce((a, p) => a + p.fte[n - 1], 0);
        const arbol = `<svg viewBox="0 0 900 ${P.length > 4 ? 250 : 170}" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial,sans-serif"><rect x="350" y="8" width="200" height="50" rx="10" fill="#586b3a"/><text x="450" y="30" fill="#fff" font-size="13" font-weight="600" text-anchor="middle">Dirección</text><text x="450" y="47" fill="#dfe7cf" font-size="11" text-anchor="middle">Socios: reservas, cuentas y calidad</text>` +
          P.filter((p) => !p.socio).map((p, i, arr) => { const porFila = Math.min(4, arr.length), fila = Math.floor(i / 4), col = i % 4, enFila = Math.min(4, arr.length - fila * 4), x = 450 + (col - (enFila - 1) / 2) * 215 - 97, y = 95 + fila * 78; return `<line x1="450" y1="58" x2="${x + 97}" y2="${y}" stroke="#b9a88a" stroke-width="1.5"/><rect x="${x}" y="${y}" width="194" height="52" rx="9" fill="#fffdf8" stroke="${COLOR[i % 7]}" stroke-width="2"/><text x="${x + 97}" y="${y + 22}" font-size="12.5" font-weight="600" text-anchor="middle" fill="#26281f">${esc(p.rol)}</text><text x="${x + 97}" y="${y + 40}" font-size="11" text-anchor="middle" fill="#6d6f60">${num(p.fte[n - 1], 1)} jornada(s)</text>`; }).join('') + '</svg>';
        return [
          h('div', { class: 'tarjeta' }, h('h2', {}, `Equipo en el escenario ${NOMBRE_ESC[n].toLowerCase()}: ${num(total, 1)} jornadas completas`), h('div', { html: arbol }),
            h('p', { class: 'suave' }, 'Las jornadas y sueldos se editan en Economía → Gastos y personal. En temporada baja el equipo se reduce a dirección, limpieza y mantenimiento; cocina y sala se refuerzan de junio a septiembre.')),
          h('div', { class: 'tarjeta' }, h('h2', {}, 'Un día de temporada alta'),
            h('div', { class: 'horario' }, h('div', { class: 'f' }, h('span'), h('div', { style: 'display:flex;font-size:10.5px;color:var(--suave)' }, Array.from({ length: 9 }, (_, i) => h('span', { style: 'flex:1' }, (6 + i * 2) + ' h')))),
              E.turnos.map((t, i) => h('div', { class: 'f' }, h('span', {}, t.rol), h('div', { class: 'pista' }, t.tramos.map(([a, b, que]) => h('i', { style: `left:${(a - 6) / 18 * 100}%;width:${(b - a) / 18 * 100}%;background:${COLOR[i % 7]}`, title: `${que}: ${a} a ${b} h` }, que)))))),
            h('p', { class: 'suave', style: 'margin-top:10px' }, 'Salida hasta las 12 h y entrada desde las 16 h: esas cuatro horas son la ventana de limpieza. Silencio de 24 a 8 h.')),
        ];
      },
      tareas: () => [h('div', { class: 'kanban' }, COLS.map((nombre, c) => h('div', {}, h('b', {}, `${nombre} (${E.tareas.filter((t) => t.col === c).length})`),
        E.tareas.filter((t) => t.col === c).map((t) => h('div', { class: 't' },
          h('input', { type: 'text', value: t.t, oninput: (e) => { t.t = e.target.value; guardar('tareas'); } }),
          h('div', { class: 'fila' }, h('input', { type: 'text', value: t.quien, placeholder: 'Responsable', style: 'max-width:120px', oninput: (e) => { t.quien = e.target.value; guardar('tareas'); } }),
            h('span', {}, c > 0 ? h('button', { class: 'b mini', title: 'Mover atrás', onclick: () => { t.col--; guardar('tareas'); pinta(); } }, '←') : null, c < 2 ? h('button', { class: 'b mini', title: 'Mover adelante', onclick: () => { t.col++; guardar('tareas'); pinta(); } }, '→') : null,
              h('button', { class: 'x', title: 'Eliminar', onclick: () => { E.tareas.splice(E.tareas.indexOf(t), 1); guardar('tareas'); pinta(); } }, '×'))))),
        h('button', { class: 'b mini', style: 'margin-top:8px', onclick: () => { E.tareas.push({ t: 'Nueva tarea', quien: '', col: c, fase: n }); guardar('tareas'); pinta(); } }, '+ Añadir')))) ],
      protocolos: () => [h('div', { class: 'rejilla c2' }, PROTOCOLOS.map(([t, pasos]) => h('div', { class: 'tarjeta' }, h('h3', {}, t), h('ol', { style: 'padding-left:20px;margin:0' }, pasos.map((p) => h('li', { style: 'margin-bottom:4px' }, p))))))],
    };
    cuerpo.replaceChildren(pestanas([['equipo', 'Equipo y turnos'], ['tareas', 'Tablero de tareas'], ['protocolos', 'Protocolos']], activa, (id) => { activa = id; pinta(); }), h('div', { class: 'rejilla' }, vistas[activa]()));
  };
  raiz.append(cuerpo); pinta();
}
