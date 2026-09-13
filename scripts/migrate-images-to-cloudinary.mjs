/**
 * One-time migration: uploads product images referenced in MongoDB from
 * local /public/images/products files to Cloudinary, then repoints the
 * product documents (images[] and variants[].images[]) at the new URLs.
 *
 * Local files are never deleted — they stay as a fallback.
 *
 * Usage:
 *   node scripts/migrate-images-to-cloudinary.mjs           (dry run — no DB writes, no uploads)
 *   node scripts/migrate-images-to-cloudinary.mjs --upload  (uploads to Cloudinary, still no DB writes)
 *   node scripts/migrate-images-to-cloudinary.mjs --write   (uploads AND updates MongoDB)
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({ path: '.env.local' });

const args = process.argv.slice(2);
const DO_UPLOAD = args.includes('--upload') || args.includes('--write');
const DO_WRITE = args.includes('--write');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', ProductSchema, 'products');

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function uploadOne(localPath) {
  const absPath = path.join(PUBLIC_DIR, localPath.replace(/^\//, ''));
  if (!fs.existsSync(absPath)) {
    return { localPath, ok: false, error: 'File not found on disk' };
  }
  const publicId = path.basename(localPath).replace(/\.[^.]+$/, '');
  try {
    const res = await cloudinary.uploader.upload(absPath, {
      folder: 'aafreen-couture/products',
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
    });
    return { localPath, ok: true, url: res.secure_url };
  } catch (err) {
    return { localPath, ok: false, error: err.message };
  }
}

async function main() {
  console.log(`Mode: ${DO_WRITE ? 'WRITE (upload + update DB)' : DO_UPLOAD ? 'UPLOAD ONLY (no DB writes)' : 'DRY RUN (no uploads, no writes)'}`);

  await mongoose.connect(process.env.MONGODB_URI);
  const products = await Product.find({}).lean();
  console.log(`Loaded ${products.length} products from MongoDB.`);

  // Collect every unique local image path referenced anywhere
  const uniquePaths = new Set();
  for (const p of products) {
    for (const img of p.images || []) {
      if (img.startsWith('/images/')) uniquePaths.add(img);
    }
    for (const v of p.variants || []) {
      for (const img of v.images || []) {
        if (img.startsWith('/images/')) uniquePaths.add(img);
      }
    }
  }
  console.log(`Found ${uniquePaths.size} unique local image paths referenced across all products.`);

  if (!DO_UPLOAD) {
    console.log('\n--- DRY RUN: sample of paths that would be uploaded ---');
    [...uniquePaths].slice(0, 10).forEach((p) => console.log(' ', p));
    if (uniquePaths.size > 10) console.log(`  ...and ${uniquePaths.size - 10} more`);
    console.log('\nRe-run with --upload to actually upload to Cloudinary (no DB writes yet), or --write to upload and update MongoDB.');
    await mongoose.disconnect();
    return;
  }

  // Upload phase
  const urlMap = new Map();
  const failures = [];
  let done = 0;
  for (const localPath of uniquePaths) {
    const result = await uploadOne(localPath);
    done++;
    if (result.ok) {
      urlMap.set(localPath, result.url);
    } else {
      failures.push(result);
    }
    if (done % 20 === 0 || done === uniquePaths.size) {
      console.log(`  Uploaded ${done}/${uniquePaths.size}...`);
    }
  }

  console.log(`\nUpload complete: ${urlMap.size} succeeded, ${failures.length} failed.`);
  if (failures.length > 0) {
    console.log('Failures:');
    failures.forEach((f) => console.log(`  ${f.localPath}: ${f.error}`));
  }

  if (!DO_WRITE) {
    console.log('\nUpload-only mode: MongoDB was not modified. Re-run with --write to apply the URL updates.');
    await mongoose.disconnect();
    return;
  }

  // Write phase — build bulk update operations
  const ops = [];
  let productsChanged = 0;
  for (const p of products) {
    let changed = false;

    const newImages = (p.images || []).map((img) => {
      if (urlMap.has(img)) {
        changed = true;
        return urlMap.get(img);
      }
      return img;
    });

    const newVariants = (p.variants || []).map((v) => {
      const newVariantImages = (v.images || []).map((img) => {
        if (urlMap.has(img)) {
          changed = true;
          return urlMap.get(img);
        }
        return img;
      });
      return { ...v, images: newVariantImages };
    });

    if (changed) {
      productsChanged++;
      ops.push({
        updateOne: {
          filter: { _id: p._id },
          update: { $set: { images: newImages, variants: newVariants } },
        },
      });
    }
  }

  if (ops.length > 0) {
    const res = await Product.bulkWrite(ops);
    console.log(`\nMongoDB updated: ${productsChanged} products modified (matched: ${res.matchedCount}, modified: ${res.modifiedCount}).`);
  } else {
    console.log('\nNo products needed updating.');
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
