import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  const emailToPromote = process.argv[2] || 'vardanaggarwal13@gmail.com';
  console.log(`Promoting ${emailToPromote} to admin...`);

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const user = await db.collection('user').findOne({ email: emailToPromote.toLowerCase().trim() });
  if (!user) {
    console.error(`User with email ${emailToPromote} not found in database!`);
    await client.close();
    process.exit(1);
  }

  const updateResult = await db.collection('user').updateOne(
    { _id: user._id },
    {
      $set: {
        role: 'admin',
        emailVerified: true,
        updatedAt: new Date(),
      }
    }
  );

  console.log(`Successfully updated ${emailToPromote} to admin:`, updateResult);

  const verifiedUser = await db.collection('user').findOne({ _id: user._id });
  console.log('Verified user record:', {
    id: verifiedUser._id,
    name: verifiedUser.name,
    email: verifiedUser.email,
    role: verifiedUser.role,
    emailVerified: verifiedUser.emailVerified
  });

  await client.close();
}

run().catch(console.error);
