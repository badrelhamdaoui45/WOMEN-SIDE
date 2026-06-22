const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname);
let updatedFilesCount = 0;

function processFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return;
  }

  let newContent = content;

  // 1. Process <a> tags containing donner.womenside.org
  newContent = newContent.replace(/<a\s+([^>]+)>/gi, (match, attrs) => {
    if (/href="https?:\/\/donner\.womenside\.org\/[^"]*"/i.test(attrs)) {
      // Replace the external link with the local absolute URL
      let newAttrs = attrs.replace(/href="https?:\/\/donner\.womenside\.org\/[^"]*"/i, 'href="http://127.0.0.1:8080/faire-un-don/"');
      // Remove target="_blank"
      newAttrs = newAttrs.replace(/\s*target="_blank"/gi, '');
      // Remove rel="noopener" or rel="noopener noreferrer" for local links
      newAttrs = newAttrs.replace(/\s*rel="[^"]*"/gi, '');
      // Clean up duplicate spaces
      newAttrs = newAttrs.replace(/\s+/g, ' ').trim();
      return `<a ${newAttrs}>`;
    }
    return match;
  });

  // 2. Fallback replacement for any raw links to donner.womenside.org
  newContent = newContent.replace(/https?:\/\/donner\.womenside\.org\/[^"\s]*/gi, 'http://127.0.0.1:8080/faire-un-don/');

  // 3. Update any relative faire-un-don links to the local absolute URL
  newContent = newContent.replace(/href="\/faire-un-don\/?([^"\s]*)"/gi, 'href="http://127.0.0.1:8080/faire-un-don/"');

  if (newContent !== content) {
    try {
      fs.writeFileSync(filePath, newContent, 'utf8');
      updatedFilesCount++;
    } catch (e) {
      console.error(`Error writing to file ${filePath}:`, e.message);
    }
  }
}

function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir);
  } catch (e) {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e);
    let stat;
    try {
      stat = fs.statSync(full);
    } catch (err) {
      continue;
    }
    if (stat.isDirectory()) {
      if (e !== 'node_modules' && e !== '.git' && e !== 'fondationdesfemmes_download') {
        walk(full);
      }
    } else if (stat.isFile() && e.endsWith('.html')) {
      processFile(full);
    }
  }
}

console.log('Scanning and updating all donation links to http://127.0.0.1:8080/faire-un-don/...');
walk(rootDir);
console.log(`Scan completed. Updated ${updatedFilesCount} files.`);
