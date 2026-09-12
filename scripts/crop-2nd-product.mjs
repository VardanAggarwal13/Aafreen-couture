import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/2nd';
const outputDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod2_crops';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 4:5 aspect ratio crops
const cropConfigs = [
  {
    name: '1_hero_full',
    file: '_A742085.JPG',
    desc: 'Front Hero View: Complete suit ensemble with potli on draped stand',
    extract: { left: 0, top: 850, width: 4672, height: 5840 },
  },
  {
    name: '2_embroidery_panel',
    file: '_A742089.JPG',
    desc: 'Embroidery Detail: Front kameez artisanal floral jaal and border',
    extract: { left: 200, top: 1200, width: 4272, height: 5340 },
  },
  {
    name: '3_macro_border',
    file: '_A742092.JPG',
    desc: 'Artisanal Close-up: Handcrafted zardozi, sequins and bullion hemline',
    extract: { left: 0, top: 1000, width: 4672, height: 5840 },
  },
  {
    name: '4_boutique_editorial',
    file: '_A742091.JPG',
    desc: 'Editorial View: Ensemble with boutique ambiance and Kundan heritage accents',
    extract: { left: 0, top: 750, width: 4672, height: 5840 },
  },
  {
    name: '5_overhead_drape',
    file: '_A742090.JPG',
    desc: 'Fabric Drape View: Silk texture, embroidery flow and coordinated potli',
    // _A742090 is landscape 7008 x 4672. For 4:5 ratio: height=4672 -> width=3737
    extract: { left: 1600, top: 0, width: 3737, height: 4672 },
    isLandscape: true,
  },
];

async function run() {
  for (const item of cropConfigs) {
    const inPath = path.join(inputDir, item.file);
    const outPath = path.join(outputDir, `${item.name}.jpg`);

    let pipeline = sharp(inPath);
    if (!item.isLandscape) {
      pipeline = pipeline.rotate(); // Auto-rotate EXIF orientation
    }

    await pipeline
      .extract(item.extract)
      .resize({ width: 1200, height: 1500, fit: 'cover' })
      .jpeg({ quality: 88 })
      .toFile(outPath);

    console.log(`Created ${item.name}.jpg (1200x1500 4:5)`);
  }
}

run().catch(console.error);
