import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:/Users/vardan/projects/couture/un-stitched/3rd';
const previewDir = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch/prod3_previews';

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

    await sharp(inPath)
      .rotate() // auto-rotate orientation
      .resize({ width: 900, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outPath);

    console.log(`File: ${f} | Orient: ${meta.orientation} | Size: ${meta.width}x${meta.height} -> Preview: ${outName}`);
  }
}

generatePreviews().catch(console.error);
