const sharp = require('sharp');
const path = require('path');

const inputPath = path.resolve('C:/Users/badre/.gemini/antigravity-ide/brain/8c1e6af0-a4bc-4d2b-a43b-70ccd073b816/visuel_newsletter_women_side_1782070775792.png');

const uploadsDir = 'C:/Users/badre/Desktop/WOMEN-SIDE/wp-content/uploads/2026/02';

async function removeWhiteBackground() {
  console.log('Loading image...');

  // Get raw pixel data
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Image: ${width}x${height}, ${channels} channels`);

  const buf = Buffer.from(data);

  // Threshold for "white" — anything above 240 on all channels
  const WHITE_THRESHOLD = 230;
  const EDGE_FEATHER = 15; // pixels from edge for flood fill start

  // Step 1: flood fill from all 4 corners to mark white background pixels
  const visited = new Uint8Array(width * height);
  const isWhite = new Uint8Array(width * height);

  function idx(x, y) { return y * width + x; }
  function pixelIsWhite(x, y) {
    const base = (y * width + x) * channels;
    return buf[base] > WHITE_THRESHOLD &&
           buf[base + 1] > WHITE_THRESHOLD &&
           buf[base + 2] > WHITE_THRESHOLD;
  }

  // BFS flood fill from edges
  const queue = [];
  function addIfWhite(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    if (visited[idx(x, y)]) return;
    if (pixelIsWhite(x, y)) {
      visited[idx(x, y)] = 1;
      isWhite[idx(x, y)] = 1;
      queue.push([x, y]);
    }
  }

  // Seed from all 4 edges
  for (let x = 0; x < width; x++) { addIfWhite(x, 0); addIfWhite(x, height - 1); }
  for (let y = 0; y < height; y++) { addIfWhite(0, y); addIfWhite(width - 1, y); }

  let head = 0;
  while (head < queue.length) {
    const [x, y] = queue[head++];
    addIfWhite(x + 1, y);
    addIfWhite(x - 1, y);
    addIfWhite(x, y + 1);
    addIfWhite(x, y - 1);
  }

  console.log(`Found ${queue.length} background pixels. Making transparent...`);

  // Step 2: set background pixels to transparent, with soft edge feathering
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isWhite[idx(x, y)]) {
        const base = (y * width + x) * channels;
        buf[base + 3] = 0; // fully transparent
      }
    }
  }

  // Step 3: soft feather — semi-transparent for near-white pixels adjacent to background
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!isWhite[idx(x, y)]) {
        const base = (y * width + x) * channels;
        const r = buf[base], g = buf[base+1], b2 = buf[base+2];
        // If pixel is very light but not marked as bg, reduce opacity proportionally
        if (r > 200 && g > 200 && b2 > 200) {
          const brightness = (r + g + b2) / 3;
          const alpha = Math.round(255 * (1 - ((brightness - 200) / 55)));
          buf[base + 3] = Math.max(0, Math.min(255, alpha));
        }
      }
    }
  }

  // Save as PNG (preserves transparency)
  const outputBuffer = await sharp(buf, {
    raw: { width, height, channels }
  }).png({ compressionLevel: 9 }).toBuffer();

  // Write to all newsletter image paths
  const targets = [
    `${uploadsDir}/visuel-newsletter-1.webp`,
    `${uploadsDir}/visuel-newsletter-1-245x300.webp`,
    `${uploadsDir}/visuel-newsletter-1-768x941.webp`,
    `${uploadsDir}/visuel-newsletter-1-836x1024.webp`,
  ];

  for (const target of targets) {
    // Resize to match original dimensions implied by filename, then save
    let s = sharp(outputBuffer);
    if (target.includes('245x300')) s = s.resize(245, 300, { fit: 'inside', withoutEnlargement: true });
    else if (target.includes('768x941')) s = s.resize(768, 941, { fit: 'inside', withoutEnlargement: true });
    else if (target.includes('836x1024')) s = s.resize(836, 1024, { fit: 'inside', withoutEnlargement: true });

    await s.webp({ lossless: false, quality: 90, alphaQuality: 100 }).toFile(target);
    console.log(`Saved: ${target}`);
  }

  // Also save the main PNG artifact for reference
  const artifactOut = 'C:/Users/badre/.gemini/antigravity-ide/brain/8c1e6af0-a4bc-4d2b-a43b-70ccd073b816/visuel_newsletter_no_bg.png';
  require('fs').writeFileSync(artifactOut, outputBuffer);
  console.log(`Saved transparent PNG artifact: ${artifactOut}`);
  console.log('Done!');
}

removeWhiteBackground().catch(console.error);
