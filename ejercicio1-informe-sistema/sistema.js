const os = require('os');
const pc = require('picocolors');

function formatearBytes(bytes) {
  return (bytes / 1024 ** 3).toFixed(2) + ' GB';
}

function formatearUptime(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  return `${h}h ${m}m`;
}

function colorearPorcentaje(pct) {
  const texto = pct.toFixed(0) + '%';
  if (pct < 60) return pc.green(texto);
  if (pct <= 85) return pc.yellow(texto);
  return pc.red(texto);
}

function linea(etiqueta, valor) {
  console.log(`  ${pc.dim(etiqueta.padEnd(14))}${valor}`);
}

const total = os.totalmem();
const libre = os.freemem();
const pctUsado = ((total - libre) / total) * 100;
const cpus = os.cpus();

console.log(pc.bold(pc.cyan('\n=== Informe del sistema ===')));
linea('Equipo:', pc.white(os.hostname()));
linea('Sistema:', pc.white(`${os.type()} ${os.release()} (${os.arch()})`));
linea('Usuario:', pc.green(os.userInfo().username));
linea('Procesador:', pc.white(`${cpus[0].model.trim()} (${cpus.length} CPUs)`));
linea('Mem. total:', pc.white(formatearBytes(total)));
linea('Mem. libre:', pc.white(formatearBytes(libre)));
linea('Mem. usada:', colorearPorcentaje(pctUsado));
linea('Tiempo activo:', pc.white(formatearUptime(os.uptime())));
console.log();
