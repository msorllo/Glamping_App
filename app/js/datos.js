// Datos de partida del proyecto. Todo lo que hay aquí se puede editar desde la app
// (los cambios se guardan en datos/estado.json). Qué está contrastado y qué es estimación: docs/FUENTES.md
export const VERSION = 7;

// Catálogo de elementos. w × d = huella en planta (m), h = altura (m), pax = plazas,
// coste = € sin IVA llave en mano y equipado, precio = € por noche base (IVA incluido), kwh = consumo diario ocupado.
export const CATALOGO = {
  domo6:   { nombre: 'Cúpula geodésica Ø6', grupo: 'alojamiento', w: 8, d: 9, h: 3.5, pax: 2, coste: 21000, precio: 135, kwh: 9, color: '#e9e2d0', plano: true },
  domo7:   { nombre: 'Cúpula suite Ø7', grupo: 'alojamiento', w: 9, d: 11, h: 4, pax: 4, coste: 29000, precio: 185, kwh: 13, color: '#e9e2d0', plano: true },
  safari:  { nombre: 'Tienda safari 5×7', grupo: 'alojamiento', w: 5.6, d: 10.2, h: 3.7, pax: 4, coste: 17500, precio: 145, kwh: 8, color: '#d8c9a3', plano: true },
  bell:    { nombre: 'Tienda bell Ø5', grupo: 'alojamiento', w: 6, d: 6, h: 3.3, pax: 2, coste: 3800, precio: 70, kwh: 2, color: '#efe6cf', plano: true },
  cabana:  { nombre: 'Cabaña de madera', grupo: 'alojamiento', w: 6, d: 5.4, h: 3.1, pax: 2, coste: 25000, precio: 120, kwh: 8, color: '#c9a777', plano: true },
  parcela: { nombre: 'Parcela de acampada', grupo: 'alojamiento', w: 8, d: 10, h: 0.1, pax: 3, coste: 900, precio: 28, kwh: 2, limpieza: 2, gasto: 0.35, libre: true, color: '#cfd8a8' },
  kiosco:  { nombre: 'Quiosco-bar y recepción', grupo: 'servicio', w: 6, d: 7.4, h: 2.8, coste: 16000, kwh: 14, color: '#b98a5a', plano: true },
  restaurante: { nombre: 'Restaurante y recepción', grupo: 'servicio', w: 14, d: 14, h: 3.6, coste: 145000, kwh: 48, kwp: 10, color: '#b98a5a', plano: true },
  sanitarios: { nombre: 'Bloque sanitario', grupo: 'servicio', w: 9, d: 4.2, h: 2.8, coste: 22000, kwh: 6, color: '#cfc7b5', plano: true },
  piscina: { nombre: 'Piscina', grupo: 'ocio', w: 16, d: 9, h: 0.2, coste: 48000, kwh: 11, color: '#69b7d6', plano: true },
  spa:     { nombre: 'Zona spa (jacuzzis + sauna)', grupo: 'ocio', w: 8, d: 6, h: 2.4, coste: 19000, kwh: 25, color: '#8fc3d1' },
  eventos: { nombre: 'Pérgola de eventos', grupo: 'ocio', w: 15, d: 10, h: 4, coste: 22000, kwh: 4, color: '#e6dcc6' },
  mirador: { nombre: 'Mirador de estrellas', grupo: 'ocio', w: 6, d: 6, h: 0.5, coste: 2500, kwh: 0, color: '#bca67e' },
  yoga:    { nombre: 'Tarima de yoga', grupo: 'ocio', w: 8, d: 6, h: 0.3, coste: 3000, kwh: 0, color: '#c9b48a' },
  juegos:  { nombre: 'Juegos infantiles', grupo: 'ocio', w: 8, d: 8, h: 2.5, coste: 4000, kwh: 0, color: '#e3c27a' },
  huerto:  { nombre: 'Huerto y aromáticas', grupo: 'ocio', w: 12, d: 8, h: 0.4, coste: 1500, kwh: 0, color: '#9fb46b' },
  parking: { nombre: 'Aparcamiento (10 plazas)', grupo: 'instalacion', w: 25, d: 11, h: 0.05, coste: 3000, kwh: 0, plazas: 10, color: '#cfc8b8' },
  solar:   { nombre: 'Pérgola solar 12 kWp', grupo: 'instalacion', w: 12.5, d: 5, h: 2.9, coste: 13000, kwh: 0, kwp: 12, color: '#27456b' },
  tecnico: { nombre: 'Caseta técnica y baterías', grupo: 'instalacion', w: 4, d: 3, h: 2.6, coste: 16000, kwh: 0, kwhBat: 20, color: '#9a9484' },
  deposito:{ nombre: 'Depósito de agua 20 m³', grupo: 'instalacion', w: 3.6, d: 3.6, h: 2.4, coste: 4500, kwh: 4, m3: 20, color: '#8fb3c4' },
  pozo:    { nombre: 'Pozo', grupo: 'instalacion', w: 2, d: 2, h: 0.8, coste: 9000, kwh: 0, color: '#7a8f99' },
  depuradora: { nombre: 'Depuradora + filtro verde', grupo: 'instalacion', w: 10, d: 8, h: 0.4, coste: 16000, kwh: 6, he: 50, color: '#7fa37a' },
  residuos:{ nombre: 'Punto limpio', grupo: 'instalacion', w: 5, d: 3, h: 1.8, coste: 1800, kwh: 0, color: '#8a8478' },
};

let n = 0;
const el = (tipo, x, y, fase, rot = 0, nombre) => ({ id: 'e' + ++n, tipo, x, y, rot, fase, nombre: nombre || '' });

export const DEFECTO = {
  v: VERSION,
  nombre: 'Glamping Maestrat',
  escenario: 'medio',
  parcela: { ancho: 160, fondo: 125, retranqueo: 5, ocupacionMax: 30, sepUnidades: 3 },
  // Viales: ejes en metros desde la esquina noroeste (x hacia el este, y hacia el sur). El camino de acceso está al sur.
  viales: [
    { nombre: 'Acceso', ancho: 5, pts: [[80, 125], [80, 104]] },
    { nombre: 'Eje central', ancho: 3.5, pts: [[80, 104], [80, 62]] },
    { nombre: 'Anillo', ancho: 3.5, pts: [[40, 62], [40, 25], [120, 25], [120, 62], [40, 62]] },
    { nombre: 'Servicio oeste', ancho: 3.5, pts: [[80, 104], [14, 104]] },
    { nombre: 'Ramal este', ancho: 3.5, pts: [[80, 104], [130, 104]] },
    { nombre: 'Paseo piscina', ancho: 2, pts: [[120, 62], [120, 73]] },
  ],
  elementos: [
    // FASE 1 · mínimo viable
    el('bell', 50, 53, 1), el('bell', 62, 53, 1), el('bell', 50, 41, 1), el('bell', 62, 41, 1),
    el('domo6', 131, 31, 1, 90), el('domo6', 131, 47, 1, 90),
    el('sanitarios', 62, 70, 1), el('kiosco', 90, 97, 1),
    el('parking', 52, 114, 1), el('solar', 52, 111.5, 1),
    el('tecnico', 16, 99, 1), el('deposito', 16, 91, 1), el('pozo', 10, 84, 1), el('depuradora', 14, 114, 1), el('residuos', 30, 99.5, 1),
    el('mirador', 80, 11, 1),
    el('parcela', 38, 81, 1), el('parcela', 47, 81, 1), el('parcela', 38, 92, 1), el('parcela', 47, 92, 1),
    // FASE 2 · medio
    el('domo6', 104, 13.5, 2, 180), el('domo6', 120, 13.5, 2, 180), el('domo6', 136, 13.5, 2, 180),
    el('safari', 22, 32, 2, 270), el('safari', 22, 46, 2, 270),
    el('domo7', 148, 62, 2, 90),
    el('restaurante', 103, 84, 2), el('piscina', 128, 80, 2),
    el('parking', 108, 114, 2), el('solar', 108, 111.5, 2),
    el('juegos', 72, 93, 2), el('huerto', 24, 73, 2), el('deposito', 10, 92, 2),
    el('parcela', 38, 70, 2), el('parcela', 47, 70, 2), el('parcela', 56, 81, 2), el('parcela', 56, 92, 2), el('parcela', 65, 81, 2),
    // FASE 3 · completo
    el('domo7', 86, 44, 3), el('domo7', 104, 44, 3),
    el('cabana', 44, 13, 3, 180), el('cabana', 60, 13, 3, 180),
    el('safari', 22, 18, 3, 270), el('safari', 22, 60, 3, 270),
    el('spa', 132, 66.5, 3), el('eventos', 141, 104, 3), el('yoga', 147, 37, 3),
    el('solar', 30, 87, 3), el('solar', 108, 99.5, 3), 
    el('parcela', 87, 70, 3), el('parcela', 87, 81, 3), el('parcela', 73, 34, 3), el('parcela', 73, 46, 3), el('parcela', 95, 33, 3),
  ],
  catalogo: {}, // sobrescrituras editables de coste / precio / kwh por tipo

  // ---------- Terrenos ----------
  pesos: { precio: 25, acceso: 20, atractivo: 20, suministros: 15, urbanismo: 15, riesgo: 5 },
  terrenos: [
    // precio = €/m² orientativo de rústico; min = minutos en coche a Benicarló; notas 1-5 (5 = mejor)
    { muni: 'Benicarló', lat: 40.4167, lon: 0.4273, precio: 6, min: 0, playa: 5, despob: false, acceso: 5, atractivo: 4, suministros: 5, urbanismo: 2, riesgo: 3, nota: 'Huerta de regadío cara y muy parcelada; franja litoral protegida.' },
    { muni: 'Peñíscola', lat: 40.3572, lon: 0.4064, precio: 7, min: 12, playa: 5, despob: false, acceso: 5, atractivo: 5, suministros: 4, urbanismo: 1, riesgo: 2, nota: 'Máxima demanda, pero Serra d\'Irta y litoral muy protegidos y suelo caro.' },
    { muni: 'Vinaròs', lat: 40.4703, lon: 0.4753, precio: 5, min: 12, playa: 5, despob: false, acceso: 5, atractivo: 3, suministros: 5, urbanismo: 2, riesgo: 3, nota: 'Bien comunicado; cítricos en regadío, precio medio-alto.' },
    { muni: 'Càlig', lat: 40.4603, lon: 0.3536, precio: 2.5, min: 12, playa: 15, despob: false, acceso: 4, atractivo: 3, suministros: 4, urbanismo: 3, riesgo: 4, nota: 'A 10 min de la costa, olivar y almendro, vistas al mar desde las lomas.' },
    { muni: 'Cervera del Maestre', lat: 40.4533, lon: 0.2769, precio: 1.5, min: 20, playa: 22, despob: true, acceso: 3, atractivo: 4, suministros: 3, urbanismo: 4, riesgo: 3, nota: 'Castillo, olivos milenarios, cielo oscuro. Rambla de Cervera: evitar cauce.' },
    { muni: 'Sant Jordi', lat: 40.5092, lon: 0.3331, precio: 2.5, min: 18, playa: 15, despob: false, acceso: 4, atractivo: 3, suministros: 4, urbanismo: 3, riesgo: 4, nota: 'Junto al campo de golf Panorámica; llano y accesible por la N-232.' },
    { muni: 'Traiguera', lat: 40.5253, lon: 0.2906, precio: 1.6, min: 22, playa: 20, despob: true, acceso: 4, atractivo: 3, suministros: 3, urbanismo: 4, riesgo: 4, nota: 'Olivos milenarios y alfarería; N-232 a mano.' },
    { muni: 'Sant Mateu', lat: 40.4650, lon: 0.1786, precio: 1.4, min: 30, playa: 32, despob: false, acceso: 3, atractivo: 4, suministros: 3, urbanismo: 3, riesgo: 4, nota: 'Capital histórica del Maestrat; más interior, turismo cultural.' },
    { muni: 'Santa Magdalena de Pulpis', lat: 40.3561, lon: 0.3028, precio: 1.8, min: 15, playa: 15, despob: true, acceso: 5, atractivo: 4, suministros: 3, urbanismo: 4, riesgo: 2, nota: 'Junto a la N-340/AP-7 y la cara interior de la Serra d\'Irta. Atención a incendios.' },
    { muni: 'Alcalà de Xivert', lat: 40.3036, lon: 0.2256, precio: 2.2, min: 25, playa: 12, despob: false, acceso: 4, atractivo: 4, suministros: 3, urbanismo: 3, riesgo: 3, nota: 'Término enorme con Alcossebre; estación de tren.' },
    { muni: 'La Jana', lat: 40.5131, lon: 0.2519, precio: 1.3, min: 27, playa: 25, despob: true, acceso: 3, atractivo: 3, suministros: 3, urbanismo: 4, riesgo: 4, nota: 'Olivos milenarios, muy tranquilo.' },
    { muni: 'Canet lo Roig', lat: 40.5506, lon: 0.2436, precio: 1.2, min: 32, playa: 28, despob: true, acceso: 2, atractivo: 3, suministros: 3, urbanismo: 4, riesgo: 4, nota: 'Barato y rural; algo apartado.' },
    { muni: 'Xert', lat: 40.5192, lon: 0.1561, precio: 1.0, min: 35, playa: 35, despob: true, acceso: 3, atractivo: 4, suministros: 2, urbanismo: 4, riesgo: 3, nota: 'Paisaje de montaña (Les Moles), puerta a Morella.' },
    { muni: 'Rossell', lat: 40.6186, lon: 0.2244, precio: 1.0, min: 40, playa: 35, despob: true, acceso: 2, atractivo: 4, suministros: 2, urbanismo: 4, riesgo: 3, nota: 'Puerta de la Tinença de Benifassà; lejos de la costa.' },
    { muni: 'Sant Rafel del Riu', lat: 40.5958, lon: 0.3706, precio: 2.0, min: 28, playa: 20, despob: true, acceso: 3, atractivo: 3, suministros: 4, urbanismo: 4, riesgo: 3, nota: 'Ribera del Sénia, cítricos; revisar inundabilidad.' },
    { muni: 'La Salzadella', lat: 40.4172, lon: 0.1736, precio: 1.1, min: 35, playa: 35, despob: true, acceso: 3, atractivo: 3, suministros: 3, urbanismo: 4, riesgo: 4, nota: 'Cerezos; interior tranquilo sobre la CV-10.' },
    { muni: 'Tírig', lat: 40.4233, lon: 0.0767, precio: 0.9, min: 45, playa: 45, despob: true, acceso: 2, atractivo: 4, suministros: 2, urbanismo: 4, riesgo: 3, nota: 'Arte rupestre de la Valltorta (UNESCO); muy interior.' },
  ],

  // ---------- Economía ----------
  eco: {
    terreno: { modo: 'compra', m2: 20000, precioM2: 2.2, gastosCompra: 10, alquilerAnual: 7000 },
    iva: 10,
    llenado: 0.88, // plazas realmente ocupadas por unidad vendida
    temporadas: [
      { id: 'alta', nombre: 'Alta (julio y agosto)', dias: 62, ocup: 85, mult: 1.3 },
      { id: 'media', nombre: 'Media (abril-junio, septiembre-octubre)', dias: 153, ocup: 50, mult: 1.0 },
      { id: 'baja', nombre: 'Baja (noviembre-marzo)', dias: 150, ocup: 18, mult: 0.8 },
    ],
    rampa: [60, 80, 100], // % de la ocupación objetivo en los años 1, 2 y 3
    fb: { ticketKiosco: 12, ticketRest: 24, ticketExt: 26, cubiertosSemana: [0, 90, 140], semanas: 40, cogs: 33 },
    eventos: { n: 12, ingreso: 4500, margen: 50 },
    act: { ticket: [5, 7, 8], margen: 50 },
    spa: { ticket: 6, margen: 80 },
    variable: { limpieza: 16, otaPct: 45, otaComision: 15, mantenimientoPct: 2, marketingPct: 5 },
    sociosCobran: true,
    personal: [
      { rol: 'Dirección y recepción (socio)', socio: true, coste: 26000, fte: [1, 1, 1] },
      { rol: 'Recepción y reservas', socio: false, coste: 24000, fte: [0, 0.5, 1] },
      { rol: 'Limpieza y lencería', socio: false, coste: 22500, fte: [0.5, 1.2, 2] },
      { rol: 'Mantenimiento y jardín', socio: false, coste: 24000, fte: [0.3, 0.7, 1] },
      { rol: 'Cocina', socio: false, coste: 27000, fte: [0, 1.5, 2.5] },
      { rol: 'Sala y bar', socio: false, coste: 23500, fte: [0.6, 1.5, 2.5] },
      { rol: 'Socorrista (temporada)', socio: false, coste: 24000, fte: [0, 0.3, 0.3] },
      { rol: 'Eventos y actividades', socio: false, coste: 25000, fte: [0, 0, 0.7] },
    ],
    fijos: [
      { concepto: 'Seguros (RC + multirriesgo)', imp: [2500, 4500, 6500] },
      { concepto: 'Suministros (gas, respaldo eléctrico, telecom)', imp: [3000, 8000, 12000] },
      { concepto: 'Software de reservas y web', imp: [1500, 2400, 3000] },
      { concepto: 'Gestoría y asesoría', imp: [2400, 3600, 4800] },
      { concepto: 'Tasas, IBI, basuras, canon de vertido', imp: [1500, 2500, 3500] },
      { concepto: 'Análisis de agua, piscina y legionela', imp: [600, 2200, 3200] },
      { concepto: 'Reposición de lencería y menaje', imp: [1500, 3500, 5500] },
      { concepto: 'Varios e imprevistos', imp: [2000, 4000, 6000] },
    ],
    // Inversión que no es un elemento del plano. f1/f2/f3 = lo que se añade en cada fase.
    capexGeneral: [
      { concepto: 'Proyecto técnico, DIC / licencias, estudios (paisaje, topográfico, geotécnico)', f: [28000, 6000, 4000] },
      { concepto: 'Viales de zahorra, zanjas y canalizaciones', f: [18000, 9000, 6000] },
      { concepto: 'Cuadro general, redes interiores de luz y agua', f: [9000, 7000, 5000] },
      { concepto: 'Vallado perimetral, puerta y pantalla vegetal', f: [9000, 2000, 1000] },
      { concepto: 'Jardinería, riego por goteo e iluminación de balizas', f: [5000, 5000, 4000] },
      { concepto: 'Protección contra incendios y señalización', f: [3500, 2000, 1500] },
      { concepto: 'Web, motor de reservas, fotos y marca', f: [4500, 1500, 1500] },
      { concepto: 'Mobiliario exterior común y menaje inicial', f: [3000, 6000, 5000] },
      { concepto: 'Ampliación de baterías e inversores', f: [0, 16000, 13000], bat: [0, 35, 30] },
      { concepto: 'Ampliación de la depuradora', f: [0, 7000, 9000], he: [0, 25, 35] },
      { concepto: 'Capital circulante de arranque (6 meses)', f: [15000, 20000, 15000] },
    ],
    contingenciaPct: 10,
    tasasObraPct: 6, // ICIO + tasa de licencia + canon DIC, sobre obra e instalaciones
    fin: { pct: 60, interes: 5.5, anios: 10, subvencion: 0 },
  },

  // ---------- Sistemas ----------
  sis: { hsp: 5.2, pr: 0.76, autonomiaNoche: 28, coberturaFV: 70, lPax: 150, lCubierto: 25, lRiego: 1500, renovPiscina: 2.5, volPiscina: 81, diasAutonomiaAgua: 2, redElectrica: false },

  // ---------- Permisos y hoja de ruta ----------
  permisos: [
    { id: 'p1', bloque: 'Antes de comprar', titulo: 'Informe urbanístico municipal del terreno (compatibilidad de uso camping)', org: 'Ayuntamiento', ini: 0, dur: 1, coste: 80, estado: 'pendiente', nota: 'Pedirlo ANTES de firmar. Condicionar la compra (arras) a que el uso sea viable.' },
    { id: 'p2', bloque: 'Antes de comprar', titulo: 'Comprobar afecciones: inundabilidad (PATRICOVA), forestal (PATFOR), costas (PATIVEL), Red Natura, vías pecuarias', org: 'Visor GVA / técnico', ini: 0, dur: 1, coste: 0, estado: 'pendiente', nota: 'Se consulta gratis en el visor cartográfico de la Generalitat.' },
    { id: 'p3', bloque: 'Antes de comprar', titulo: 'Nota simple, catastro, servidumbres y derechos de agua', org: 'Registro de la Propiedad', ini: 0, dur: 1, coste: 30, estado: 'pendiente', nota: '' },
    { id: 'p4', bloque: 'Constitución', titulo: 'Constituir la sociedad (SL) o alta de autónomo, CIF, cuenta bancaria', org: 'Notaría / Registro Mercantil / AEAT', ini: 1, dur: 1, coste: 600, estado: 'pendiente', nota: '' },
    { id: 'p5', bloque: 'Proyecto', titulo: 'Topográfico, geotécnico y anteproyecto con arquitecto/ingeniero', org: 'Técnico colegiado', ini: 1, dur: 2, coste: 6000, estado: 'pendiente', nota: 'Los planos de esta app sirven de punto de partida.' },
    { id: 'p6', bloque: 'Urbanismo', titulo: 'Declaración de Interés Comunitario (DIC), o informe de la conselleria si el municipio está exento', org: 'Conselleria de urbanismo / Ayuntamiento', ini: 3, dur: 12, coste: 9000, estado: 'pendiente', nota: 'Arts. 211, 216 y 223 del texto refundido de urbanismo. Incluye estudio de integración paisajística. Canon del 2 % de la obra (reducible al 50 %). Vigencia máxima de 30 años, prorrogable.' },
    { id: 'p7', bloque: 'Medio ambiente', titulo: 'Evaluación ambiental (si procede) e instrumento ambiental de la actividad', org: 'Conselleria / Ayuntamiento', ini: 3, dur: 8, coste: 3500, estado: 'pendiente', nota: '' },
    { id: 'p8', bloque: 'Agua', titulo: 'Autorización de vertido de la depuradora y uso del pozo', org: 'Confederación Hidrográfica del Júcar', ini: 4, dur: 9, coste: 1500, estado: 'pendiente', nota: 'Tramitar en paralelo a la DIC.' },
    { id: 'p9', bloque: 'Obra', titulo: 'Proyecto de ejecución y licencia de obras', org: 'Ayuntamiento', ini: 15, dur: 3, coste: 9000, estado: 'pendiente', nota: 'ICIO y tasas aparte (ver Economía).' },
    { id: 'p10', bloque: 'Obra', titulo: 'Obra de la fase 1 y legalización de instalaciones (electricidad, agua, incendios)', org: 'Constructor / instaladores / Industria', ini: 18, dur: 4, coste: 0, estado: 'pendiente', nota: '' },
    { id: 'p11', bloque: 'Apertura', titulo: 'Licencia o declaración responsable de apertura de la actividad', org: 'Ayuntamiento', ini: 22, dur: 1, coste: 800, estado: 'pendiente', nota: '' },
    { id: 'p12', bloque: 'Apertura', titulo: 'Declaración responsable e inscripción en el Registro de Turismo (camping)', org: 'Turisme Comunitat Valenciana', ini: 22, dur: 1, coste: 0, estado: 'pendiente', nota: 'Decreto 10/2021, arts. 50 a 60 y anexo IV: vallado, viales de 3,5 m, extintor cada 20 parcelas, 600 W por parcela, vigilancia permanente.' },
    { id: 'p13', bloque: 'Apertura', titulo: 'Bar-restaurante: declaración responsable, registro sanitario, formación en higiene y alérgenos', org: 'Turisme / Sanidad', ini: 22, dur: 1, coste: 300, estado: 'pendiente', nota: '' },
    { id: 'p14', bloque: 'Apertura', titulo: 'Plan de autoprotección y seguro de responsabilidad civil', org: 'Técnico / aseguradora', ini: 21, dur: 1, coste: 1500, estado: 'pendiente', nota: '' },
    { id: 'p15', bloque: 'Apertura', titulo: 'Alta en registro de viajeros (SES.Hospedajes), hojas de reclamaciones, protección de datos', org: 'Ministerio del Interior / Consumo', ini: 22, dur: 1, coste: 200, estado: 'pendiente', nota: '' },
    { id: 'p16', bloque: 'Fase 2', titulo: 'Piscina de uso colectivo: proyecto, comunicación a Sanidad, socorrista', org: 'Ayuntamiento / Sanidad', ini: 30, dur: 4, coste: 2500, estado: 'pendiente', nota: '' },
    { id: 'p17', bloque: 'Fase 3', titulo: 'Eventos: ampliación de licencia, aforo, estudio acústico', org: 'Ayuntamiento', ini: 42, dur: 4, coste: 3000, estado: 'pendiente', nota: '' },
  ],

  // ---------- Organización ----------
  turnos: [
    { rol: 'Recepción', tramos: [[8, 14, 'Salidas y desayunos'], [15, 21, 'Llegadas']] },
    { rol: 'Limpieza', tramos: [[10.5, 15.5, 'Cambio de unidades'], [16, 17, 'Zonas comunes']] },
    { rol: 'Mantenimiento', tramos: [[7, 10, 'Piscina, riego, revisión'], [18, 20, 'Luces y repasos']] },
    { rol: 'Cocina', tramos: [[7.5, 11, 'Desayunos'], [12.5, 16, 'Comidas'], [19.5, 23.5, 'Cenas']] },
    { rol: 'Sala y bar', tramos: [[8, 11.5, 'Desayunos'], [12.5, 17, 'Comidas y piscina'], [19.5, 24, 'Cenas y copas']] },
    { rol: 'Socorrista', tramos: [[11, 20, 'Piscina abierta']] },
    { rol: 'Actividades', tramos: [[9, 11, 'Yoga / ruta'], [18, 19.5, 'Cata'], [22, 23.5, 'Estrellas']] },
  ],
  tareas: [
    { t: 'Visitar 5 terrenos y rellenar el comparador', quien: '', col: 0, fase: 1 },
    { t: 'Reunión con el técnico municipal de urbanismo', quien: '', col: 0, fase: 1 },
    { t: 'Pedir 3 presupuestos de arquitecto/ingeniero', quien: '', col: 0, fase: 1 },
    { t: 'Pedir oferta de cúpulas a 3 fabricantes', quien: '', col: 0, fase: 1 },
    { t: 'Cita con el GAL (LEADER) y con el banco', quien: '', col: 0, fase: 1 },
    { t: 'Reservar dominio y cuentas de redes', quien: '', col: 0, fase: 1 },
  ],
  segmentos: [
    { seg: 'Parejas (escapada romántica)', origen: 'Valencia, Castellón, Barcelona, Zaragoza', busca: 'Cúpula con jacuzzi, cielo, desconexión', cuando: 'Fines de semana todo el año', canal: 'Instagram, Google, Booking', peso: 40 },
    { seg: 'Familias con niños', origen: 'Comunitat Valenciana, Cataluña, Aragón, Madrid', busca: 'Safari, piscina, animales, playa cerca', cuando: 'Verano, Pascua, puentes', canal: 'Booking, Google, recomendación', peso: 25 },
    { seg: 'Extranjeros (FR, NL, DE, UK)', origen: 'Ruta por la costa mediterránea', busca: 'Naturaleza con comodidad, gastronomía', cuando: 'Mayo-octubre', canal: 'Booking, Glamping Hub, ACSI', peso: 15 },
    { seg: 'Grupos y celebraciones', origen: 'Provincia y alrededores', busca: 'Bodas pequeñas, cumpleaños, despedidas', cuando: 'Primavera y otoño', canal: 'Bodas.net, Instagram, boca a boca', peso: 10 },
    { seg: 'Retiros y empresas', origen: 'Valencia, Barcelona', busca: 'Yoga, teambuilding entre semana', cuando: 'Temporada baja', canal: 'Venta directa, LinkedIn, organizadores', peso: 10 },
  ],
  canales: [
    { canal: 'Web propia con motor de reservas', coste: '0 % + cuota del software', accion: 'Mejor precio garantizado, código de descuento directo', prioridad: 'Alta' },
    { canal: 'Google Business + reseñas', coste: 'Gratis', accion: 'Ficha completa, fotos, pedir reseña en el check-out', prioridad: 'Alta' },
    { canal: 'Instagram y TikTok', coste: 'Tiempo propio', accion: '3 vídeos por semana: amanecer en la cúpula, cielo, cocina', prioridad: 'Alta' },
    { canal: 'Booking.com', coste: '15-17 % de comisión', accion: 'Abrir sobre todo para temporada baja y media', prioridad: 'Media' },
    { canal: 'Airbnb / Glamping Hub', coste: '3-15 % de comisión', accion: 'Unidades singulares (cúpulas)', prioridad: 'Media' },
    { canal: 'Colaboraciones locales', coste: 'Intercambio', accion: 'Bodegas, almazaras, guías, kayak, Peñíscola', prioridad: 'Media' },
    { canal: 'Creadores de contenido', coste: 'Estancia gratis', accion: '1 estancia al mes entre semana a cambio de contenido', prioridad: 'Baja' },
  ],
};

export const BLOQUES_COLOR = { alojamiento: '#bd5d3a', servicio: '#586b3a', ocio: '#2f7f9a', instalacion: '#6d6f60' };
