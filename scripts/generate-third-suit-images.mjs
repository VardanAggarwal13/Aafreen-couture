import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/3rd';
const outputDir = path.resolve('public/images/products');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 4:5 aspect ratio crops (1200 x 1500)
const configs = [
  {
    output: 'mumtaz-rani-pink-silk-suit-1.webp',
    file: '_A742097.JPG',
    desc: 'Hero View: Front ensemble with embroidered shirt, sheer dupatta, potli, and Kundan jewelry',
    extract: { left: 1550, top: 200, width: 3550, height: 4437 },
  },
  {
    output: 'mumtaz-rani-pink-silk-suit-2.webp',
    file: '_A742106.JPG',
    desc: 'Artisanal Neckline Medallion: Symmetrical gold & silver zardozi, micro-sequins, and pearl florets',
    extract: { left: 0, top: 150, width: 3072, height: 3840 },
  },
  {
    output: 'mumtaz-rani-pink-silk-suit-3.webp',
    file: '_A742105.JPG',
    desc: 'Angled Embroidery & Jewelry: Neckline zardozi detail with ruby Kundan earrings in view',
    extract: { left: 0, top: 0, width: 3072, height: 3840 },
  },
  {
    output: 'mumtaz-rani-pink-silk-suit-4.webp',
    file: '_A742107.JPG',
    desc: 'Dupatta & Border: Pure organza dupatta with scalloped pearl trim, floral butis, and brass chest',
    extract: { left: 0, top: 500, width: 3072, height: 3840 },
  },
  {
    output: 'mumtaz-rani-pink-silk-suit-5.webp',
    file: '_A742116.JPG',
    desc: 'Bridal Potli Accessory: Handcrafted multi-strand pearl handle and mirrorwork clutch bag',
    extract: { left: 1070, top: 0, width: 2457, height: 3072 },
  },
  {
    output: 'mumtaz-rani-pink-silk-suit-6.webp',
    file: '_A742098.JPG',
    desc: 'Royal Boutique Ambiance: Full ensemble on antique carved chest with tall vases and regal drapery',
    extract: { left: 1600, top: 300, width: 3450, height: 4312 },
  },
];

async function generateImages() {
  console.log('Generating 6 WebP images for Mumtaz Rani Pink Silk Suit...');
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
