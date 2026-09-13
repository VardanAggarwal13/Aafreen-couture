import sharp from 'sharp';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/5th';
const cropDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod5_crops_v2';

async function testTikka() {
  // Test a few vertical positions on rotated image
  // Rotated 270 deg: width = 3072, height = 4608
  // 4:5 -> 2400 x 3000 or 2560 x 3200
  const tests = [
    { name: 'tikka_test_1.jpg', left: 336, top: 1000, width: 2400, height: 3000 },
    { name: 'tikka_test_2.jpg', left: 256, top: 900, width: 2560, height: 3200 },
    { name: 'tikka_test_3.jpg', left: 200, top: 800, width: 2700, height: 3375 },
  ];

  for (const t of tests) {
    await sharp(path.join(inputDir, '_A742154.JPG'))
      .rotate(270)
      .extract({ left: t.left, top: t.top, width: t.width, height: t.height })
      .resize({ width: 1200, height: 1500, fit: 'cover' })
      .jpeg({ quality: 88 })
      .toFile(path.join(cropDir, t.name));
    console.log('Saved', t.name);
  }
}

testTikka().catch(console.error);
