import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust import path if needed

// IMPORTANT: This route should only be accessible in development environments.
// Add necessary security checks if deploying this feature.

export async function GET() {
  // Basic check for development environment
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    );
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        // Assuming you have a 'role' field on your User model
        // Adjust the field name if it's different (e.g., roles, userRole)
        role: true,
      },
      // Optionally limit the number of users for performance
      // take: 50,
    });

    // Ensure the role matches the expected UserRole type if possible,
    // otherwise, the consuming component might need casting/validation.
    // For simplicity here, we assume the DB role matches 'user' | 'admin' | 'guest'.

    return NextResponse.json(users);

  } catch (error) {
    console.error("[DEV_TOOLS_USERS_API] Error fetching users:", error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
