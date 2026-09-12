import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/2nd';
const outputDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod2_previews';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.toLowerCase().endsWith('.jpg'));

async function process() {
  for (const f of files) {
    const inPath = path.join(inputDir, f);
    const outPath = path.join(outputDir, f.replace(/\.jpg$/i, '_preview.jpg'));
    const meta = await sharp(inPath).metadata();
    console.log(f, meta.width, 'x', meta.height, 'orientation:', meta.orientation);
    await sharp(inPath)
      .rotate()
      .resize({ width: 900, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outPath);
    console.log('Saved preview:', outPath);
  }
}

process().catch(console.error);
