/**
 * Download all images referenced in content.json from Supabase Storage
 * and rewrite paths to local /images/static/ URLs.
 *
 * Run: node scripts/download-static-images.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const CONTENT_PATH = path.join(ROOT, 'src/lib/data/static/content.json');
const OUT_DIR = path.join(ROOT, 'public/images/static');

function download(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

function localNameFromUrl(url) {
  const parts = url.split('/');
  const raw = parts[parts.length - 1].split('?')[0];
  return raw.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function collectUrls(obj, set) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item) => collectUrls(item, set));
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (
      (key === 'file_path' || key === 'hero_background_image_url' || key === 'path') &&
      typeof value === 'string' &&
      value.startsWith('http')
    ) {
      set.add(value);
    } else if (typeof value === 'object') {
      collectUrls(value, set);
    }
  }
}

function rewriteUrls(obj, urlMap) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => rewriteUrls(item, urlMap));
  const out = { ...obj };
  for (const [key, value] of Object.entries(out)) {
    if (
      (key === 'file_path' || key === 'hero_background_image_url' || key === 'path') &&
      typeof value === 'string' &&
      urlMap.has(value)
    ) {
      out[key] = urlMap.get(value);
    } else if (typeof value === 'object' && value !== null) {
      out[key] = rewriteUrls(value, urlMap);
    }
  }
  return out;
}

async function main() {
  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
  const urls = new Set();
  collectUrls(content, urls);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const urlMap = new Map();
  let ok = 0;
  let fail = 0;

  for (const url of urls) {
    const filename = localNameFromUrl(url);
    const dest = path.join(OUT_DIR, filename);
    const localUrl = `/images/static/${filename}`;

    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      urlMap.set(url, localUrl);
      ok++;
      console.log(`↷ exists ${filename}`);
      continue;
    }

    try {
      const buf = await download(url);
      fs.writeFileSync(dest, buf);
      urlMap.set(url, localUrl);
      ok++;
      console.log(`✓ ${filename} (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      fail++;
      console.error(`✗ ${url}: ${e.message}`);
    }
  }

  const updated = rewriteUrls(content, urlMap);
  updated.imagesLocalizedAt = new Date().toISOString();
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(updated, null, 2));

  console.log(`\nDone: ${ok} local, ${fail} failed, ${urls.size} total URLs`);
  console.log(`Images: public/images/static/`);
  console.log(`Updated: src/lib/data/static/content.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
