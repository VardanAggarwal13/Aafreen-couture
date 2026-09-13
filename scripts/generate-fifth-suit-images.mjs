import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/5th';
const outputDir = path.resolve('public/images/products');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 4:5 aspect ratio crops (1200 x 1500)
const configs = [
  {
    output: 'jahanara-sapphire-blue-silk-suit-1.webp',
    file: '_A742159.JPG',
    rotate: true,
    desc: 'Hero View: Angled table ensemble with draped sapphire blue raw silk, chevron embroidery, and palm ambiance',
    extract: { left: 236, top: 1200, width: 4200, height: 5250 },
  },
  {
    output: 'jahanara-sapphire-blue-silk-suit-2.webp',
    file: '_A742156.JPG',
    rotate: true,
    desc: 'Macro Embroidery Detail: Handcrafted bullion zardozi chevron border, micro-sequins, pearls, and magenta silk florets',
    extract: { left: 136, top: 1400, width: 4400, height: 5500 },
  },
  {
    output: 'jahanara-sapphire-blue-silk-suit-3.webp',
    file: '_A742152.JPG',
    rotate: true,
    desc: 'Dual Panel Flat-Lay: Presentation chest showcasing scalloped floral border panel and arched hemline with heirloom tikka',
    extract: { left: 1750, top: 80, width: 3600, height: 4500 },
  },
  {
    output: 'jahanara-sapphire-blue-silk-suit-4.webp',
    file: '_A742155.JPG',
    rotate: true,
    desc: 'Boutique Presentation Box: 3D perspective of the luxury gifting chest with embossed gold trim and tissue fold',
    extract: { left: 86, top: 850, width: 2900, height: 3625 },
  },
  {
    output: 'jahanara-sapphire-blue-silk-suit-5.webp',
    file: '_A742154.JPG',
    customRotate: 270,
    desc: 'Heirloom Jewelry Detail: Handcrafted royal kundan & pearl passa/tikka ornament against sapphire raw silk',
    extract: { left: 256, top: 900, width: 2560, height: 3200 },
  },
  {
    output: 'jahanara-sapphire-blue-silk-suit-6.webp',
    file: '_A742157.JPG',
    rotate: true,
    desc: 'Editorial Floor Drape: Fluid sheer raw silk fabric cascading down the table to the floor with embroidered hem edge',
    extract: { left: 36, top: 1100, width: 4600, height: 5750 },
  },
];

async function generateImages() {
  console.log('Generating 6 WebP images for Jahanara Sapphire Blue Silk Suit...');
  for (const item of configs) {
    const inPath = path.join(inputDir, item.file);
    const outPath = path.join(outputDir, item.output);

    let pipeline = sharp(inPath);
    if (item.customRotate) {
      pipeline = pipeline.rotate(item.customRotate);
    } else if (item.rotate) {
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
