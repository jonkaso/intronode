const os = require('os');
const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

function formatearBytes(bytes) {
  return (bytes / 1024 ** 3).toFixed(2) + ' GB';
}

function formatearUptime(segundos) {
  return `${Math.floor(segundos / 3600)}h ${Math.floor((segundos % 3600) / 60)}m`;
}

function colorearPorcentaje(pct) {
  const texto = pct.toFixed(0) + '%';
  if (pct < 60) return pc.green(texto);
  if (pct <= 85) return pc.yellow(texto);
  return pc.red(texto);
}

function fechaHora(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

const total = os.totalmem();
const libre = os.freemem();
const pct = ((total - libre) / total) * 100;
const cpus = os.cpus();

// Datos: [etiqueta, valor texto, valor coloreado]
const datos = [
  ['Equipo:', os.hostname()],
  ['Sistema:', `${os.type()} ${os.release()} (${os.arch()})`],
  ['Usuario:', os.userInfo().username],
  ['Procesador:', `${cpus[0].model.trim()} (${cpus.length} CPUs)`],
  ['Mem. total:', formatearBytes(total)],
  ['Mem. libre:', formatearBytes(libre)],
  ['Mem. usada:', pct.toFixed(0) + '%', colorearPorcentaje(pct)],
  ['Tiempo activo:', formatearUptime(os.uptime())],
];

// Texto plano (para el archivo)
const plano = ['=== Informe del sistema ===', ...datos.map(([e, v]) => `${e.padEnd(14)}${v}`)].join('\n') + '\n';

// Salida coloreada (solo consola)
console.log(pc.bold(pc.cyan('\n=== Informe del sistema ===')));
for (const [e, v, coloreado] of datos) {
  console.log(`  ${pc.dim(e.padEnd(14))}${coloreado || pc.white(v)}`);
}

fs.writeFileSync(path.join(__dirname, 'informe.txt'), plano);
fs.appendFileSync(path.join(__dirname, 'historial.log'), `${fechaHora()} | RAM usada: ${pct.toFixed(0)}%\n`);

console.log(pc.green('\n✔ Informe guardado en informe.txt\n'));
