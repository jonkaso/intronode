const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const ruta = args.find((a) => !a.startsWith('--')) || '.';

const categorias = {
  imagenes: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'],
  documentos: ['.pdf', '.doc', '.docx', '.txt', '.md', '.xls', '.xlsx', '.ppt', '.pptx', '.odt'],
  audio: ['.mp3', '.wav', '.flac', '.ogg'],
  video: ['.mp4', '.mkv', '.avi', '.mov'],
  comprimidos: ['.zip', '.rar', '.7z', '.tar', '.gz'],
};

function categoriaDe(nombre) {
  const ext = path.extname(nombre).toLowerCase();
  for (const [cat, exts] of Object.entries(categorias)) {
    if (exts.includes(ext)) return cat;
  }
  return 'otros';
}

if (!fs.existsSync(ruta) || !fs.statSync(ruta).isDirectory()) {
  console.error(pc.bgRed(pc.white(` Error: "${ruta}" no es una carpeta válida `)));
  process.exit(1);
}

if (dryRun) console.log(pc.cyan('Modo simulación (--dry-run): no se moverá nada\n'));

const resumen = {};
for (const e of fs.readdirSync(ruta, { withFileTypes: true })) {
  if (!e.isFile()) continue;
  const cat = categoriaDe(e.name);
  console.log(`${pc.yellow(e.name)} → ${pc.green(cat + '/')}`);
  if (!dryRun) {
    fs.mkdirSync(path.join(ruta, cat), { recursive: true });
    fs.renameSync(path.join(ruta, e.name), path.join(ruta, cat, e.name));
  }
  resumen[cat] = (resumen[cat] || 0) + 1;
}

console.log('\nResumen:');
for (const [cat, n] of Object.entries(resumen)) console.log(`  ${cat}: ${n}`);
if (Object.keys(resumen).length === 0) console.log('  (sin archivos)');
