import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/2nd';
const outputDir = path.resolve('public/images/products');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 4:5 aspect ratio crops optimized for the luxury catalog
const configs = [
  {
    output: 'mehrunisa-honey-gold-silk-suit-1.webp',
    file: '_A742085.JPG',
    desc: 'Hero View: Focused front shot with complete suit drape and potli bag',
    extract: { left: 376, top: 1950, width: 3920, height: 4900 },
  },
  {
    output: 'mehrunisa-honey-gold-silk-suit-2.webp',
    file: '_A742089.JPG',
    desc: 'Artisanal Jaal: Front kameez intricate floral metallic embroidery',
    extract: { left: 200, top: 1200, width: 4272, height: 5340 },
  },
  {
    output: 'mehrunisa-honey-gold-silk-suit-3.webp',
    file: '_A742092.JPG',
    desc: 'Macro Craftsmanship: Bullion zardozi, hand-set micro-sequins and scalloped hemline',
    extract: { left: 0, top: 1000, width: 4672, height: 5840 },
  },
  {
    output: 'mehrunisa-honey-gold-silk-suit-4.webp',
    file: '_A742090.JPG',
    desc: 'Overhead Drape: Silk sheen, floral layout and potli details',
    extract: { left: 1600, top: 0, width: 3737, height: 4672 },
    isLandscape: true,
  },
  {
    output: 'mehrunisa-honey-gold-silk-suit-5.webp',
    file: '_A742091.JPG',
    desc: 'Boutique Editorial: Regal ambiance with bridal Kundan jewelry and velvet drapery',
    extract: { left: 0, top: 750, width: 4672, height: 5840 },
  },
];

async function generateImages() {
  console.log('Generating 5 WebP images for Mehrunisa Honey Gold Silk Suit...');
  for (const item of configs) {
    const inPath = path.join(inputDir, item.file);
    const outPath = path.join(outputDir, item.output);

    let pipeline = sharp(inPath);
    if (!item.isLandscape) {
      pipeline = pipeline.rotate();
    }

    await pipeline
      .extract(item.extract)
      .resize({ width: 1200, height: 1500, fit: 'cover' })
      .webp({ quality: 86, effort: 6 })
      .toFile(outPath);

    const stats = fs.statSync(outPath);
    console.log(`✅ Saved ${item.output} (${(stats.size / 1024).toFixed(1)} KB) - ${item.desc}`);
  }
}

generateImages().catch((err) => {
  console.error('Error generating images:', err);
  process.exit(1);
});
