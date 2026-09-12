import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceDir = 'c:/Users/vardan/projects/couture/un-stitched/1st';
const targetDir = 'c:/Users/vardan/projects/couture/Aafreen-couture/public/images/products';

const imageMapping = [
  { src: '_A742141.JPG', dest: 'zeenat-black-handcrafted-luxury-suit-2141.webp' }, // Primary frontal portrait
  { src: '_A742147.JPG', dest: 'zeenat-black-handcrafted-luxury-suit-2147.webp' }, // Bodice & neckline close-up
  { src: '_A742143.JPG', dest: 'zeenat-black-handcrafted-luxury-suit-2143.webp' }, // 3/4 perspective & sleeves
  { src: '_A742150.JPG', dest: 'zeenat-black-handcrafted-luxury-suit-2150.webp' }, // Macro embroidery detail
  { src: '_A742149.JPG', dest: 'zeenat-black-handcrafted-luxury-suit-2149.webp' }, // Showroom bokeh view
  { src: '_A742140.JPG', dest: 'zeenat-black-handcrafted-luxury-suit-2140.webp' }, // Full boutique backdrop
];

async function processImages() {
  console.log('Processing unstitched suit photoshoot images...');

  for (const item of imageMapping) {
    const srcPath = path.join(sourceDir, item.src);
    const destPath = path.join(targetDir, item.dest);

    console.log(`Converting ${item.src} -> ${item.dest}...`);

    // Rotate auto-orient, resize to 1200x1800 (standard 2:3 luxury portrait ratio)
    await sharp(srcPath)
      .rotate()
      .resize(1200, 1800, {
        fit: 'cover',
        position: item.src === '_A742147.JPG' ? 'center' : 'top'
      })
      .webp({ quality: 85, effort: 4 })
      .toFile(destPath);

    const stat = fs.statSync(destPath);
    console.log(`✓ Saved ${item.dest} (${Math.round(stat.size / 1024)} KB)`);
  }

  console.log('All images converted to WebP successfully!');
}

processImages().catch((err) => {
  console.error('Error processing images:', err);
  process.exit(1);
});
