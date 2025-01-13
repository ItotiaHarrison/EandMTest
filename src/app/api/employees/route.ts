import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

// Validating employee data
const EmployeeSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  position: z.string().min(2, 'Position must be at least 2 characters'),
  departmentId: z.string().min(2, 'Department must be at least 2 characters'),
});

export async function POST(req: Request) {
  try {
    // Verifying authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const verified = await verifyToken(token);

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = EmployeeSchema.parse(body);

    // Checking if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Creating new employee
    const employee = await prisma.employee.create({
      data: {
        ...validatedData,
        status: 'pending',
        createdBy: verified.id,
      },
    });

    return NextResponse.json({
      message: 'Employee added successfully',
      employee,
    });

  } catch (error) {
    console.error('Add employee error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add employee' },
      { status: 500 }
    );
  }
}

// endpoint to fetch all employees
export async function GET(req: Request) {
  try {
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const verified = await verifyToken(token);

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetching all employees
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(employees);

  } catch (error) {
    console.error('Fetch employees error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}
