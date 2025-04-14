import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure named import
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  console.log("--- Register API Start ---");
  try {
    const body = await request.json();
    const { email, password, name } = body;
    console.log("Request Body:", body);

    // --- Basic Input Validation ---
    if (!email || !password || !name) {
      console.warn('Validation Failed: Missing required fields');
      return NextResponse.json({ error: 'Missing required fields (email, password, name)' }, { status: 400 });
    }

    if (password.length < 6) { // Example: enforce minimum password length
      console.warn('Validation Failed: Password too short');
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // --- Check if user already exists ---
    console.log(`Checking for existing user with email: ${email}`);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.warn(`User already exists: ${email}`);
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 }); // 409 Conflict
    }
    console.log("User does not exist, proceeding with registration.");

    // --- Hash Password ---
    console.log("Hashing password...");
    const saltRounds = 10; // Recommended salt rounds
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log("Password hashed successfully.");

    // --- Create User ---
    console.log("Creating user in database...");
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash, // Store the hashed password
        name,
        // Add other default fields if necessary (e.g., roleId)
        // fullName: name, // Optionally set fullName too
      },
      select: { // Select only non-sensitive fields to return
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    });
    console.log("User created successfully:", newUser);

    // --- Return Success Response ---
    // You might want to trigger email verification here if needed
    console.log("--- Register API End (Success) ---");
    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('Registration API Error:', error);
    // Log the specific error for debugging
    if (error instanceof Error) {
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
    }
    // Check for Prisma specific errors if needed
    // if (error instanceof Prisma.PrismaClientKnownRequestError) { ... }
    console.log("--- Register API End (Error) ---");
    return NextResponse.json({ error: 'Internal Server Error during registration' }, { status: 500 });
  }
}
