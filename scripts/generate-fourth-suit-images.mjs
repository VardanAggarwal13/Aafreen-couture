import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/4th';
const outputDir = path.resolve('public/images/products');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 4:5 aspect ratio crops (1200 x 1500)
const configs = [
  {
    output: 'nilofer-orchid-pink-silk-suit-1.webp',
    file: '_A742123.JPG',
    desc: 'Hero View: Front ensemble with embroidered shirt, sheer dupatta, bridal purse, and brass chest',
    extract: { left: 1650, top: 300, width: 3450, height: 4312 },
  },
  {
    output: 'nilofer-orchid-pink-silk-suit-2.webp',
    file: '_A742129.JPG',
    desc: 'Artisanal Kameez Jaal: Bullion metallic vines, micro-sequins florets, and arched peacock medallions',
    extract: { left: 0, top: 1100, width: 4672, height: 5840 },
  },
  {
    output: 'nilofer-orchid-pink-silk-suit-3.webp',
    file: '_A742123.JPG',
    desc: 'Multicolor Hemline Border: Jeweled Mughal arches with amber, saffron, and fuchsia insets',
    extract: { left: 3200, top: 1600, width: 2400, height: 3000 },
  },
  {
    output: 'nilofer-orchid-pink-silk-suit-4.webp',
    file: '_A742130.JPG',
    desc: 'Dupatta & Gotta Fringe: Pure organza with gold gotta patti fringe, contrast taping, and floral medallion',
    extract: { left: 700, top: 0, width: 3737, height: 4672 },
  },
  {
    output: 'nilofer-orchid-pink-silk-suit-5.webp',
    file: '_A742128.JPG',
    desc: 'Bridal Purse Accessory: Handcrafted clutch with mirrorwork, metallic embroidery, and pearl tassels',
    extract: { left: 436, top: 2200, width: 3800, height: 4750 },
  },
  {
    output: 'nilofer-orchid-pink-silk-suit-6.webp',
    file: '_A742131.JPG',
    desc: 'Editorial Drape: Cascading sheer organza dupatta pooling to the floor with antique bench and tall vases',
    extract: { left: 0, top: 1100, width: 4672, height: 5840 },
  },
];

async function generateImages() {
  console.log('Generating 6 WebP images for Nilofer Orchid Pink Silk Suit...');
  for (const item of configs) {
    const inPath = path.join(inputDir, item.file);
    const outPath = path.join(outputDir, item.output);

    await sharp(inPath)
      .rotate()
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
