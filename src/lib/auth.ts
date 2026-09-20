import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

declare global {
  var _betterAuthMongoClient: MongoClient | undefined;
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not set. Create .env.local with your MongoDB Atlas connection string.');
}

// Reuse MongoClient in development to avoid connection exhaustion across HMR reloads
const client =
  globalThis._betterAuthMongoClient ??
  new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    maxPoolSize: 10,
  });

if (process.env.NODE_ENV === 'development') {
  globalThis._betterAuthMongoClient = client;
}

const db = client.db('aafreen-couture');

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || 'f7e5fc0a77f634b9e52e6d1fb69e5736833b401612cb4cabce8a9257af82fefd',

  trustedOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.NEXT_PUBLIC_APP_URL || '',
    process.env.BETTER_AUTH_URL || '',
  ].filter(Boolean),

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID.trim(),
            clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
          },
        }
      : {}),
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,       // refresh session daily if active
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },

  user: {
    additionalFields: {
      role: {
        type: 'string' as const,
        defaultValue: 'customer',
      },
      phone: { type: 'string' as const, required: false },
      isActive: { type: 'boolean' as const, defaultValue: true },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email = user.email.toLowerCase();
          const adminEmail = (process.env.ADMIN_EMAIL || 'vardanaggarwal13@gmail.com').toLowerCase();
          if (
            email === adminEmail ||
            email === 'vardanaggarwal13@gmail.com' ||
            email === 'support@aafreencouture.com'
          ) {
            return {
              data: {
                ...user,
                role: 'admin',
              },
            };
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
