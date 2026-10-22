// Единый источник правды: masters.json (белый список мастеров).
// Запуск без флагов: пересобирает env.js, firestore.rules и версию кэша в sw.js.
// Флаг --check: ничего не пишет, завершается с кодом 1, если файлы расходятся.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const check = process.argv.includes('--check');
let dirty = false;

function update(file, transform) {
  const before = read(file);
  const after = transform(before);
  if (before === after) return;
  dirty = true;
  if (check) console.error(`✗ ${file} не синхронизирован (запустите: node scripts/sync.js)`);
  else {
    fs.writeFileSync(path.join(root, file), after);
    console.log(`✓ ${file} обновлён`);
  }
}

const masters = JSON.parse(read('masters.json')).map((s) => s.trim().toLowerCase());

update('env.js', (s) =>
  s.replace(/ALLOWED_MASTERS: \[.*\]/, `ALLOWED_MASTERS: ${JSON.stringify(masters)}`));

update('firestore.rules', (s) =>
  s.replace(/request\.auth\.token\.email in \[[^\]]*\]/,
    `request.auth.token.email in [\n          ${masters.map((m) => `'${m}'`).join(',\n          ')}\n        ]`));

// Версия кэша SW = хеш файлов приложения: меняется только когда они реально изменились.
const hash = crypto.createHash('sha1');
['index.html', 'manifest.json', 'equipment_knowledge.json', 'env.js'].forEach((f) => hash.update(read(f)));
const version = hash.digest('hex').slice(0, 8);
update('sw.js', (s) =>
  s.replace(/('zps-hours-v\d+-' \+ )'[^']*'/, `$1'${version}'`));

if (check && dirty) process.exit(1);
if (!dirty) console.log('Всё синхронизировано.');
