// Renders ORBIT HEART passes with headless Chromium (WebGL via SwiftShader).
// usage: node render-orbit-heart.mjs <outDir> <size> <frames|still> [layer]
// deps : playwright-core  (set PW_REQUIRE to a path next to node_modules if needed)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const { chromium } = createRequire(process.env.PW_REQUIRE || import.meta.url)('playwright-core');

const [outDir = 'out', size = '1024', frames = 'still', layer = 'all'] = process.argv.slice(2);
const SIZE = +size;
fs.mkdirSync(outDir, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
page.on('console', (m) => ['error', 'warning'].includes(m.type()) && console.log('[page]', m.text()));
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(`http://localhost:${port}/orbit-heart/preview.html${process.env.QS || ''}`);
await page.waitForFunction(() => window.gift);
await page.evaluate((s) => window.gift.resize(s), SIZE);
const LOOP = await page.evaluate(() => window.gift.LOOP);

async function grab(mode, t, lyr) {
  const url = await page.evaluate(([mode, t, lyr]) => {
    const g = window.gift; g.setMode(mode, lyr); g.setTime(t); g.render();
    return g.renderer.domElement.toDataURL('image/png');
  }, [mode, t, lyr]);
  return Buffer.from(url.split(',')[1], 'base64');
}

const n = frames === 'still' ? 1 : +frames;
const modes = ['beauty', 'body', 'plate', 'mask', 'fx'];
for (let i = 0; i < n; i++) {
  const t = frames === 'still' ? 0.12 : (i / n) * LOOP; // 0.12s ≈ first heartbeat peak
  const tag = frames === 'still' ? 'still' : String(i).padStart(3, '0');
  for (const m of modes) {
    if (layer !== 'all' && (m === 'beauty')) continue;
    fs.writeFileSync(path.join(outDir, `${m}_${tag}.png`), await grab(m, t, layer));
  }
  if (i % 10 === 0) console.log(`frame ${i + 1}/${n}`);
}
await browser.close();
server.close();
