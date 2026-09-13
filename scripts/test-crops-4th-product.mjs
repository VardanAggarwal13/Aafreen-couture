import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/4th';
const outputDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod4_crops';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Check dimensions and test crops
async function run() {
  // 1. Hero candidate from _A742123 (7008 x 4672)
  // Suit is roughly from X = 1300 to X = 5600, Y = 600 to Y = 4672
  // For 4:5: height = 4400, width = 3520.
  // Center of bench is around X = 3500. left = 3500 - 1760 = 1740.
  await sharp(path.join(inputDir, '_A742123.JPG'))
    .rotate()
    .extract({ left: 1650, top: 300, width: 3450, height: 4312 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(outputDir, '1_hero_from_123.jpg'));
  console.log('1_hero_from_123.jpg created');

  // Alternative hero from _A742126 (4672 x 7008 after rotate)
  await sharp(path.join(inputDir, '_A742126.JPG'))
    .rotate()
    .extract({ left: 350, top: 1800, width: 3950, height: 4937 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(outputDir, '1_hero_from_126.jpg'));
  console.log('1_hero_from_126.jpg created');

  // 2. Kameez embroidery jaal from _A742129 (4672 x 7008 after rotate)
  // Close up on the floral fan medallion and jaal
  await sharp(path.join(inputDir, '_A742129.JPG'))
    .rotate()
    .extract({ left: 0, top: 1100, width: 4672, height: 5840 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(outputDir, '2_kameez_jaal.jpg'));
  console.log('2_kameez_jaal.jpg created');

  // 3. Dupatta & gotta patti border from _A742130 (7008 x 4672)
  // Close up on the corner medallion and gold fringe
  await sharp(path.join(inputDir, '_A742130.JPG'))
    .rotate()
    .extract({ left: 700, top: 0, width: 3737, height: 4672 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(outputDir, '3_dupatta_fringe.jpg'));
  console.log('3_dupatta_fringe.jpg created');

  // 4. Handcrafted Bridal Purse from _A742128 (4672 x 7008 after rotate)
  await sharp(path.join(inputDir, '_A742128.JPG'))
    .rotate()
    .extract({ left: 0, top: 1800, width: 4672, height: 5840 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(outputDir, '4_bridal_purse.jpg'));
  console.log('4_bridal_purse.jpg created');

  // 5. Editorial angle with pooling dupatta from _A742131 (4672 x 7008 after rotate)
  await sharp(path.join(inputDir, '_A742131.JPG'))
    .rotate()
    .extract({ left: 0, top: 1100, width: 4672, height: 5840 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(outputDir, '5_editorial_drape.jpg'));
  console.log('5_editorial_drape.jpg created');
}

run().catch(console.error);
