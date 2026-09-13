import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/5th';
const cropDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod5_crops_v2';

if (!fs.existsSync(cropDir)) {
  fs.mkdirSync(cropDir, { recursive: true });
}

async function testV2() {
  // 1. Hero: Angled table ensemble from _A742159.JPG (Portrait 4672x7008)
  // Let's crop tighter around the folded silk and table drape
  // 4:5 ratio: e.g. 4200 x 5250
  await sharp(path.join(inputDir, '_A742159.JPG'))
    .rotate()
    .extract({ left: 236, top: 1200, width: 4200, height: 5250 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(cropDir, '1_hero_angled_ensemble.jpg'));

  // 2. Macro Embroidery from _A742156.JPG (Portrait 4672x7008)
  // Tight on chevron corner
  await sharp(path.join(inputDir, '_A742156.JPG'))
    .rotate()
    .extract({ left: 100, top: 1800, width: 4400, height: 5000 }) // wait 4400 x 5500 is 4:5!
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(cropDir, '2_macro_chevron_embroidery.jpg'));

  // 3. Flat-lay Dual Panels from _A742152.JPG (Landscape 7008x4672)
  // Centered 4:5 crop on both fabrics: width = 3600, height = 4500
  // left: 1800, top: 80
  await sharp(path.join(inputDir, '_A742152.JPG'))
    .rotate()
    .extract({ left: 1750, top: 80, width: 3600, height: 4500 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(cropDir, '3_flatlay_dual_panels.jpg'));

  // 4. Boutique Gift Packaging from _A742155.JPG (Portrait 3072x4608)
  // Crop tighter so less empty white tissue at top:
  // e.g. width = 2900, height = 3625 (4:5)
  // left = 86, top = 800
  await sharp(path.join(inputDir, '_A742155.JPG'))
    .rotate()
    .extract({ left: 86, top: 850, width: 2900, height: 3625 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(cropDir, '4_presentation_chest.jpg'));

  // 5. Heirloom Jewelry Tikka from _A742154.JPG (Landscape 4608x3072)
  // Rotate 270 deg so hook is at top, pendant at bottom!
  // After rotating 270 deg, dimensions become 3072x4608!
  // 4:5 ratio: e.g. width = 2400, height = 3000
  // In the rotated image, let's check where the tikka is centered.
  // First let's inspect rotated dimensions:
  const tikkaRotated = sharp(path.join(inputDir, '_A742154.JPG')).rotate(270);
  const tMeta = await tikkaRotated.metadata();
  console.log('Tikka rotated 270 meta:', tMeta.width, tMeta.height);

  await sharp(path.join(inputDir, '_A742154.JPG'))
    .rotate(270)
    .extract({ left: 336, top: 600, width: 2400, height: 3000 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(cropDir, '5_tikka_vertical.jpg'));

  // 6. Editorial Floor Drape from _A742157.JPG (Portrait 4672x7008)
  // width = 4600, height = 5750 (4:5)
  // left = 36, top = 1100
  await sharp(path.join(inputDir, '_A742157.JPG'))
    .rotate()
    .extract({ left: 36, top: 1100, width: 4600, height: 5750 })
    .resize({ width: 1200, height: 1500, fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(cropDir, '6_editorial_floor_drape.jpg'));

  console.log('V2 crops done!');
}

testV2().catch(console.error);
