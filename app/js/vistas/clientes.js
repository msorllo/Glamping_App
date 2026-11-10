import { E, guardar } from '../estado.js';
import { h, tabla } from '../ui.js';

const CALENDARIO = [
  ['Enero-febrero', 'Escapadas de invierno: cúpula con estufa y cielo despejado. Fiesta de la Alcachofa de Benicarló.', 'San Valentín con cena y jacuzzi'],
  ['Marzo-abril', 'Fallas, Magdalena y Semana Santa: primer pico del año. Almendros y campo en flor.', 'Paquete de Pascua para familias'],
  ['Mayo-junio', 'Mejor clima del año: senderismo en la Serra d\'Irta, cicloturismo, bodas pequeñas.', 'Retiros de yoga entre semana'],
  ['Julio-agosto', 'Lleno por playa y vacaciones: precio alto y estancia mínima de 2-3 noches.', 'Noches de estrellas y perseidas'],
  ['Septiembre-octubre', 'Mar aún templado, vendimia y setas. Parejas y extranjeros sin niños.', 'Catas de vino y aceite nuevo'],
  ['Noviembre-diciembre', 'Temporada de aceite y de cítricos. Empresas y grupos. Mantenimiento.', 'Puente de diciembre y Nochevieja'],
];
const DISTINTOS = ['Dormir bajo las estrellas en una cúpula, a 15-25 minutos de la playa de Peñíscola: mar y campo en el mismo viaje.', 'Olivos milenarios y paisaje de piedra seca del Maestrat como escenario, no un camping de costa más.', 'Cocina de kilómetro cero: alcachofa de Benicarló, langostino de Vinaròs, aceite y vino de la zona.', 'Pocas unidades y mucha separación: silencio y privacidad.', 'Energía solar, agua depurada y reutilizada: sostenible de verdad y se puede enseñar.'];

export default function (raiz) {
  const cambia = () => guardar('clientes');
  raiz.append(
    h('div', { class: 'rejilla c2' },
      h('div', { class: 'tarjeta' }, h('h2', {}, 'Qué nos hace distintos'), h('ul', { style: 'padding-left:18px;margin:0' }, DISTINTOS.map((t) => h('li', { style: 'margin-bottom:6px' }, t)))),
      h('div', { class: 'tarjeta' }, h('h2', {}, 'Cómo se gana dinero'), h('ul', { style: 'padding-left:18px;margin:0' }, ['Alojamiento: precio por temporada y estancia mínima en fechas fuertes.', 'Restauración: cena, cesta de desayuno y clientes externos el fin de semana.', 'Extras en la reserva: jacuzzi privado, cata, decoración romántica, salida tardía.', 'Actividades con socios locales a comisión: kayak, rutas, bodegas, observación astronómica.', 'Eventos: bodas pequeñas, retiros y empresas, sobre todo fuera del verano.', 'Bonos regalo: se cobran por adelantado y llenan la temporada baja.'].map((t) => h('li', { style: 'margin-bottom:6px' }, t))))),
    h('div', { class: 'tarjeta', style: 'margin-top:14px' }, h('h2', {}, 'A quién nos dirigimos'),
      tabla({ filas: E.segmentos, alCambiar: cambia, nueva: () => ({ seg: 'Nuevo segmento', origen: '', busca: '', cuando: '', canal: '', peso: 0 }), cols: [{ k: 'seg', t: 'Segmento', w: 190 }, { k: 'origen', t: 'De dónde vienen', w: 220 }, { k: 'busca', t: 'Qué buscan', w: 230 }, { k: 'cuando', t: 'Cuándo', w: 170 }, { k: 'canal', t: 'Cómo llegan', w: 190 }, { k: 'peso', t: '% de reservas', tipo: 'num', w: 80 }] })),
    h('div', { class: 'tarjeta', style: 'margin-top:14px' }, h('h2', {}, 'Canales de venta'),
      tabla({ filas: E.canales, alCambiar: cambia, nueva: () => ({ canal: 'Nuevo canal', coste: '', accion: '', prioridad: 'Media' }), cols: [{ k: 'canal', t: 'Canal', w: 220 }, { k: 'coste', t: 'Coste', w: 180 }, { k: 'accion', t: 'Qué hacemos', w: 380 }, { k: 'prioridad', t: 'Prioridad', tipo: 'sel', ops: ['Alta', 'Media', 'Baja'], w: 90 }] }),
      h('p', { class: 'suave', style: 'margin-top:8px' }, 'Objetivo: que más de la mitad de las reservas entren por la web propia en el segundo año. Cada reserva directa ahorra entre un 15 y un 17 % de comisión.')),
    h('div', { class: 'tarjeta', style: 'margin-top:14px' }, h('h2', {}, 'El año comercial'),
      h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Meses'), h('th', {}, 'Qué pasa'), h('th', {}, 'Qué vendemos'))), h('tbody', {}, CALENDARIO.map((f) => h('tr', {}, f.map((c, i) => h('td', { style: i ? '' : 'font-weight:600;white-space:nowrap' }, c))))))),
  );
}
