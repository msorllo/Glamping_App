// Comprobación rápida del modelo con los datos de partida. Uso: node herramientas/probar-modelo.mjs
import { DEFECTO as E } from '../app/js/datos.js';
import { explotacion, equilibrio, cumplimiento, energia, agua } from '../app/js/calculo.js';

let fallos = 0;
for (const n of [1, 2, 3]) {
  const x = explotacion(E, n), x1 = explotacion(E, n, 1), q = cumplimiento(E, n), en = energia(E, n), ag = agua(E, n), eq = equilibrio(E, n);
  console.log(`\nESCENARIO ${n}: ${q.uds} unidades fijas + ${q.libres} parcelas · ${x.plazas} plazas`);
  console.log(`  inversión ${Math.round(x.capex.total)} € (sin terreno ${Math.round(x.capex.total - x.capex.terreno)} €)`);
  console.log(`  ingresos ${Math.round(x.neto)} € · resultado año 3 ${Math.round(x.ebitda)} € · año 1 ${Math.round(x1.ebitda)} € · retorno ${x.retorno.toFixed(1)} años · equilibrio ${eq ? (eq * 100).toFixed(0) + ' %' : 'no llega'}`);
  console.log(`  solar ${en.kwpPlano}/${en.kwpNecesario.toFixed(1)} kWp · baterías ${en.batPlano}/${en.batNecesaria.toFixed(0)} kWh · agua ${ag.m3Plano}/${ag.m3Necesario.toFixed(1)} m³ · depuradora ${ag.hePlano}/${ag.he} h.e.`);
  const malas = q.pruebas.filter((p) => !p.ok);
  malas.forEach((p) => console.log('  REVISAR: ' + p.t));
  if (malas.length || en.kwpPlano < en.kwpNecesario || ag.m3Plano < ag.m3Necesario || ag.hePlano < ag.he) fallos++;
}
console.log(fallos ? `\n${fallos} escenario(s) con avisos` : '\nTodo coherente en los tres escenarios');
process.exit(fallos ? 1 : 0);
