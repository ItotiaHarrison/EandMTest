// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

async function main() {
  try {
    // Clear existing data
    await prisma.employee.deleteMany();
    await prisma.department.deleteMany();
    await prisma.admin.deleteMany();

    console.log('Existing data cleared');

    // Create departments
    const departments = [
      { name: 'Engineering' },
      { name: 'Marketing' },
      { name: 'Sales' },
      { name: 'Human Resources' },
      { name: 'Finance' },
      { name: 'Operations' },
      { name: 'Customer Support' },
      { name: 'Research & Development' },
      { name: 'Legal' },
      { name: 'Product Management' },
      { name: 'Quality Assurance' },
      { name: 'Business Development' },
    ];

    const createdDepartments = await Promise.all(
      departments.map(dept =>
        prisma.department.create({
          data: dept
        })
      )
    );

    console.log('Departments seeded successfully');

    // Create admin users
    const adminPassword = await hashPassword('Admin@123');
    
    const admins = [
      {
        name: 'Super Admin',
        email: 'admin@company.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        name: 'John Manager',
        email: 'john@company.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        name: 'Sarah Admin',
        email: 'sarah@company.com',
        password: adminPassword,
        role: 'admin'
      }
    ];

    const createdAdmins = await Promise.all(
      admins.map(admin =>
        prisma.admin.create({
          data: admin
        })
      )
    );

    console.log('Admins seeded successfully');

    // Create employees
    const employees = [
      {
        fullName: 'James Wilson',
        email: 'james.wilson@company.com',
        phone: '+1234567890',
        position: 'Senior Software Engineer',
        departmentId: createdDepartments[0].id,
        status: 'active',
        createdBy: createdAdmins[0].id
      },
      {
        fullName: 'Emily Brown',
        email: 'emily.brown@company.com',
        phone: '+1234567891',
        position: 'Marketing Manager',
        departmentId: createdDepartments[1].id,
        status: 'active',
        createdBy: createdAdmins[0].id
      },
      {
        fullName: 'Michael Chen',
        email: 'michael.chen@company.com',
        phone: '+1234567892',
        position: 'Sales Director',
        departmentId: createdDepartments[2].id,
        status: 'active',
        createdBy: createdAdmins[0].id
      },
      {
        fullName: 'Sofia Rodriguez',
        email: 'sofia.rodriguez@company.com',
        phone: '+1234567893',
        position: 'HR Manager',
        departmentId: createdDepartments[3].id,
        status: 'active',
        createdBy: createdAdmins[1].id
      },
      {
        fullName: 'David Kim',
        email: 'david.kim@company.com',
        phone: '+1234567894',
        position: 'Financial Analyst',
        departmentId: createdDepartments[4].id,
        status: 'active',
        createdBy: createdAdmins[1].id
      }
    ];

    await Promise.all(
      employees.map(employee =>
        prisma.employee.create({
          data: employee
        })
      )
    );

    console.log('Employees seeded successfully');

  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
