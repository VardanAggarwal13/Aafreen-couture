import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { isAdminUser } from '@/lib/admin-access';

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

// The fallback below exists only so local development works without configuration. A production
// server running on a key that is visible in the source code could have its sessions forged, so it
// refuses to start instead (the build step itself is exempt: it never serves requests).
const DEV_ONLY_SECRET = 'f7e5fc0a77f634b9e52e6d1fb69e5736833b401612cb4cabce8a9257af82fefd';
const authSecret = process.env.BETTER_AUTH_SECRET;
if (!authSecret && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
  throw new Error('BETTER_AUTH_SECRET is not set. Refusing to run in production with the built-in development key.');
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  secret: authSecret || DEV_ONLY_SECRET,

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
          // Owner addresses become admin only once the address is verified (e.g. Google sign-in);
          // an unverified e-mail/password sign-up must never be able to claim one.
          if (
            isAdminUser({ email: user.email, emailVerified: user.emailVerified })
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
