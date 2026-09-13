import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/5th';
const cropDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod5_crops';

if (!fs.existsSync(cropDir)) {
  fs.mkdirSync(cropDir, { recursive: true });
}

async function testCrops() {
  // 1. Hero Option A from _A742158 (Landscape 7008x4672, Orient 1)
  // Centered 4:5 crop on the folded silk
  // 4:5 -> width = 4672 * 0.8 = 3737
  await sharp(path.join(inputDir, '_A742158.JPG'))
    .rotate()
    .extract({ left: 1100, top: 0, width: 3737, height: 4672 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(path.join(cropDir, '1_hero_optA_flatlay.jpg'));

  // 2. Hero Option B from _A742159 (Portrait 4672x7008, Orient 8)
  // 4:5 -> height = 4672 / 0.8 = 5840
  await sharp(path.join(inputDir, '_A742159.JPG'))
    .rotate()
    .extract({ left: 0, top: 1168, width: 4672, height: 5840 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(path.join(cropDir, '1_hero_optB_angled_table.jpg'));

  // 3. Hero Option C from _A742152 (Landscape 7008x4672, Orient 1)
  // Luxury gift box showing both panels
  // 4:5 -> width = 4672 * 0.8 = 3737
  await sharp(path.join(inputDir, '_A742152.JPG'))
    .rotate()
    .extract({ left: 1600, top: 0, width: 3737, height: 4672 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(path.join(cropDir, '1_hero_optC_giftbox.jpg'));

  // 4. Macro Embroidery from _A742156 (Portrait 4672x7008, Orient 8)
  // Tight crop on the corner chevron
  await sharp(path.join(inputDir, '_A742156.JPG'))
    .rotate()
    .extract({ left: 0, top: 1500, width: 4672, height: 5500 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(path.join(cropDir, '2_macro_embroidery.jpg'));

  // 5. Heirloom Jewelry from _A742154 (Landscape 4608x3072, Orient 1)
  // 4:5 -> width = 3072 * 0.8 = 2457
  await sharp(path.join(inputDir, '_A742154.JPG'))
    .rotate()
    .extract({ left: 400, top: 0, width: 2457, height: 3072 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(path.join(cropDir, '3_tikka_jewelry.jpg'));

  // 6. Boutique Gift Packaging from _A742155 (Portrait 3072x4608, Orient 8)
  // 4:5 -> height = 3072 / 0.8 = 3840
  await sharp(path.join(inputDir, '_A742155.JPG'))
    .rotate()
    .extract({ left: 0, top: 500, width: 3072, height: 3840 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(path.join(cropDir, '4_packaging_angle.jpg'));

  // 7. Editorial Table Drape from _A742157 (Portrait 4672x7008, Orient 8)
  await sharp(path.join(inputDir, '_A742157.JPG'))
    .rotate()
    .extract({ left: 0, top: 1000, width: 4672, height: 5840 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(path.join(cropDir, '5_editorial_table_drape.jpg'));

  console.log('Tested crops generated successfully!');
}

testCrops().catch(console.error);
