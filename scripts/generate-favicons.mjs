import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

// Function to encode multiple PNG buffers into a standard ICO file
function createIco(pngBuffers, dimensions) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + (dirEntrySize * count);

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4); // count of images

  const entries = [];
  for (let i = 0; i < count; i++) {
    const dim = dimensions[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(dim === 256 ? 0 : dim, 0); // width (0 means 256)
    entry.writeUInt8(dim === 256 ? 0 : dim, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buf.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    entries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function generate() {
  console.log('Generating Aafreen Couture brand icons...');

  // The authentic golden peacock emblem in logo-header.webp
  // Bounding box: left: 362, top: 0, width: 272, height: 242
  const emblemHeader = sharp(path.join(rootDir, 'public/images/logo-header.webp'))
    .extract({ left: 362, top: 0, width: 272, height: 242 });

  // Center the 272x242 emblem inside a square with balanced breathing margins
  const baseEmblemSquare = await emblemHeader
    .extend({
      top: 15,
      bottom: 15,
      left: 0,
      right: 0,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  // Create high-res master PNG (512x512)
  const master512 = await sharp(baseEmblemSquare)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Create standard sizes
  const png16 = await sharp(master512).resize(16, 16, { kernel: 'lanczos3' }).png().toBuffer();
  const png32 = await sharp(master512).resize(32, 32, { kernel: 'lanczos3' }).png().toBuffer();
  const png48 = await sharp(master512).resize(48, 48, { kernel: 'lanczos3' }).png().toBuffer();
  const png180 = await sharp(master512).resize(180, 180, { kernel: 'lanczos3' }).png().toBuffer();
  const png192 = await sharp(master512).resize(192, 192, { kernel: 'lanczos3' }).png().toBuffer();

  // Generate multi-resolution ICO file containing 16x16, 32x32, and 48x48
  const icoBuffer = createIco([png16, png32, png48], [16, 32, 48]);

  // Destination paths
  const targets = [
    // Next.js App Router root icons
    { path: path.join(rootDir, 'src/app/favicon.ico'), buffer: icoBuffer },
    { path: path.join(rootDir, 'src/app/icon.png'), buffer: png32 },
    { path: path.join(rootDir, 'src/app/apple-icon.png'), buffer: png180 },

    // Public folder icons for direct links, search engines, and PWA
    { path: path.join(rootDir, 'public/favicon.ico'), buffer: icoBuffer },
    { path: path.join(rootDir, 'public/icon.png'), buffer: png32 },
    { path: path.join(rootDir, 'public/icon-192.png'), buffer: png192 },
    { path: path.join(rootDir, 'public/icon-512.png'), buffer: master512 },
    { path: path.join(rootDir, 'public/apple-icon.png'), buffer: png180 },
    { path: path.join(rootDir, 'public/logo-icon.png'), buffer: master512 },
  ];

  for (const t of targets) {
    fs.writeFileSync(t.path, t.buffer);
    console.log(`Wrote: ${path.relative(rootDir, t.path)} (${t.buffer.length} bytes)`);
  }

  console.log('All brand icons generated successfully!');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
