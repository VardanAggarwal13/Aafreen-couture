import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const baseDir = 'c:/Users/vardan/projects/couture/un-stitched';
const outputDir = path.resolve('public/images/products');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const suitConfigs = [
  // --- 6th Suit: Noorani Moonstone Lilac ---
  {
    folder: '6th',
    file: '_A742162.JPG',
    output: 'noorani-moonstone-lilac-silk-suit-1.webp',
    desc: 'Noorani Suit - Hero: Torso ensemble with silver zardozi, cutwork lace hem, and crystal clutch',
    extract: { left: 300, top: 1800, width: 3600, height: 4500 },
  },
  {
    folder: '6th',
    file: '_A742168.JPG',
    output: 'noorani-moonstone-lilac-silk-suit-2.webp',
    desc: 'Noorani Suit - Neckline & Tikka: Cutwork collar, crystal embellishments, and pearl tikka',
    extract: { left: 336, top: 1200, width: 4000, height: 5000 },
  },
  {
    folder: '6th',
    file: '_A742173.JPG',
    output: 'noorani-moonstone-lilac-silk-suit-3.webp',
    desc: 'Noorani Suit - Macro Hemline: Scalloped schiffli cutwork lace and silver resham embroidery',
    extract: { left: 236, top: 1000, width: 4200, height: 5250 },
  },
  {
    folder: '6th',
    file: '_A742172.JPG',
    output: 'noorani-moonstone-lilac-silk-suit-4.webp',
    desc: 'Noorani Suit - Dupatta Detail: Sheer organza with chinar leaf motif and scalloped floral border',
    extract: { left: 0, top: 1800, width: 3800, height: 4750 },
  },
  {
    folder: '6th',
    file: '_A742169.JPG',
    output: 'noorani-moonstone-lilac-silk-suit-5.webp',
    desc: 'Noorani Suit - Accessory: Handcrafted crescent crystal bridal clutch with silver beaded strap',
    extract: { left: 600, top: 1800, width: 3600, height: 4500 },
  },
  {
    folder: '6th',
    file: '_A742166.JPG',
    output: 'noorani-moonstone-lilac-silk-suit-6.webp',
    desc: 'Noorani Suit - Editorial Drape: Flowing sheer organza dupatta cascading across floor with carved vases',
    extract: { left: 0, top: 1100, width: 4672, height: 5840 },
  },

  // --- 7th Suit: Gul-e-Rana Dusty Rose ---
  {
    folder: '7th',
    file: '_A742175.JPG',
    output: 'gulerana-dusty-rose-silk-suit-1.webp',
    desc: 'Gul-e-Rana Suit - Hero: Folded dusty rose georgette with antique gold peacock and sheer dupatta',
    extract: { left: 236, top: 1300, width: 4200, height: 5250 },
  },
  {
    folder: '7th',
    file: '_A742178.JPG',
    output: 'gulerana-dusty-rose-silk-suit-2.webp',
    desc: 'Gul-e-Rana Suit - Macro Collar: Heavy antique bullion zardozi paisley neckline and kundan accents',
    extract: { left: 1700, top: 80, width: 3600, height: 4500 },
  },
  {
    folder: '7th',
    file: '_A742181.JPG',
    output: 'gulerana-dusty-rose-silk-suit-3.webp',
    desc: 'Gul-e-Rana Suit - 3D Perspective: Table perspective of folded georgette, trousers, and gotta patti fringe',
    extract: { left: 236, top: 1400, width: 4200, height: 5250 },
  },
  {
    folder: '7th',
    file: '_A742182.JPG',
    output: 'gulerana-dusty-rose-silk-suit-4.webp',
    desc: 'Gul-e-Rana Suit - Flat-lay: Detailed top-down view of heavy zardozi vines and collar panel',
    extract: { left: 1000, top: 80, width: 3600, height: 4500 },
  },

  // --- 8th Suit: Pariwash Sage Mint ---
  {
    folder: '8th',
    file: '_A742183.JPG',
    output: 'pariwash-sage-mint-silk-suit-1.webp',
    desc: 'Pariwash Suit - Hero: Folded sage mint chanderi silk with contrast mauve base and marble Ganesha',
    extract: { left: 1700, top: 86, width: 3600, height: 4500 },
  },
  {
    folder: '8th',
    file: '_A742184.JPG',
    output: 'pariwash-sage-mint-silk-suit-2.webp',
    desc: 'Pariwash Suit - Macro Neckline: Intricate antique gold marodi & tilla cord embroidery',
    extract: { left: 1700, top: 86, width: 3600, height: 4500 },
  },
  {
    folder: '8th',
    file: '_A742185.JPG',
    output: 'pariwash-sage-mint-silk-suit-3.webp',
    desc: 'Pariwash Suit - Flat-lay: Dual-tone sage mint and rose mauve chanderi fabric ensemble',
    extract: { left: 1700, top: 86, width: 3600, height: 4500 },
  },

  // --- 9th Suit: Gulrang Powder Blush ---
  {
    folder: '9th',
    file: '_A742187.JPG',
    output: 'gulrang-powder-blush-silk-suit-1.webp',
    desc: 'Gulrang Suit - Hero: Powder blush organza ensemble on round glass table with porcelain flower vase',
    extract: { left: 1700, top: 86, width: 3600, height: 4500 },
  },
  {
    folder: '9th',
    file: '_A742189.JPG',
    output: 'gulrang-powder-blush-silk-suit-2.webp',
    desc: 'Gulrang Suit - Flat-lay: Hand-painted botanical thistle flowers with gotta fringe borders',
    extract: { left: 1700, top: 86, width: 3600, height: 4500 },
  },
  {
    folder: '9th',
    file: '_A742192.JPG',
    output: 'gulrang-powder-blush-silk-suit-3.webp',
    desc: 'Gulrang Suit - Macro Botanical: Hand-painted petals highlighted with fine tilla wire & micro-sequins',
    extract: { left: 1700, top: 86, width: 3600, height: 4500 },
  },
];

async function generateAll() {
  console.log(`Starting generation of ${suitConfigs.length} WebP images for 6th, 7th, 8th, and 9th suits...`);
  for (const item of suitConfigs) {
    const inPath = path.join(baseDir, item.folder, item.file);
    const outPath = path.join(outputDir, item.output);

    await sharp(inPath)
      .rotate()
      .extract(item.extract)
      .resize({ width: 1200, height: 1500, fit: 'cover' })
      .webp({ quality: 86, effort: 6 })
      .toFile(outPath);

    const stats = fs.statSync(outPath);
    console.log(`✅ [${item.folder}] Saved ${item.output} (${(stats.size / 1024).toFixed(1)} KB) - ${item.desc}`);
  }
  console.log('All remaining suit images generated successfully!');
}

generateAll().catch(err => {
  console.error('Error generating images:', err);
  process.exit(1);
});
