import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/4th';
const previewDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod4_previews';

if (!fs.existsSync(previewDir)) {
  fs.mkdirSync(previewDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.JPG') || f.endsWith('.jpg'));

async function generatePreviews() {
  for (const f of files) {
    const inPath = path.join(inputDir, f);
    const meta = await sharp(inPath).metadata();
    const outName = `${path.basename(f, path.extname(f))}_preview.jpg`;
    const outPath = path.join(previewDir, outName);

    const info = await sharp(inPath)
      .rotate()
      .resize({ width: 900, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outPath);

    console.log(`File: ${f} | Orient: ${meta.orientation} | Raw: ${meta.width}x${meta.height} | Rotated: ${info.width}x${info.height} -> Preview: ${outName}`);
  }
}

generatePreviews().catch(console.error);
