import { E, cargar, guardar, restablecer, importar, alCambiar } from './estado.js';
import { h, descargar } from './ui.js';

const VISTAS = [
  ['resumen', 'Resumen', '01'], ['terrenos', 'Terrenos y zona', '02'], ['plano', 'Plano general', '03'], ['planos', 'Planos de unidades', '04'],
  ['tresd', 'Vista 3D', '05'], ['sistemas', 'Cómo funciona', '06'], ['economia', 'Economía', '07'], ['permisos', 'Permisos y hoja de ruta', '08'],
  ['organizacion', 'Organización', '09'], ['clientes', 'Clientes y marketing', '10'], ['documentos', 'Documentos', '11'],
];
const vista = document.getElementById('vista');
let limpiar = null, actual = null;

async function ir() {
  const id = (location.hash.slice(1).split('/')[0]) || 'resumen';
  const def = VISTAS.find((v) => v[0] === id) || VISTAS[0];
  actual = def[0];
  limpiar?.(); limpiar = null;
  document.getElementById('titulo').textContent = def[1];
  document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('activo', a.dataset.id === def[0]));
  vista.replaceChildren();
  try {
    const mod = await import(`./vistas/${def[0]}.js`);
    if (actual !== def[0]) return;
    limpiar = mod.default(vista, location.hash.slice(1).split('/')[1]) || null;
  } catch (err) { console.error(err); vista.append(h('div', { class: 'nota rojo' }, 'No se pudo abrir esta sección: ' + err.message)); }
  vista.scrollTop = 0;
}

function pintaEscenario() {
  document.querySelectorAll('.escenarios button').forEach((b) => b.classList.toggle('activo', b.dataset.esc === E.escenario));
  document.getElementById('nombreProyecto').textContent = E.nombre;
}

await cargar();
document.getElementById('nav').append(...VISTAS.map(([id, t, n]) => h('a', { href: '#' + id, 'data-id': id }, h('i', {}, n), t)));
document.querySelectorAll('.escenarios button').forEach((b) => b.addEventListener('click', () => { E.escenario = b.dataset.esc; guardar('escenario'); pintaEscenario(); ir(); }));
document.getElementById('btnExportar').onclick = () => descargar('glamping-datos.json', JSON.stringify(E, null, 1), 'application/json');
document.getElementById('btnImportar').onclick = () => document.getElementById('ficheroImportar').click();
document.getElementById('ficheroImportar').onchange = async (e) => {
  const f = e.target.files[0]; if (!f) return;
  try { importar(JSON.parse(await f.text())); pintaEscenario(); ir(); } catch { alert('El archivo no es una copia válida del proyecto.'); }
  e.target.value = '';
};
document.getElementById('btnReset').onclick = async () => { if (confirm('¿Volver a los datos de partida? Se perderán los cambios que no hayas exportado.')) { await restablecer(); pintaEscenario(); ir(); } };
alCambiar((que) => { if (que === 'todo') pintaEscenario(); });
window.addEventListener('hashchange', ir);
pintaEscenario(); ir();
