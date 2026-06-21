const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname);

const CSS_INJECT = `<link rel="stylesheet" href="/wp-content/themes/hello-elementor/assets/css/menu-fix.css">`;
const JS_INJECT  = `<script src="/wp-content/themes/hello-elementor/assets/js/menu-fix.js" defer></script>`;

// Relative path helper — compute path from file's dir back to root
function relPath(fromFile, assetAbsPath) {
  const fromDir = path.dirname(fromFile);
  return path.relative(fromDir, assetAbsPath).replace(/\\/g, '/');
}

let updated = 0;
let skipped = 0;

function processFile(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch (e) { console.error('Read error:', filePath); return; }

  let changed = false;
  let out = content;

  // 1. Fix hardcoded localhost:8080 in inline JS configs
  if (out.includes('localhost:8080')) {
    out = out.replace(/http:\\\/\\\/localhost:8080\\\//g, '\\/');
    out = out.replace(/http:\/\/localhost:8080\//g, '/');
    out = out.replace(/"http:\\\/\\\/localhost:8080"/g, '"/"');
    changed = true;
  }

  // 2. Inject menu-fix.css before </head>
  if (out.includes('</head>') && !out.includes('menu-fix.css')) {
    out = out.replace('</head>', CSS_INJECT + '\n' + JS_INJECT + '\n</head>');
    changed = true;
  }

  if (changed) {
    try { fs.writeFileSync(filePath, out, 'utf8'); updated++; }
    catch (e) { console.error('Write error:', filePath); }
  } else {
    skipped++;
  }
}

function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir); } catch (e) { return; }
  for (const entry of entries) {
    const full = path.join(dir, entry);
    let stat;
    try { stat = fs.statSync(full); } catch (e) { continue; }
    if (stat.isDirectory()) {
      // Skip hidden dirs and the download folder
      if (!entry.startsWith('.') && entry !== 'fondationdesfemmes_download') {
        walk(full);
      }
    } else if (entry.endsWith('.html') || entry === 'index.html') {
      processFile(full);
    }
  }
}

console.log('Injecting menu fix + patching localhost URLs across all HTML pages...');
walk(rootDir);
console.log(`Done. Updated: ${updated} files, Skipped: ${skipped} files.`);
