import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/5th';
const previewDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod5_previews';

if (!fs.existsSync(previewDir)) {
  fs.mkdirSync(previewDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.toLowerCase().endsWith('.jpg'));

async function makePreviews() {
  for (const f of files) {
    const inPath = path.join(inputDir, f);
    const meta = await sharp(inPath).metadata();
    const outName = `${path.parse(f).name}_preview.jpg`;
    const outPath = path.join(previewDir, outName);

    await sharp(inPath)
      .rotate()
      .resize({ width: 800, height: 1000, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toFile(outPath);

    console.log(`Preview: ${f} -> ${meta.width}x${meta.height}, orientation=${meta.orientation}`);
  }
}

makePreviews().catch(console.error);
