// Headless render of one NFT (Chromium + WebGL/SwiftShader).
//   node render.mjs <nft-id> <outDir> <size> <still|N frames> [passes=beauty,body,plate,mask,fx,spark]
// Writes <pass>_<tag>.png. deps: playwright-core (PW_REQUIRE → a package.json next to node_modules).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = createRequire(process.env.PW_REQUIRE || import.meta.url)('playwright-core');
const [id, outDir, size = '1024', frames = 'still', passArg = 'beauty,body,plate,mask,fx,spark'] = process.argv.slice(2);
if (!id || !outDir) { console.error('usage: render.mjs <nft-id> <outDir> [size] [still|N] [passes]'); process.exit(1); }
const passes = passArg.split(',');
fs.mkdirSync(outDir, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0);

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => m.type() === 'error' && !m.text().includes('404') && console.log('[page]', m.text()));
await page.goto(`http://localhost:${server.address().port}/viewer.html?nft=${id}`);
await page.waitForFunction(() => window.gift, null, { timeout: 180000 });
await page.evaluate((s) => window.gift.resize(s), +size);
const LOOP = await page.evaluate(() => window.gift.LOOP);

const n = frames === 'still' ? 1 : +frames;
for (let i = 0; i < n; i++) {
  const t = frames === 'still' ? +(process.env.T ?? 0.12) : (i / n) * LOOP;
  const tag = frames === 'still' ? 'still' : String(i).padStart(3, '0');
  for (const mode of passes) {
    const url = await page.evaluate(([mode, t]) => {
      const g = window.gift; g.setMode(mode); g.setTime(t); g.render();
      return g.renderer.domElement.toDataURL('image/png');
    }, [mode, t]);
    fs.writeFileSync(path.join(outDir, `${mode}_${tag}.png`), Buffer.from(url.split(',')[1], 'base64'));
  }
  if (n > 1 && i % 15 === 0) console.log(`${id}: frame ${i + 1}/${n}`);
}
await browser.close();
server.close();
