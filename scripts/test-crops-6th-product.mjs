import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/6th';
const cropDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod6_crops';

if (!fs.existsSync(cropDir)) {
  fs.mkdirSync(cropDir, { recursive: true });
}

async function testCrops() {
  // 1. Hero Option A from _A742166.JPG (Portrait 4672x7008)
  // Cropped around the suit on the chair with top of drape
  // 4:5 -> 3600 x 4500
  await sharp(path.join(inputDir, '_A742166.JPG'))
    .rotate()
    .extract({ left: 800, top: 2500, width: 3400, height: 4250 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 86 })
    .toFile(path.join(cropDir, '1_hero_optA_from_166.jpg'));

  // 1. Hero Option B from _A742162.JPG (Portrait 4672x7008)
  // Cropped tightly above the blur:
  // 4:5 -> 3600 x 4500
  await sharp(path.join(inputDir, '_A742162.JPG'))
    .rotate()
    .extract({ left: 300, top: 1800, width: 3600, height: 4500 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 86 })
    .toFile(path.join(cropDir, '1_hero_optB_from_162.jpg'));

  // 2. Neckline & Tikka from _A742168.JPG (Portrait 4672x7008)
  // Centered on neckline and tikka
  // 4:5 -> 4000 x 5000
  await sharp(path.join(inputDir, '_A742168.JPG'))
    .rotate()
    .extract({ left: 336, top: 1200, width: 4000, height: 5000 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 86 })
    .toFile(path.join(cropDir, '2_neckline_tikka.jpg'));

  // 3. Cutwork Hemline Border from _A742173.JPG (Portrait 4672x7008)
  // 4:5 -> 4200 x 5250
  await sharp(path.join(inputDir, '_A742173.JPG'))
    .rotate()
    .extract({ left: 236, top: 1000, width: 4200, height: 5250 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 86 })
    .toFile(path.join(cropDir, '3_cutwork_hemline.jpg'));

  // 4. Sheer Organza & Chinar Leaf from _A742172.JPG (Portrait 4672x7008)
  // 4:5 -> 3800 x 4750
  await sharp(path.join(inputDir, '_A742172.JPG'))
    .rotate()
    .extract({ left: 0, top: 1800, width: 3800, height: 4750 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 86 })
    .toFile(path.join(cropDir, '4_sheer_dupatta_leaf.jpg'));

  // 5. Crescent Crystal Clutch from _A742169.JPG (Portrait 4672x7008)
  // 4:5 -> 3600 x 4500
  await sharp(path.join(inputDir, '_A742169.JPG'))
    .rotate()
    .extract({ left: 600, top: 1800, width: 3600, height: 4500 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 86 })
    .toFile(path.join(cropDir, '5_crescent_crystal_clutch.jpg'));

  // 6. Full Editorial Floor Drape from _A742166.JPG (Portrait 4672x7008)
  // 4:5 -> 4672 x 5840
  await sharp(path.join(inputDir, '_A742166.JPG'))
    .rotate()
    .extract({ left: 0, top: 1100, width: 4672, height: 5840 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 86 })
    .toFile(path.join(cropDir, '6_editorial_floor_drape.jpg'));

  console.log('Test crops generated successfully!');
}

testCrops().catch(console.error);
