/**
 * Recalculates every product's averageRating / reviewCount from approved reviews only.
 * Products with no approved reviews are reset to 0, which clears any placeholder ratings
 * written by the seed data.
 *
 * Run: npx tsx scripts/reset-ratings.ts
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) throw new Error('No database connection');

  const stats = await db
    .collection('reviews')
    .aggregate<{ _id: mongoose.Types.ObjectId; count: number; average: number }>([
      { $match: { isApproved: true } },
      { $group: { _id: '$product', count: { $sum: 1 }, average: { $avg: '$rating' } } },
    ])
    .toArray();

  const reset = await db.collection('products').updateMany({}, { $set: { averageRating: 0, reviewCount: 0 } });
  for (const row of stats) {
    await db
      .collection('products')
      .updateOne({ _id: row._id }, { $set: { averageRating: Math.round(row.average * 10) / 10, reviewCount: row.count } });
  }

  console.log(`Reset ${reset.modifiedCount} products; applied real ratings to ${stats.length}.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
