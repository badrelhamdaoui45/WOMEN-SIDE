const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname);

// Regex to find the footer container data-id="20bc3bd" and capture up to the nested <a> tag's href
// Example markup:
// <div class="... elementor-element-20bc3bd ..." data-id="20bc3bd" ...>
//      <a class="..." href="https://donner.womenside.org/je-fais-un-don/~mon-don" target="_blank">
// We want to replace the href with "/faire-un-don/" and remove target="_blank"
const FOOTER_DONATE_REGEX = /(data-id="20bc3bd"[\s\S]*?<a[^>]+href=")[^"]+("[^>]*)/i;

let updated = 0;

function processFile(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch(e) { return; }

  if (!content.includes('data-id="20bc3bd"')) return;

  const newContent = content.replace(FOOTER_DONATE_REGEX, (match, p1, p2) => {
    // Remove target="_blank" and extra spaces from the remaining attributes of the <a> tag
    const cleanP2 = p2.replace(/\s*target="_blank"/gi, '').replace(/\s+/g, ' ');
    return p1 + '/faire-un-don/' + cleanP2;
  });

  if (newContent !== content) {
    try {
      fs.writeFileSync(filePath, newContent, 'utf8');
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

console.log('Fixing footer "Je donne" links...');
walk(rootDir);
console.log('Done. Updated:', updated, 'pages.');
