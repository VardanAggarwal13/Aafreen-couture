import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/3rd';
const outputDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod3_crops';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Target aspect ratio 4:5 -> 1200 x 1500
const tests = [
  // 1. Hero from _A742097 (7008 x 4672)
  {
    name: '1_hero_optA',
    file: '_A742097.JPG',
    extract: { left: 1680, top: 400, width: 3400, height: 4250 },
  },
  {
    name: '1_hero_optB_centered',
    file: '_A742097.JPG',
    extract: { left: 1550, top: 200, width: 3550, height: 4437 },
  },
  {
    name: '1_hero_optC_tighter',
    file: '_A742097.JPG',
    extract: { left: 1800, top: 600, width: 3200, height: 4000 },
  },

  // 2. Neckline from _A742106 (3072 x 4608 after rotate)
  {
    name: '2_neckline_detail',
    file: '_A742106.JPG',
    extract: { left: 0, top: 150, width: 3072, height: 3840 },
  },

  // 3. Dupatta from _A742107 (3072 x 4608 after rotate)
  {
    name: '3_dupatta_border',
    file: '_A742107.JPG',
    extract: { left: 0, top: 500, width: 3072, height: 3840 },
  },

  // 4. Potli bag from _A742116 (4608 x 3072)
  {
    name: '4_potli_accessory',
    file: '_A742116.JPG',
    extract: { left: 1070, top: 0, width: 2457, height: 3072 },
  },

  // 5. Editorial from _A742098 (7008 x 4672)
  {
    name: '5_editorial_ambiance',
    file: '_A742098.JPG',
    extract: { left: 1600, top: 300, width: 3450, height: 4312 },
  },

  // 6. Angled Neckline with Ruby Kundan Jewelry from _A742105 (3072 x 4608 after rotate)
  {
    name: '6_angled_neckline_jewelry',
    file: '_A742105.JPG',
    extract: { left: 0, top: 0, width: 3072, height: 3840 },
  },
];

async function run() {
  for (const item of tests) {
    const inPath = path.join(inputDir, item.file);
    const outPath = path.join(outputDir, `${item.name}.jpg`);

    const img = sharp(inPath).rotate();
    await img
      .extract(item.extract)
      .resize({ width: 1200, height: 1500, fit: 'cover' })
      .jpeg({ quality: 88 })
      .toFile(outPath);

    console.log(`Created ${item.name}.jpg (1200x1500)`);
  }
}

run().catch(console.error);
