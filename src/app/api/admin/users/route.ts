import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth';
import { userRepository } from '@/server/repositories/user.repository';
import { auth } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { searchParams } = request.nextUrl;
    const role = searchParams.get('role') ?? undefined;
    const search = searchParams.get('search') ?? undefined;

    const users = await userRepository.findMany({ role, search }, { limit: 100 });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { name, email, password, phone, role = 'admin' } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) {
      // If user exists, update their role to the requested role
      const updated = await userRepository.updateRole(existing._id, role);
      return NextResponse.json({
        success: true,
        message: `Existing user ${normalizedEmail} updated to ${role}`,
        data: updated,
      });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Create via Better Auth API
    const authRes = await auth.api.signUpEmail({
      body: {
        name: name.trim(),
        email: normalizedEmail,
        password: password.trim(),
      },
    });

    if (!authRes || !authRes.user) {
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
    }

    // Set role and phone in user record
    await connectDB();
    const db = mongoose.connection.db;
    if (db) {
      await db.collection('user').updateOne(
        { email: normalizedEmail },
        {
          $set: {
            role,
            phone: phone || '',
            emailVerified: true,
            updatedAt: new Date(),
          },
        }
      );
    }

    const createdUser = await userRepository.findByEmail(normalizedEmail);
    return NextResponse.json(
      {
        success: true,
        message: `Admin user ${normalizedEmail} created successfully`,
        data: createdUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
