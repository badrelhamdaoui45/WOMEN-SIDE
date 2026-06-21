const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname);

// Regexes to match the button <a> tags nested inside widgets cf0eab1 and 20bc3bd
const CF0EAB1_GENERIC_REGEX = /(data-id="cf0eab1"[\s\S]*?<a[^>]+href=")[^"]+("[^>]*)/i;
const W20BC3BD_REGEX = /(data-id="20bc3bd"[\s\S]*?<a[^>]+href=")[^"]+("[^>]*)/i;

let updated = 0;

function processFile(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch(e) { return; }

  let modified = false;

  // 1. Process widget cf0eab1 (Footer Button)
  if (content.includes('data-id="cf0eab1"')) {
    const newContent = content.replace(CF0EAB1_GENERIC_REGEX, (match, p1, p2) => {
      const cleanP2 = p2.replace(/\s*target="_blank"/gi, '').replace(/\s+/g, ' ');
      return p1 + '/faire-un-don/' + cleanP2;
    });
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }

  // 2. Process widget 20bc3bd (Popup/Alternative Button)
  if (content.includes('data-id="20bc3bd"')) {
    const newContent = content.replace(W20BC3BD_REGEX, (match, p1, p2) => {
      const cleanP2 = p2.replace(/\s*target="_blank"/gi, '').replace(/\s+/g, ' ');
      return p1 + '/faire-un-don/' + cleanP2;
    });
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }

  if (modified) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      updated++;
    } catch(e) {
      console.error('Write error:', filePath);
    }
  }
}

function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir); } catch(e) { return; }
  for (const e of entries) {
    const full = path.join(dir, e);
    let stat; try { stat = fs.statSync(full); } catch(err) { continue; }
    if (stat.isDirectory() && !e.startsWith('.') && e !== 'node_modules' && e !== 'fondationdesfemmes_download') {
      walk(full);
    } else if (stat.isFile() && e.endsWith('.html')) {
      processFile(full);
    }
  }
}

console.log('Fixing all footer "Je donne" links...');
walk(rootDir);
console.log('Done. Updated:', updated, 'pages.');
