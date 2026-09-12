import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const targetDir = 'c:/Users/vardan/projects/couture/Aafreen-couture/public/images/products';
const c1Dir = 'c:/Users/vardan/projects/couture/un-stitched/1st';
const c2Dir = 'c:/Users/vardan/projects/couture/un-stitched/1st/2nd color';

// Intelligent 3:4 aspect ratio luxury crop
// Output dimensions: 1200 x 1600 (standard 3:4 luxury ecommerce format)

const blackImages = [
  {
    src: path.join(c1Dir, '_A742141.JPG'),
    dest: 'zeenat-black-handcrafted-luxury-suit-2141.webp',
    type: 'portrait',
    cropTop: 750, // eliminates ceiling/AC, perfectly frames mannequin from collar down to hem
  },
  {
    src: path.join(c1Dir, '_A742147.JPG'),
    dest: 'zeenat-black-handcrafted-luxury-suit-2147.webp',
    type: 'landscape', // 7008 x 4672, center 3504 x 4672
    centerOffset: 0,
  },
  {
    src: path.join(c1Dir, '_A742143.JPG'),
    dest: 'zeenat-black-handcrafted-luxury-suit-2143.webp',
    type: 'portrait',
    cropTop: 700,
  },
  {
    src: path.join(c1Dir, '_A742150.JPG'),
    dest: 'zeenat-black-handcrafted-luxury-suit-2150.webp',
    type: 'portrait',
    cropTop: 500, // focus on hand embroidery motif
  },
  {
    src: path.join(c1Dir, '_A742149.JPG'),
    dest: 'zeenat-black-handcrafted-luxury-suit-2149.webp',
    type: 'portrait',
    cropTop: 750,
  },
  {
    src: path.join(c1Dir, '_A742140.JPG'),
    dest: 'zeenat-black-handcrafted-luxury-suit-2140.webp',
    type: 'portrait',
    cropTop: 750,
  },
];

const maroonImages = [
  {
    src: path.join(c2Dir, '_A742075.JPG'),
    dest: 'zeenat-maroon-handcrafted-luxury-suit-2075.webp',
    type: 'portrait',
    cropTop: 750, // primary frontal hero shot
  },
  {
    src: path.join(c2Dir, '_A742076.JPG'),
    dest: 'zeenat-maroon-handcrafted-luxury-suit-2076.webp',
    type: 'portrait',
    cropTop: 750, // bodice shot
  },
  {
    src: path.join(c2Dir, '_A742077.JPG'),
    dest: 'zeenat-maroon-handcrafted-luxury-suit-2077.webp',
    type: 'portrait',
    cropTop: 500, // close-up of amber kundan neckline
  },
  {
    src: path.join(c2Dir, '_A742078.JPG'),
    dest: 'zeenat-maroon-handcrafted-luxury-suit-2078.webp',
    type: 'portrait',
    cropTop: 500, // central pendant motif
  },
  {
    src: path.join(c2Dir, '_A742079.JPG'),
    dest: 'zeenat-maroon-handcrafted-luxury-suit-2079.webp',
    type: 'landscape', // 7008 x 4672, center 3504 x 4672
    centerOffset: 0,
  },
  {
    src: path.join(c2Dir, '_A742082.JPG'),
    dest: 'zeenat-maroon-handcrafted-luxury-suit-2082.webp',
    type: 'portrait',
    cropTop: 700, // 3/4 angle
  },
];

async function processImage(item) {
  const destPath = path.join(targetDir, item.dest);
  
  // Rotate first to bake in the EXIF orientation
  const rotatedBuffer = await sharp(item.src).rotate().toBuffer();
  const img = sharp(rotatedBuffer);
  const meta = await img.metadata();

  let extractArea;

  if (meta.width > meta.height) {
    // Landscape image: extract 3:4 portrait from center
    const targetWidth = Math.round((meta.height * 3) / 4);
    const left = Math.max(0, Math.round((meta.width - targetWidth) / 2) + (item.centerOffset || 0));
    extractArea = {
      left: Math.min(left, meta.width - targetWidth),
      top: 0,
      width: targetWidth,
      height: meta.height,
    };
  } else {
    // Portrait image: height is ~7008, width is ~4672
    // Target 3:4 height is Math.round(meta.width * 4 / 3) = 6229
    const targetHeight = Math.min(meta.height, Math.round((meta.width * 4) / 3));
    const maxTop = meta.height - targetHeight;
    const top = Math.min(Math.max(0, item.cropTop ?? 750), maxTop);
    extractArea = {
      left: 0,
      top: top,
      width: meta.width,
      height: targetHeight,
    };
  }

  await img
    .extract(extractArea)
    .resize(1200, 1600, { fit: 'fill' }) // exact 3:4 target
    .webp({ quality: 85, effort: 4 })
    .toFile(destPath);

  const s = fs.statSync(destPath);
  console.log(`✓ Processed ${item.dest} (${Math.round(s.size / 1024)} KB, 1200x1600 3:4)`);
}

async function main() {
  console.log('--- Processing Color 1: Midnight Onyx Black ---');
  for (const item of blackImages) {
    await processImage(item);
  }

  console.log('\n--- Processing Color 2: Crimson Maroon / Ruby Wine ---');
  for (const item of maroonImages) {
    await processImage(item);
  }

  console.log('\nAll images processed with perfect 3:4 proportion and zero vertical distortion!');
}

main().catch((err) => {
  console.error('Processing error:', err);
  process.exit(1);
});
