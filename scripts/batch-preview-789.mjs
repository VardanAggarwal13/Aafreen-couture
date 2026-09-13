import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const scratchBase = 'C:/Users/Super-A/.gemini/antigravity-ide/brain/cf30938f-a131-4976-b161-664a772df46e/scratch';

async function generateFolderPreviews(folderName) {
  const inputDir = path.join('c:/Users/vardan/projects/couture/un-stitched', folderName);
  const outDir = path.join(scratchBase, `prod${folderName}_previews`);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir).filter(f => f.toLowerCase().endsWith('.jpg'));
  for (const f of files) {
    const inPath = path.join(inputDir, f);
    const meta = await sharp(inPath).metadata();
    const outName = `${path.parse(f).name}_preview.jpg`;
    const outPath = path.join(outDir, outName);

    await sharp(inPath)
      .rotate()
      .resize({ width: 800, height: 1000, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toFile(outPath);

    console.log(`[${folderName}] ${f} -> ${meta.width}x${meta.height} (orient: ${meta.orientation})`);
  }
}

async function run() {
  await generateFolderPreviews('7th');
  await generateFolderPreviews('8th');
  await generateFolderPreviews('9th');
  console.log('All previews generated!');
}

run().catch(console.error);
