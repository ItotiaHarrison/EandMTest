import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { z } from 'zod'; 

// Validation schema
const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = SignupSchema.parse(body);

    // Checking if email already exists
    const existingUser = await prisma.admin.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

  
    const newAdmin = await prisma.admin.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: 'admin',
      },
    });

    // Generate JWT token
    const token = await generateToken({
      id: newAdmin.id,
      email: newAdmin.email,
      role: newAdmin.role,
    });

    // Remove password from response
    const { password: _, ...adminData } = newAdmin;

    return NextResponse.json({
      message: 'Account created successfully',
      user: adminData,
      token,
    });

  } catch (error) {
    console.error('Signup error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
