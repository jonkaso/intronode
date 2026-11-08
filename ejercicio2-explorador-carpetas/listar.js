const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

function formatearTamano(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 ** 2).toFixed(1) + ' MB';
}

const ruta = process.argv[2] || '.';

if (!fs.existsSync(ruta)) {
  console.error(pc.bgRed(pc.white(` Error: la ruta "${ruta}" no existe `)));
  process.exit(1);
}

let entradas;
try {
  entradas = fs.readdirSync(ruta, { withFileTypes: true });
} catch (err) {
  console.error(pc.bgRed(pc.white(` Error: no se puede leer "${ruta}" (${err.code}) `)));
  process.exit(1);
}

let carpetas = 0;
let archivos = 0;
let total = 0;

for (const e of entradas) {
  const oculto = e.name.startsWith('.');
  if (e.isDirectory()) {
    carpetas++;
    const txt = e.name + '/';
    console.log(oculto ? pc.gray(txt) : pc.blue(txt));
  } else {
    archivos++;
    const tam = fs.statSync(path.join(ruta, e.name)).size;
    total += tam;
    const nombre = oculto ? pc.gray(e.name) : pc.green(e.name);
    console.log(`${nombre} ${pc.gray(formatearTamano(tam))}`);
  }
}

console.log(`\n${carpetas} carpetas, ${archivos} archivos, ${formatearTamano(total)} en total`);
