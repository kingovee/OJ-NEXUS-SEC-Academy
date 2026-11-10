const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const vm = require('node:vm');

const project = path.resolve(__dirname, '..');
const root = path.join(project, 'public');
let failed = false;

function report(label, ok, details = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}${details ? ` — ${details}` : ''}`);
  if (!ok) failed = true;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const required = [
  'index.html', 'academy/index.html', 'academy/assets/app.js',
  'academy/assets/expansion.js', 'academy/assets/style.css',
  'academy/attacks.html', 'academy/range.html', 
  
  
  
  
];
for (const item of required) report(item, fs.existsSync(path.join(root, item)));
for(const item of ['README.md','LICENSE','server.js','.github/workflows/deploy-pages.yml'])
  report(item, fs.existsSync(path.join(project,item)));

for (const file of ['academy/assets/app.js', 'academy/assets/expansion.js']) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  report(`${file} syntax`, result.status === 0, result.status === 0 ? '' : result.stderr.trim());
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));
let checkedLocalLinks = 0;
let brokenLinks = 0;
for (const file of htmlFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const ids = new Set([...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]));
  for (const [, attribute, rawUrl] of source.matchAll(/\b(href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const url = rawUrl.trim();
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|blob:)/i.test(url)) continue;
    if (url.startsWith('#')) {
      const anchor = decodeURIComponent(url.slice(1));
      if (anchor && !ids.has(anchor)) {
        brokenLinks += 1;
        report(`${path.relative(root, file)} anchor ${url}`, false);
      }
      continue;
    }
    const pathname = decodeURIComponent(url.split(/[?#]/, 1)[0]);
    if (!pathname) continue;
    const target = path.resolve(path.dirname(file), pathname);
    checkedLocalLinks += 1;
    const insideRoot = target === root || target.startsWith(root + path.sep);
    const exists = insideRoot && fs.existsSync(target);
    if (!exists) {
      brokenLinks += 1;
      report(`${path.relative(root, file)} ${attribute} ${url}`, false, 'missing or outside project root');
    }
  }
}
report(`${checkedLocalLinks} local HTML links/assets`, brokenLinks === 0, brokenLinks ? `${brokenLinks} broken` : 'all resolve');

const landing = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
report('landing page academy link', landing.includes('academy/index.html'));
for (const route of ['attacks.html', 'range.html']) {
  const source = fs.readFileSync(path.join(root, 'academy', route), 'utf8');
  report(`academy/${route} loads expansion modules`, source.includes('assets/expansion.js'));
}

try {
  const store = {};
  const document = {
    documentElement: { dataset: {} },
    querySelector: () => null,
    getElementById: () => null,
    querySelectorAll: () => []
  };
  const context = {
    console, document, window: { scrollTo() {} },
    localStorage: {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value; }
    },
    URLSearchParams, Blob, Date, Math, Set, Map, JSON, Array, Object,
    String, Number, RegExp, Error, clearInterval, setInterval,
    btoa: (value) => Buffer.from(value, 'binary').toString('base64'),
    atob: (value) => Buffer.from(value, 'base64').toString('binary'),
    URL: { createObjectURL: () => 'blob:check', revokeObjectURL() {} }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'academy/assets/app.js'), 'utf8'), context, { filename: 'app.js' });
  const expansionSource = fs.readFileSync(path.join(root, 'academy/assets/expansion.js'), 'utf8');
  vm.runInContext(expansionSource + `\nglobalThis.__projectMetrics = {
    attackCount: ATTACKS.length,
    ctfCount: CTF.length,
    roleCount: RANGE_ROLES.length,
    uniqueAttackIds: new Set(ATTACKS.map(x => x.id)).size,
    validRoles: RANGE_ROLES.every(r => r.events.length === 7 && r.stages.length === 4 && r.stages.every(s => s.gate >= 1 && s.gate <= 7 && s.correct >= 0 && s.correct < s.options.length))
  };`, context, { filename: 'expansion.js' });
  const metrics = context.__projectMetrics;
  report('100 unique attack tutorials', metrics.attackCount === 100 && metrics.uniqueAttackIds === 100);
  report('32 CTF challenges', metrics.ctfCount === 32);
  report('9 role simulations with valid event/task structure', metrics.roleCount === 9 && metrics.validRoles);
} catch (error) {
  report('front-end content validation', false, error.message);
  console.error(error);
}

try {
  const pkg = JSON.parse(fs.readFileSync(path.join(project, 'package.json'), 'utf8'));
  report('Node.js engine declared as 22+', /^>=\s*22(?:\.0)?$/.test(pkg.engines?.node || ''));
  report('npm check script configured', pkg.scripts?.check === 'node scripts/check-project.js && npm test');
  report('npm start script configured', pkg.scripts?.start === 'node server.js');
} catch (error) {
  report('package.json metadata', false, error.message);
}

process.exit(failed ? 1 : 0);
